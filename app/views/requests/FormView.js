var $ = require('jquery');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.Validation = require('backbone.validation');
var Request = require('../../models/Request');
var Status = require('../../models/Status');
var Document = require('../../models/Document');
var Documents = require('../../collections/Documents');

module.exports = Backbone.Marionette.ItemView.extend({
    className: 'panel panel-default',
    template: '#request_form_view',
    ui: {
        requestForm: '#request_form',
        saveBtn: '.save-btn',
        submitBtn: '.submit-btn'
    },
    events: {
        'click @ui.saveBtn': 'onClickSave',
        'click @ui.submitBtn': 'onClickSubmit'
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
                var file = formData.get('file');
                if(file.size === 0) {
                    Backbone.history.navigate('/requests', {trigger: true});
                } else {
                    var document = new Document();
                    document.setUrl(request.id);
                    var fileData = new FormData();
                    fileData.append('file', file);
                    var options = {
                        processData: false,
                        contentType: false,
                        data: fileData,
                        wait: true,
                        success: function() {
                            Backbone.history.navigate('/requests', {trigger: true})
                        }
                    }
                    document.save({}, options);
                }
            }
        };
        this.model.save({}, options);
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
