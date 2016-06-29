var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.Validation = require('backbone.validation');
var Request = require('../../models/Request');
var Status = require('../../models/Status');
var Document = require('../../models/Document');
var Documents = require('../../collections/Documents');
var DownloadFilesView = require('./DownloadFilesView');

module.exports = Backbone.Marionette.LayoutView.extend({
    className: 'panel panel-default',
    template: '#request_form_view',
    ui: {
        requestForm: '#request_form',
        inputFile: 'input.file-tmp',
        saveBtn: '.save-btn',
        submitBtn: '.submit-btn'
    },
    events: {
        'change @ui.inputFile': 'selectedFile',
        'click .remove-file': 'onClickRemoveFile',
        'click @ui.saveBtn': 'onClickSave',
        'click @ui.submitBtn': 'onClickSubmit'
    },
    regions: {
        downloadFiles: '#download_file_list'
    },
    initialize: function(options) {
        this.currentUser = options.currentUser;
        this.statusList = options.statusList;
    },
    templateHelpers: function() {
        return {
            id: function() {
                if(!this.model.isNew()) {
                    return '<div class="form-group">' +
                             '<label class="col-sm-2 control-label">ID</label>' +
                             '<div class="col-sm-10">' +
                               '<p class="form-control-static">' + this.model.id + '</p>' +
                             '</div>' +
                           '</div>'
                }
            }.bind(this),
            status: function() {
                if(!this.model.isNew()) {
                    return '<div class="form-group">' +
                             '<label class="col-sm-2 control-label">Status</label>' +
                             '<div class="col-sm-10">' +
                               '<p class="form-control-static">' + this.model.get('status').name + '</p>' +
                             '</div>' +
                           '</div>'
                }
            }.bind(this),
            inputedTitle: this.model.isNew() ? '' : this.model.get('title'),
            inputedContent: this.model.isNew() ? '' : this.model.get('content')
        }
    },
    onRender: function() {
        var documents = new Documents(this.model.get('documents'));
        documents.setUrl(this.model.id);
        var downloadFilesView = new DownloadFilesView({collection: documents});
        this.getRegion('downloadFiles').show(downloadFilesView);
    },
    selectedFile: function(e) {
        var input = this.$(e.target);
        var file = input.prop('files');
        if(file.length !== 0) {
            var latestFileNo = this.$('input.file:last').attr('id');
            var fileNo = latestFileNo ? parseInt(latestFileNo) + 1 : 1
            var newInput = input.clone();
            input.after(newInput);
            input.after(
                '<p class="' + fileNo + '">' +
                    '<span>' + file[0].name + '</span>' +
                    '<a href="#" class="btn btn-link btn-xs remove-file">&times;</a>' +
                '</p>'
            );
            input.attr('id', fileNo).addClass('file hide ' + fileNo).removeClass('file-tmp');
        }
    },
    onClickRemoveFile: function(e) {
        e.preventDefault();
        var fileNo = $(e.target).closest('p').attr('class');
        this.$('.' + fileNo).remove();
    },
    onClickSave: function() {
        this.saveRequest(1, false);
    },
    onClickSubmit: function() {
        this.saveRequest(2, true);
    },
    saveRequest: function(nextStatus, validate) {
        validate ? this.bindBackboneValidation() : this.unbindBackboneValidation();
        var formData = new FormData(this.ui.requestForm[0]);
        var status = this.statusList.findWhere({code: nextStatus});
        var documents = this.model.isNew() ? null : this.model.get('documents');
        this.model.set({
            title: formData.get('title'),
            content: formData.get('content'),
            user: {id: this.currentUser.id},
            status: {id: status.id},
            documents: documents
        });
        var options = {
            wait: true,
            success: function(request) {
                this.saveFile(request);
                this.deleteFile(request);
            }.bind(this)
        };
        this.model.save({}, options);
    },
    saveFile: function(request) {
        var inputFiles = this.$('input.file');
        if(inputFiles.length) {
            _(inputFiles).each(function(file) {
                var formData = new FormData();
                formData.append('file', this.$(file).prop('files')[0]);
                var options = {
                    processData: false,
                    contentType: false,
                    data: formData,
                    wait: true
                }
                var documents = new Documents();
                documents.setUrl(request.id);
                documents.create({}, options);
            }.bind(this));
        } else {
            Backbone.history.navigate('/requests', {trigger: true});
        }
    },
    deleteFile: function(request) {
        var removeFiles = this.$('input.remove-file');
        if(removeFiles.length) {
            _(removeFiles).each(function(file) {
                var id = this.$(file).val();
                var options = {
                    wait: true,
                    success: function() {
                        Backbone.history.navigate('/requests', {trigger: true})
                    }
                }
                var documents = new Documents();
                documents.setUrl(request.id);
                var document = new Document({id: id}, {collection: documents});
                var result = document.destroy(options);
            }.bind(this));
        } else {
            Backbone.history.navigate('/requests', {trigger: true});
        }
    },
    bindBackboneValidation: function() {
        Backbone.Validation.bind(this, {
            valid: function(view, attr) {
                var control = view.$('[name=' + attr + ']');
                var group = control.closest('.form-group');
                group.removeClass('has-error').find('.help-block').remove();
            },
            invalid: function(view, attr, error) {
                var control = view.$('[name=' + attr + ']');
                var group = control.closest('.form-group');
                group.addClass('has-error')
                if(group.find('.help-block').length == 0) {
                    control.after('<p class="help-block"></p>');
                }
                group.find('.help-block').text(error);
            }
        });
    },
    unbindBackboneValidation: function() {
        Backbone.Validation.unbind(this);
    }
});
