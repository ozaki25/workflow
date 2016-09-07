var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.Validation = require('backbone.validation');
Backbone.csrf = require('../../csrf');
Backbone.csrf();
var Document = require('../../models/Document');
var Category = require('../../models/category');
var Division = require('../../models/Division');
var Documents = require('../../collections/Documents');
var Divisions = require('../../collections/Divisions');
var Users = require('../../collections/Users');
var DownloadFilesView = require('./DownloadFilesView');
var SelectCategoryView = require('./SelectCategoryView');
var UsersModalView = require('../UsersModalView');
var FormItemView = require('../components/FormHorizontalItemView');
var InputView = require('../components/InputView');
var TextareaView = require('../components/TextareaView');
var ParagraphView = require('../components/ParagraphView');

var SelectboxView = require('../../lib/SelectboxView');

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
        'select:user': 'onSlectAuthorizer',
        'change:category': 'onChangeCategorySelectbox',
        'change:division': 'onChangeDivisionSelectbox',
    },
    regions: {
        downloadFiles: '#download_file_list',
        authorizerModal: '#select_authorizer_modal',

        requestIdRegion: '#request_id_region',
        statusRegion: '#status_region',
        titleRegion: '#title_region',
        contentRegion: '#content_region',

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
            category: this.canRequest() ? '' : '<p class="form-control-static">' + this.model.get('division').category.name + '</p>',
            division: this.canRequest() ? '' : '<p class="form-control-static">' + this.model.get('division').name + '</p>',
            inputFile: this.canRequest() ? '<input type="file" class="form-control file" />' : '',
            authorizer: function() {
                var html = '';
                if(this.model.has('authorizer')) {
                    html += this.staticItemNameHtml(this.model.get('authorizer').name + '(' + this.model.get('authorizer').uid + ')', 'authorizer-name');
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
        var downloadFilesView = new DownloadFilesView({collection: this.documents, canRequest: this.canRequest()});
        this.getRegion('downloadFiles').show(downloadFilesView);
        if(this.canRequest()) {



            var categorySelectboxView = new SelectboxView({
                collection: this.categoryList,
                label: 'name',
                value: 'id',
                changeEventName: 'change:category',
                selected: this.model.isNew() ? '' : this.model.get('division').category.id,
            });
            var divisionSelectboxView = new SelectboxView({
                collection: this.divisionList,
                label: 'name',
                value: 'id',
                _className: 'form-control division',
                selected: this.model.isNew() ? '' : this.model.get('division').id,
            });
            this.renderView('#select_category_field', categorySelectboxView);
            this.renderView('#select_division_field', divisionSelectboxView);



            var usersModalView = new UsersModalView({collection: new Users(), currentUser: this.currentUser, teamList: this.teamList, type: 'radio', findOptions: {data: {jobLevel: {lte: 2}}}});
            this.getRegion('authorizerModal').show(usersModalView);

            var inputTitleModel = new Backbone.Model({className: 'title form-control', name: 'title', type: 'text', value: this.model.get('title')});
            var titleDetailView  = new InputView({model: inputTitleModel});

            var inputContentModel = new Backbone.Model({className: 'content form-control', name: 'content', value: this.replaceLine(this.model.get('content'))})
            var contentDetailView  = new TextareaView({model: inputContentModel});
        } else {
            var paragraphRequestIdModel = new Backbone.Model({className: 'form-control-static', value: this.model.id});
            var requestIdDetailView  = new ParagraphView({model: paragraphRequestIdModel});
            var formRequestIdView       = new FormItemView({model: new Backbone.Model({label: 'ID'}), detailView: requestIdDetailView});
            this.getRegion('requestIdRegion').show(formRequestIdView);

            var paragraphStatusModel = new Backbone.Model({className: 'form-control-static', value: this.model.get('status').name});
            var statusDetailView  = new ParagraphView({model: paragraphStatusModel});
            var formStatusView       = new FormItemView({model: new Backbone.Model({label: 'Status'}), detailView: statusDetailView});
            this.getRegion('statusRegion').show(formStatusView);

            var paragraphTitleModel = new Backbone.Model({className: 'form-control-static', value: this.model.get('title')});
            var titleDetailView  = new ParagraphView({model: paragraphTitleModel});

            var paragraphContentModel = new Backbone.Model({className: 'form-control-static', value: this.replaceLine(this.model.get('content'))})
            var contentDetailView  = new ParagraphView({model: paragraphContentModel});
        }
        var formTitleView = new FormItemView({model: new Backbone.Model({label: 'Title'}), detailView: titleDetailView});
        this.getRegion('titleRegion').show(formTitleView);
        var formContentView = new FormItemView({model: new Backbone.Model({label: 'Content'}), detailView: contentDetailView});
        this.getRegion('contentRegion').show(formContentView);
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
        this.ui.openAuthorizerBtn.before(this.staticItemNameHtml(user.get('name') + '(' + user.get('uid') + ')', 'authorizer-name'));
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
    staticItemNameHtml: function(value) {
        this.staticItemNameHtml(value, '', '');
    },
    staticItemNameHtml: function(value, className) {
        this.staticItemNameHtml(value, className, '');
    },
    staticItemNameHtml: function(value, className, attr) {
        return '<p class="form-control-static ' + className + '" ' + attr + '>' + value + '</p>';
    },
    replaceLine: function(text) {
        return text.replace(/\r\n/g, '<br />').replace(/(\n|\r)/g, '<br />');
    },
    renderView: function(region, view) {
        this.addRegion(region, region);
        this.getRegion(region).show(view);
    }
});
