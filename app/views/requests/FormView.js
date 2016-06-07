var $ = require('jquery');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.Validation = require('backbone.validation');
var Request = require('../../models/Request');
var Status = require('../../models/Status');

module.exports = Backbone.Marionette.ItemView.extend({
    className: 'panel panel-default',
    template: '#request_form_view',
    ui: {
        inputTitle: 'input.title',
        inputContent: 'textarea.content',
        saveBtn: '.save-btn',
        submitBtn: '.submit-btn',
        approvalBtn: '.approval-btn',
        rejectBtn: '.reject-btn'
    },
    events: {
        'click @ui.saveBtn': 'onClickSave',
        'click @ui.submitBtn': 'onClickSubmit',
        'click @ui.approvalBtn': 'onClickApproval',
        'click @ui.rejectBtn': 'onClickReject'
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
            save: function() {
                if(this.isCreate()) return '<button type="button" class="btn btn-default save-btn">Save</button>'
            }.bind(this),
            submit: function() {
                if(this.isCreate()) return '<button type="button" class="btn btn-default submit-btn">Submit</button>'
            }.bind(this),
            approval: function() {
                if(this.isApproval()) return '<button type="button" class="btn btn-default approval-btn">Approval</button>'
            }.bind(this),
            reject: function() {
                if(this.isApproval()) return '<button type="button" class="btn btn-default reject-btn">Reject</button>'
            }.bind(this)
        }
    },
    onRender: function() {
        if(!this.model.isNew()) {
            this.ui.inputTitle.val(this.model.get('title'));
            this.ui.inputContent.val(this.model.get('content'));
        }
    },
    onClickSave: function() {
        this.saveRequest(0, false);
    },
    onClickSubmit: function() {
        this.saveRequest(1, true);
    },
    onClickApproval: function() {
        this.saveRequest(2, true);
    },
    onClickReject: function() {
        this.saveRequest(0, true);
    },
    saveRequest: function(nextStatus, validate) {
        validate ? this.bindBackboneValidation() : this.unbindBackboneValidation();
        var title = this.ui.inputTitle.val().trim();
        var content = this.ui.inputContent.val().trim();
        var status = this.statusList.findWhere({code: nextStatus});
        this.model.set({
            title: title,
            content: content,
            user: this.currentUser,
            status: status
        });
        if(!validate || this.model.isValid(true)) {
            this.model.save({}, {wait: true});
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
    },
    isCreate: function() {
        return this.model.isNew() || (this.model.isCreating() && this.currentUser.isRequestUser(this.model))
    },
    isApproval: function() {
        return !this.model.isNew() && this.model.isWaitingApproval() && this.currentUser.isApproveUser()
    }
});
