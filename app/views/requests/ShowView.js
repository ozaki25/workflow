var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.Validation = require('backbone.validation');
Backbone.csrf = require('../../csrf');
Backbone.csrf();
var Documents = require('../../collections/Documents');
var RequestFormView = require('./RequestFormView');

module.exports = Backbone.Marionette.LayoutView.extend({
    className: 'panel panel-default',
    template: '#show_request_view',
    ui: {
        saveBtn: '.save-btn',
        submitBtn: '.submit-btn',
        workBtn: '.work-btn',
        approveBtn: '.approve-btn',
        rejectBtn: '.reject-btn',
        destroyBtn: '.destroy-btn'
    },
    events: {
        'click @ui.saveBtn': 'onClickSave',
        'click @ui.submitBtn': 'onClickSubmit',
        'click @ui.workBtn': 'onClickWork',
        'click @ui.approveBtn': 'onClickApprove',
        'click @ui.rejectBtn': 'onClickReject',
        'click @ui.destroyBtn': 'onClickDestroy'
    },
    regions: {
        requestForm: '#request_form'
    },
    initialize: function(options) {
        this.currentUser = options.currentUser;
        this.statusList = options.statusList;
        this.teamList = options.teamList;
        this.categoryList = options.categoryList;
        this.documents = new Documents(this.model.get('documents'));
        if(!this.model.isNew()) this.documents.setUrl(this.model.id);
    },
    templateHelpers: function() {
        return {
            save    : this.canRequest() ? '<button type="button" class="btn btn-default save-btn">Save</button>' : '',
            submit  : this.canRequest() ? '<button type="button" class="btn btn-default submit-btn">Submit</button>' : '',
            work    : this.canWork() ? '<button type="button" class="btn btn-default work-btn">' + this.model.getProgressBtnLabel() + '</button>' : '',
            approve : this.canApprove() ? '<button type="button" class="btn btn-default approve-btn">' + this.model.getProgressBtnLabel() + '</button>' : '',
            reject  : this.canReject() ? '<button type="button" class="btn btn-default reject-btn">Reject</button>' : '',
            destroy : this.canDestroy() ? '<button type="button" class="btn btn-default destroy-btn">Destroy</button>' : ''
        }
    },
    onRender: function() {
        var requestFormView = new RequestFormView({model: this.model,
                                                   currentUser: this.currentUser,
                                                   teamList: this.teamList,
                                                   categoryList: this.categoryList,
                                                   canRequest: this.canRequest()});
        this.getRegion('requestForm').show(requestFormView);
    },
    onClickSave   : function() { this.setRequest(this.model.getStatusAfterSave(), false); },
    onClickSubmit : function() { this.setRequest(this.model.getStatusAfterProgressing(), true); },
    onClickWork   : function() { this.setWork(this.model.getStatusAfterProgressing()); },
    onClickApprove: function() { this.saveRequest(this.model.getStatusAfterProgressing()); },
    onClickReject : function() { this.saveRequest(this.model.getStatusAfterRejection()); },
    onClickDestroy: function() {
        var options = {
            wait: true,
            success: function() {
                Backbone.history.navigate('/requests', {trigger: true});
            }
        };
        this.model.destroy(options);
    },
    setRequest: function(nextStatusCode, validate) {
        validate ? this.bindBackboneValidation() : this.unbindBackboneValidation();
        var title = this.$('input.title').val().trim();
        var content = this.$('textarea.content').val().trim();
        var inputDivision = this.$('select.division').val();
        var division = !!inputDivision ? {id: inputDivision} : null;
        var inputAuthorizer = this.$('input.authorizer').val();
        var authorizer = !!inputAuthorizer ? JSON.parse(inputAuthorizer) : null;
        var applicant = this.model.isNew() ? this.currentUser : this.model.get('applicant');
        this.model.set({
            title: title,
            content: content,
            division: division,
            authorizer: authorizer,
            applicant: applicant,
            documents: []
        });
        if(this.model.isValid(true)) this.saveRequest(nextStatusCode, true);
    },
    setWork: function(nextStatusCode) {
        //var content = this.ui.inputContent.val().trim();
        var content = '内容'
        this.model.set({
            work: {content: content}
        });
        this.saveRequest(nextStatusCode);
    },
    saveRequest: function(nextStatusCode, canEditFile = false) {
        var statusId = this.statusList.findWhere({code: nextStatusCode}).id;
        var options = {
            wait: true,
            success: function(request) {
                if(canEditFile) {
                    this.saveFile(request);
                    this.deleteFile(request);
                }
                Backbone.history.navigate('/requests', {trigger: true});
            }.bind(this)
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
            var id = parseInt(this.$(file).val());
            this.documents.findWhere({id: id}).destroy({wait: true});
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
    canEdit: function() {
        return this.model.isCreating() &&
            (this.currentUser.isApplicant(this.model) || this.currentUser.isAdmin());
    },
    canApproveRequest: function() {
        return this.model.isWaitingApprove() &&
            (this.currentUser.isAuthorizer(this.model) || this.currentUser.isAdmin());
    },
    canAccept: function() {
        return this.model.isWaitingAccept() &&
            (this.currentUser.isReceptionist(this.model.get('division').category.receptnists) || this.currentUser.isAdmin());
    },
    canReport: function() {
        return this.model.isWaitingWorkComplete() &&
            (this.currentUser.isWorker(this.model) || this.currentUser.isAdmin());
    },
    canFinish: function() {
        return this.model.isWaitingFinish() &&
            (this.currentUser.isReceptionist(this.model.get('division').category.receptnists) || this.currentUser.isAdmin());
    },
    canRestore: function() {
        return this.model.isCompleted() &&
            (this.currentUser.isReceptionist(this.model.get('division').category.receptnists) || this.currentUser.isAdmin());
    },
    canRequest: function() {
        return this.model.isNew() || this.canEdit();
    },
    canWork: function() {
        return this.canAccept() || this.canReport();
    },
    canApprove: function() {
        return this.canApproveRequest() || this.canFinish();
    },
    canReject: function() {
        return this.canApprove() || this.canWork() || this.canRestore();
    },
    canDestroy: function() {
        return this.canEdit() || (!this.model.isNew() && this.currentUser.isAdmin());
    }
});
