var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.Validation = require('backbone.validation');
Backbone.csrf = require('../../csrf');
Backbone.csrf();
var Documents = require('../../collections/Documents');
var Divisions = require('../../collections/Divisions');
var Users = require('../../collections/Users');
var DownloadFilesView = require('./DownloadFilesView');
var UsersModalView = require('../UsersModalView');
var ParagraphView = require('../ParagraphView');
var SelectboxView = require('../../lib/SelectboxView');
var InputView = require('../../lib/InputView');
var TextareaView = require('../../lib/TextareaView');

module.exports = Backbone.Marionette.LayoutView.extend({
    className: 'panel panel-default',
    template: '#request_form_view',
    ui: {
        inputFile: 'input.file',
        openAuthorizerBtn: 'button.open-authorizer-modal',
        saveBtn: '.save-btn',
        submitBtn: '.submit-btn',
        workBtn: '.work-btn',
        approveBtn: '.approve-btn',
        rejectBtn: '.reject-btn',
        destroyBtn: '.destroy-btn'
    },
    events: {
        'change @ui.inputFile': 'onSelectFile',
        'click @ui.saveBtn': 'onClickSave',
        'click @ui.submitBtn': 'onClickSubmit',
        'click @ui.workBtn': 'onClickWork',
        'click @ui.approveBtn': 'onClickApprove',
        'click @ui.rejectBtn': 'onClickReject',
        'click @ui.destroyBtn': 'onClickDestroy'
    },
    childEvents: {
        'select:user': 'onSelectAuthorizer',
        'change:category': 'onChangeCategorySelectbox',
    },
    regions: {
        requestIdRegion: '#request_id_region',
        statusRegion: '#status_region',
        categoryRegion: '#category_region',
        divisionRegion: '#division_region',
        titleRegion: '#title_region',
        contentRegion: '#content_region',
        downloadFilesRegion: '#download_files_region',
        authorizerModal: '#select_authorizer_modal',
    },
    initialize: function(options) {
        this.currentUser = options.currentUser;
        this.statusList = options.statusList;
        this.teamList = options.teamList;
        this.documents = new Documents(this.model.get('documents'));
        this.categoryList = options.categoryList;
        this.divisionList = new Divisions();
        this.getDivision(this.model.isNew() ? this.categoryList.first().id : this.model.get('division').category.id);
    },
    templateHelpers: function() {
        return {
            requestIdField: this.model.isNew() ? '' : '<div class="form-group">' +
                                                          '<label class="col-sm-2 control-label">RequestId</label>' +
                                                          '<div class="col-sm-10" id="request_id_region"></div>' +
                                                      '</div>',
            statusField: this.model.isNew() ? '' : '<div class="form-group">' +
                                                       '<label class="col-sm-2 control-label">Status</label>' +
                                                       '<div class="col-sm-10" id="status_region"></div>' +
                                                   '</div>',
            authorizer: function() {
                var html = '';
                if(this.model.has('authorizer')) {
                    html += '<p class="form-control-static authorizer-name">' + this.model.get('authorizer').name + '(' + this.model.get('authorizer').uid + ')' + '</p>';
                }
                if(this.canRequest()) {
                    html += '<button type="button" class="btn btn-default open-authorizer-modal" data-toggle="modal" data-target="#select_users_modal">Selected Authorizer</button>';
                    var input = '<input type="hidden" class="authorizer" name="authorizer" />';
                    if(this.model.has('authorizer')) {
                        var $input = Backbone.$(input);
                        $input.val(JSON.stringify(this.model.get('authorizer')));
                        input = $input.prop('outerHTML');
                    }
                    html += input;
                }
                return html;
            }.bind(this),
            save    : this.canRequest() ? '<button type="button" class="btn btn-default save-btn">Save</button>' : '',
            submit  : this.canRequest() ? '<button type="button" class="btn btn-default submit-btn">Submit</button>' : '',
            work    : this.canWork() ? '<button type="button" class="btn btn-default work-btn">' + this.model.getProgressBtnLabel() + '</button>' : '',
            approve : this.canApprove() ? '<button type="button" class="btn btn-default approve-btn">' + this.model.getProgressBtnLabel() + '</button>' : '',
            reject  : this.canReject() ? '<button type="button" class="btn btn-default reject-btn">Reject</button>' : '',
            destroy : this.canDestroy() ? '<button type="button" class="btn btn-default destroy-btn">Destroy</button>' : ''
        }
    },
    onRender: function() {
        this.renderRequestId();
        this.renderStatus();
        this.renderFiles()
        this.renderCategory();
        this.renderDivision();
        this.renderTitle();
        this.renderContent();
        this.renderUserModal();
    },
    renderRequestId: function() {
        if(!this.model.isNew()) {
            var requestIdView = new ParagraphView({ _className: 'form-control-static', _text: this.model.get('reqId') });
            this.getRegion('requestIdRegion').show(requestIdView);
        }
    },
    renderStatus: function() {
        if(!this.model.isNew()) {
            var statusView = new ParagraphView({ _className: 'form-control-static', _text: this.model.get('status').name });
            this.getRegion('statusRegion').show(statusView);
        }
    },
    renderCategory: function() {
        var categoryView =
            this.canRequest() ?
            new SelectboxView({
                collection: this.categoryList,
                label: 'name',
                value: 'id',
                changeEventName: 'change:category',
                selected: this.model.isNew() ? '' : this.model.get('division').category.id,
            }) :
            new ParagraphView({ _className: 'form-control-static', _text: this.model.get('division').category.name });
        this.getRegion('categoryRegion').show(categoryView);
    },
    renderDivision: function() {
        var divisionView =
            this.canRequest() ?
            new SelectboxView({
                collection: this.divisionList,
                label: 'name',
                value: 'id',
                _className: 'form-control division',
                selected: this.model.isNew() ? '' : this.model.get('division').id,
            }) :
            new ParagraphView({ _className: 'form-control-static', _text: this.model.get('division').name });
        this.getRegion('divisionRegion').show(divisionView);
    },
    renderTitle: function() {
        var titleView =
            this.canRequest() ?
            new InputView({
                _className: 'form-control title',
                _value: this.model.get('title'),
                attrs: { name: 'title' },
            }) :
            new ParagraphView({ _className: 'form-control-static', _text: this.model.get('title') });
        this.getRegion('titleRegion').show(titleView);
    },
    renderContent: function() {
        var contentView =
            this.canRequest() ?
            new TextareaView({
                _className: 'form-control content',
                _value: this.model.get('content'),
                attrs: { name: 'content' }
            }) :
            new ParagraphView({ _className: 'form-control-static', _text: this.replaceLine(this.model.get('content')) });
        this.getRegion('contentRegion').show(contentView);
    },
    renderUserModal: function() {
        if(this.canRequest()) {
            var usersModalView = new UsersModalView({
                collection: new Users(),
                currentUser: this.currentUser,
                teamList: this.teamList,
                type: 'radio',
                findOptions: { data: { jobLevel: { lte: 2 } } },
            });
            this.getRegion('authorizerModal').show(usersModalView);
        }
    },
    renderFiles: function() {
        var downloadFilesView = new DownloadFilesView({ collection: this.documents, canRequest: this.canRequest() });
        this.getRegion('downloadFilesRegion').show(downloadFilesView);
    },
    onChangeCategorySelectbox: function(view, id, model) {
        this.getDivision(id);
    },
    getDivision: function(id) {
        this.divisionList.setUrl(id);
        this.divisionList.fetch();
    },
    onSelectAuthorizer: function(view, user) {
        this.$('.authorizer-name').remove();
        this.$('input.authorizer').val(JSON.stringify(user));
        this.ui.openAuthorizerBtn.before('<p class="form-control-static authorizer-name">' + user.get('name') + '(' + user.get('uid') + ')' + '</p>');
    },
    onSelectFile: function(e) {
        var input = this.$(e.target);
        var file = input.prop('files');
        if(file.length !== 0) {
            var formData = new FormData();
            formData.append('file', file[0]);
            formData.append('request', '');
            var options = {
                processData: false,
                contentType: false,
                data: formData,
                wait: true
            }
            this.documents.create({}, options);
            input.val('');
        }
    },
    onClickSave: function() {
        this.setRequest(this.model.getStatusAfterSave(), false);
    },
    onClickSubmit: function() {
        this.setRequest(this.model.getStatusAfterProgressing(), true);
    },
    onClickWork: function() {
        this.setWork(this.model.getStatusAfterProgressing());
    },
    onClickApprove: function() {
        this.saveRequest(this.model.getStatusAfterProgressing());
    },
    onClickReject: function() {
        this.saveRequest(this.model.getStatusAfterRejection());
    },
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
            documents: this.documents
        });
        if(this.model.isValid(true)) this.saveRequest(nextStatusCode);
    },
    setWork: function(nextStatusCode) {
        //var content = this.ui.inputContent.val().trim();
        var content = '内容'
        this.model.set({
            work: {content: content}
        });
        this.saveRequest(nextStatusCode);
    },
    saveRequest: function(nextStatusCode) {
        var statusId = this.statusList.findWhere({code: nextStatusCode}).id;
        var options = {
            wait: true,
            success: function(request) {
                Backbone.history.navigate('/requests', {trigger: true});
            }.bind(this)
        };
        this.model.save({status: {id: statusId}}, options);
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
    },
    replaceLine: function(text) {
        return text.replace(/\r\n/g, '<br />').replace(/(\n|\r)/g, '<br />');
    },
});
