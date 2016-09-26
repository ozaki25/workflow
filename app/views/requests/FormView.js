var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.Validation = require('backbone.validation');
Backbone.csrf = require('../../csrf');
Backbone.csrf();
var Documents = require('../../collections/Documents');
var Divisions = require('../../collections/Divisions');
var Users = require('../../collections/Users');
var Histories = require('../../collections/Histories');
var DownloadFilesView = require('./DownloadFilesView');
var UsersModalView = require('../UsersModalView');
var WorkDateTermView = require('./WorkDateTermView');
var ParagraphView = require('../ParagraphView');
var GridView = require('../../lib/GridView');
var SelectboxView = require('../../lib/SelectboxView');
var InputView = require('../../lib/InputView');
var TextareaView = require('../../lib/TextareaView');
var AlertView = require('../../lib/AlertView');

module.exports = Backbone.Marionette.LayoutView.extend({
    className: 'panel panel-default',
    template: '#request_form_view',
    ui: {
        inputFile: 'input.file',
        openAuthorizerBtn: 'button.open-authorizer-modal',
        saveBtn: '.save-btn',
        submitBtn: '.submit-btn',
        approveBtn: '.approve-btn',
        acceptBtn: '.accept-btn',
        reportBtn: '.report-btn',
        finishBtn: '.finish-btn',
        rejectBtn: '.reject-btn',
        destroyBtn: '.destroy-btn'
    },
    events: {
        'change @ui.inputFile': 'onSelectFile',
        'click @ui.saveBtn': 'onClickSave',
        'click @ui.submitBtn': 'onClickSubmit',
        'click @ui.approveBtn': 'onClickApprove',
        'click @ui.acceptBtn': 'onClickAccept',
        'click @ui.reportBtn': 'onClickReport',
        'click @ui.finishBtn': 'onClickFinish',
        'click @ui.rejectBtn': 'onClickReject',
        'click @ui.destroyBtn': 'onClickDestroy'
    },
    childEvents: {
        'select:user': 'onSelectAuthorizer',
        'change:category': 'onChangeCategorySelectbox',
    },
    regions: {
        alertRegion: '#alert_region',
        requestIdRegion: '#request_id_region',
        statusRegion: '#status_region',
        categoryRegion: '#category_region',
        divisionRegion: '#division_region',
        titleRegion: '#title_region',
        contentRegion: '#content_region',
        workDateRegion: '#work_date_region',
        workContentRegion: '#work_content_region',
        downloadFilesRegion: '#download_files_region',
        authorizerModal: '#select_authorizer_modal',
        historiesRegion: '#histories_region',
    },
    initialize: function(options) {
        if(!this.model.isNew()) this.model.trimProp();
        this.currentUser = options.currentUser;
        this.statusList = options.statusList;
        this.teamList = options.teamList;
        this.documents = new Documents(this.model.get('documents'));
        this.categoryList = options.categoryList;
        this.divisionList = new Divisions();
        this.getDivision(this.model.isNew() ? this.categoryList.first().id : this.model.get('category').id);
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
            workContentField: this.model.isRequested() ? '<div class="form-group">' +
                                                             '<label class="col-sm-2 control-label">WorkContent</label>' +
                                                             '<div class="col-sm-10" id="work_content_region"></div>' +
                                                         '</div>' : '',
            save     : this.canRequest() ? '<button type="button" class="btn btn-default save-btn">Save</button>' : '',
            submit   : this.canRequest() ? '<button type="button" class="btn btn-default submit-btn">Submit</button>' : '',
            approve  : this.canApprove() ? '<button type="button" class="btn btn-default approve-btn">Approve</button>' : '',
            accept   : this.canAccept() ? '<button type="button" class="btn btn-default accept-btn">Accept</button>' : '',
            report   : this.canReport() ? '<button type="button" class="btn btn-default report-btn">Report</button>' : '',
            finish   : this.canFinish() ? '<button type="button" class="btn btn-default finish-btn">Finish</button>' : '',
            reject   : this.canReject() ? '<button type="button" class="btn btn-default reject-btn">Reject</button>' : '',
            destroy  : this.canDestroy() ? '<button type="button" class="btn btn-default destroy-btn">Destroy</button>' : ''
        }
    },
    onBeforeShow: function() {
        this.renderRequestId();
        this.renderStatus();
        this.renderCategory();
        this.renderDivision();
        this.renderTitle();
        this.renderContent();
        this.renderWorkDate();
        this.renderWorkContent();
        this.renderUserModal();
        this.renderFiles()
        this.renderHistories();
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
                selected: this.model.isNew() ? '' : this.model.get('category').id,
            }) :
            new ParagraphView({ _className: 'form-control-static', _text: this.model.get('category').name });
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
    renderWorkDate: function() {
        if(this.canRequest()) this.getRegion('workDateRegion').show(new WorkDateTermView());
    },
    renderWorkContent: function() {
        if(this.model.isRequested()) {
            var workContentView =
                this.canWork() ?
                new TextareaView({
                    _className: 'form-control work-content',
                    _value: this.model.get('workContent'),
                    attrs: { name: 'workContent' }
                }) :
                new ParagraphView({ _className: 'form-control-static', _text: this.replaceLine(this.model.get('workContent')) });
            this.getRegion('workContentRegion').show(workContentView);
        }
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
    renderHistories: function() {
        if(this.model.has('histories')) {
            var columns = [
                { label: '操作', name: 'action' },
                { label: '名前', name: 'name' },
                { label: '部署', name: 'team' },
                { label: '日付', name: 'createdDate' },
            ];
            var gridView = new GridView({
                collection: new Histories(this.model.get('histories')),
                columns: columns,
                _className: 'table table-bordered',
            });
            this.getRegion('historiesRegion').show(gridView);
        }
    },
    renderError: function() {
        var alertView = new AlertView({ alertType: 'danger', message: '操作に失敗しました。もう一度やり直して下さい。' })
        this.getRegion('alertRegion').show(alertView);
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
        this.setRequest(this.model.getStatusAfterSave(), false, '保存');
    },
    onClickSubmit: function() {
        this.setRequest(this.model.getStatusAfterProgress(), true, '申請');
    },
    onClickApprove: function() {
        this.saveRequest(this.model.getStatusAfterProgress(), '承認');
    },
    onClickAccept: function() {
        this.setWork(this.model.getStatusAfterProgress(), false, '受付');
    },
    onClickReport: function() {
        this.setWork(this.model.getStatusAfterProgress(), true, '作業完了報告');
    },
    onClickFinish: function() {
        this.saveRequest(this.model.getStatusAfterProgress(), '作業完了承認');
    },
    onClickReject: function() {
        this.saveRequest(this.model.getStatusAfterRejection(), '否認');
    },
    onClickDestroy: function() {
        var options = {
            wait: true,
            success: function() {
                var backUrlQuery = localStorage.getItem('backIndexQuery') || '';
                localStorage.removeItem('backIndexQuery');
                Backbone.history.navigate('/requests' + backUrlQuery, {trigger: true});
            },
            error: function(model, response) {
                this.renderError();
            }.bind(this),
        };
        this.model.destroy(options);
    },
    setRequest: function(nextStatusCode, validate, action) {
        this.model.setRequestValidation();
        validate ? this.bindBackboneValidation() : this.unbindBackboneValidation();
        var title = this.$('input.title').val().trim();
        var content = this.$('textarea.content').val().trim();
        var inputDivision = this.$('select.division').val();
        var division = !!inputDivision ? {id: inputDivision} : null;
        var inputAuthorizer = this.$('input.authorizer').val();
        var authorizer = !!inputAuthorizer ? JSON.parse(inputAuthorizer) : null;
        var applicant = this.model.isNew() ? this.currentUser : this.model.get('applicant');
        var fromDate = this.$('input.from-date').val().trim();
        var toDate = this.$('input.to-date').val().trim();
        this.model.set({
            title: title,
            content: content,
            division: division,
            authorizer: authorizer,
            applicant: applicant,
            workDateFrom: fromDate,
            workDateTo: toDate,
            documents: this.documents,
        });
        if(this.model.isValid(true)) this.saveRequest(nextStatusCode, action);
    },
    setWork: function(nextStatusCode, validate, action) {
        this.model.setWorkValidation();
        validate ? this.bindBackboneValidation() : this.unbindBackboneValidation();
        var workContent = this.$('textarea.work-content').val().trim();
        this.model.set({ workContent: workContent });
        if(this.model.isValid(true)) this.saveRequest(nextStatusCode, action);
    },
    saveRequest: function(nextStatusCode, action) {
        var statusId = this.statusList.findWhere({code: nextStatusCode}).id;
        var options = {
            wait: true,
            success: function(request) {
                var backUrlQuery = localStorage.getItem('backIndexQuery') || '';
                localStorage.removeItem('backIndexQuery');
                Backbone.history.navigate('/requests' + backUrlQuery, {trigger: true});
            }.bind(this),
            error: function(model, response) {
                this.renderError();
            }.bind(this),
        };
        this.model.save({ status: { id: statusId }, action: action }, options);
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
    canApprove: function() {
        return this.model.isWaitingApprove() &&
            (this.currentUser.isAuthorizer(this.model) || this.currentUser.isAdmin());
    },
    canAccept: function() {
        return this.model.isWaitingAccept() &&
            (this.currentUser.isReceptionist(this.model.get('category').receptnists) || this.currentUser.isAdmin());
    },
    canReport: function() {
        return this.model.isWaitingWorkComplete() &&
            (this.currentUser.isWorker(this.model) || this.currentUser.isAdmin());
    },
    canFinish: function() {
        return this.model.isWaitingFinish() &&
            (this.currentUser.isReceptionist(this.model.get('category').receptnists) || this.currentUser.isAdmin());
    },
    canRestore: function() {
        return this.model.isCompleted() &&
            (this.currentUser.isReceptionist(this.model.get('category').receptnists) || this.currentUser.isAdmin());
    },
    canRequest: function() {
        return this.model.isNew() || this.canEdit();
    },
    canWork: function() {
        return this.canAccept() || this.canReport();
    },
    canReject: function() {
        return this.canApprove() || this.canWork() || this.canFinish() || this.canRestore();
    },
    canDestroy: function() {
        return this.canEdit() || (!this.model.isNew() && this.currentUser.isAdmin());
    },
    replaceLine: function(text) {
        return text.replace(/\r\n/g, '<br />').replace(/(\n|\r)/g, '<br />');
    },
});
