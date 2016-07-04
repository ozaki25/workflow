var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.Validation = require('backbone.validation');
Backbone.csrf = require('../../csrf');
Backbone.csrf();
var Document = require('../../models/Document');
var Documents = require('../../collections/Documents');
var DownloadFilesView = require('./DownloadFilesView');
var UsersModalView = require('./UsersModalView');

module.exports = Backbone.Marionette.LayoutView.extend({
    className: 'panel panel-default',
    template: '#request_form_view',
    ui: {
        inputTitle: 'input.title',
        inputContent: 'textarea.content',
        inputFile: 'input.file-tmp',
        inputAuthorizer: 'input.authorizer',
        saveBtn: '.save-btn',
        submitBtn: '.submit-btn',
        approvalBtn: '.approval-btn',
        rejectBtn: '.reject-btn'
    },
    events: {
        'change @ui.inputFile': 'selectedFile',
        'click .remove-file': 'onClickRemoveFile',
        'click @ui.saveBtn': 'onClickSave',
        'click @ui.submitBtn': 'onClickSubmit',
        'click @ui.approvalBtn': 'onClickApproval',
        'click @ui.rejectBtn': 'onClickReject'
    },
    regions: {
        downloadFiles: '#download_file_list',
        authorizerModal: '#select_authorizer_modal'
    },
    initialize: function(options) {
        this.currentUser = options.currentUser;
        this.statusList = options.statusList;
        this.documents = new Documents(this.model.get('documents'));
        if(!this.model.isNew()) this.documents.setUrl(this.model.id);
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
            authorizer: function() {
                if(!this.isCreate()) {
                    return '<p class="form-control-static">' + this.model.get('authorizer').name + '(' + this.model.get('authorizer').uid + ')' + '</p>';
                } else if(this.model.get('authorizer')) {
                    return '<p class="form-control-static">' + this.model.get('authorizer').name + '(' + this.model.get('authorizer').uid + ')' + '</p>' +
                        '<input type="hidden" class="authorizer" value="' + this.model.get('authorizer').id + '" />';
                } else {
                    return '<input type="text" class="form-control authorizer" name="authorizer" />' +
                        '<button type="button" class="btn btn-default" data-toggle="modal" data-target="#authorizer_list_modal">Selected Authorizer</button>';
                }
            }.bind(this),
            save: this.isCreate() ? '<button type="button" class="btn btn-default save-btn">Save</button>' : '',
            submit: this.isCreate() ? '<button type="button" class="btn btn-default submit-btn">Submit</button>' : '',
            approval: this.isApproval() ? '<button type="button" class="btn btn-default approval-btn">Approval</button>' : '',
            reject: this.isApproval() ? '<button type="button" class="btn btn-default reject-btn">Reject</button>' : ''
        }
    },
    onRender: function() {
        if(!this.model.isNew()) {
            var downloadFilesView = new DownloadFilesView({collection: this.documents});
            this.getRegion('downloadFiles').show(downloadFilesView);
        }
        if(this.isCreate()) this.getRegion('authorizerModal').show(new UsersModalView());
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
    onClickApproval: function() {
        this.updateStatus(3);
    },
    onClickReject: function() {
        this.updateStatus(1);
    },
    saveRequest: function(nextStatus, validate) {
        validate ? this.bindBackboneValidation() : this.unbindBackboneValidation();
        var title = this.ui.inputTitle.val().trim();
        var content = this.ui.inputContent.val().trim();
        var authorizerId = this.isCreate() ? this.ui.inputAuthorizer.val() : this.model.get('authorizer').id;
        var userId = this.model.isNew() ? this.currentUser.id : this.model.get('user').id;
        var statusId = this.statusList.findWhere({code: nextStatus}).id;
        var options = {
            wait: true,
            success: function(request) {
                this.saveFile(request);
                this.deleteFile(request);
                Backbone.history.fragment === 'requests' ?
                    Backbone.history.loadUrl(Backbone.history.fragment) :
                    Backbone.history.navigate('/requests', {trigger: true});
            }.bind(this)
        };
        this.model.set({
            title: title,
            content: content,
            user: {id: userId},
            status: {id: statusId},
            authorizer: {id: authorizerId}
        });
        this.model.save({}, options);
    },
    updateStatus: function(nextStatus) {
        var statusId = this.statusList.findWhere({code: nextStatus}).id;
        var options = {
            wait: true,
            success: function() {
                Backbone.history.navigate('/requests', {trigger: true});
            }
        };
        this.model.save({status: {id: statusId}}, options);
    },
    saveFile: function(request) {
        _(this.$('input.file')).each(function(file) {
            var formData = new FormData();
            formData.append('file', this.$(file).prop('files')[0]);
            var options = {
                processData: false,
                contentType: false,
                data: formData,
                wait: true
            }
            this.documents.setUrl(request.id);
            this.documents.create({}, options);
        }.bind(this));
    },
    deleteFile: function(request) {
        _(this.$('input.remove-file')).each(function(file) {
            var id = this.$(file).val();
            this.documents.findWhere({id: parseInt(id)}).destroy({wait: true});
        }.bind(this));
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
    },
    isCreate: function() {
        return this.model.isNew() || (this.model.isCreating() && this.currentUser.isRequestUser(this.model))
    },
    isApproval: function() {
        return !this.model.isNew() && this.model.isWaitingApproval() && this.currentUser.isApproveUser();
    }
});
