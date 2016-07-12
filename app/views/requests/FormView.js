var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.Validation = require('backbone.validation');
Backbone.csrf = require('../../csrf');
Backbone.csrf();
var Document = require('../../models/Document');
var Category = require('../../models/category');
var Documents = require('../../collections/Documents');
var Divisions = require('../../collections/Divisions');
var Users = require('../../collections/Users');
var DownloadFilesView = require('./DownloadFilesView');
var SelectCategoryView = require('./SelectCategoryView');
var UsersModalView = require('./UsersModalView');

module.exports = Backbone.Marionette.LayoutView.extend({
    className: 'panel panel-default',
    template: '#request_form_view',
    ui: {
        inputCategory: 'select.category',
        inputTitle: 'input.title',
        inputContent: 'textarea.content',
        inputFile: 'input.file-tmp',
        removeFile: '.remove-file',
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
        'change @ui.inputFile': 'selectedFile',
        'click @ui.removeFile': 'onClickRemoveFile',
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
        'select:authorizer': 'selectedAuthorizer'
    },
    regions: {
        selectCategoryField: '#select_category_field',
        downloadFiles: '#download_file_list',
        authorizerModal: '#select_authorizer_modal'
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
            id     : this.model.isNew() ? '' : this.staticFormItemHtml('ID', this.model.id),
            status : this.model.isNew() ? '' : this.staticFormItemHtml('Status', this.model.get('status').name),
            /*
            inputCategory: this.canRequest() ?
                '<select class="category form-control" name="category">' + this.categoryListHtml() + '</select>' :
                this.staticItemNameHtml(this.model.get('category').name),
            inputDivision: this.canRequest() ?
                '<select class="division form-control" name="division">' + this.divisionListHtml() + '</select>' :
                this.staticItemNameHtml(this.model.get('division').name),
            */
            inputTitle: this.canRequest() ?
                '<input type="text" class="title form-control" name="title" value="' + this.model.get('title') + '" />' :
                this.staticItemNameHtml(this.model.get('title')),
            inputContent: this.canRequest() ?
                '<textarea type="text" class="content form-control" name="content">' + this.model.get('content') + '</textarea>' :
                this.staticItemNameHtml(this.replaceLine(this.model.get('content'))),
            inputFile: this.canRequest() ? '<input type="file" class="form-control file-tmp" />' : '',
            authorizer: function() {
                var html = '';
                if(this.model.has('authorizer')) {
                    html += this.staticItemNameHtml(this.model.get('authorizer').name + '(' + this.model.get('authorizer').uid + ')', 'authorizer-name');
                }
                if(this.canRequest()) {
                    html += '<button type="button" class="btn btn-default open-authorizer-modal" data-toggle="modal" data-target="#authorizer_list_modal">Selected Authorizer</button>';
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
            approve : this.canApprove() ? '<button type="button" class="btn btn-default approve-btn">Approve</button>' : '',
            accept  : this.canAccept() ? '<button type="button" class="btn btn-default accept-btn">Accept</button>' : '',
            report  : this.canReport() ? '<button type="button" class="btn btn-default report-btn">Report</button>' : '',
            complete: this.canFinish() ? '<button type="button" class="btn btn-default finish-btn">Complete</button>' : '',
            reject  : this.canReject() ? '<button type="button" class="btn btn-default reject-btn">Reject</button>' : '',
            destroy : this.canDestroy() ? '<button type="button" class="btn btn-default destroy-btn">Destroy</button>' : ''
        }
    },
    onRender: function() {
        if(!this.model.isNew()) {
            var downloadFilesView = new DownloadFilesView({collection: this.documents, canRequest: this.canRequest()});
            this.getRegion('downloadFiles').show(downloadFilesView);
        }
        if(this.canRequest()) {
            var usersModalView = new UsersModalView({collection: new Users(), currentUser: this.currentUser, teamList: this.teamList})
            this.getRegion('authorizerModal').show(usersModalView);
            var selectCategoryView = new SelectCategoryView({collection: new Divisions(), categoryList:  this.categoryList});
            this.getRegion('selectCategoryField').show(selectCategoryView);
        }
    },
    selectedAuthorizer: function(view) {
        var authorizer = view.model;
        this.$('.authorizer-name').remove();
        this.$('input.authorizer').val(JSON.stringify(authorizer));
        this.ui.openAuthorizerBtn.before(this.staticItemNameHtml(authorizer.get('name') + '(' + authorizer.get('uid') + ')', 'authorizer-name'));
        this.getRegion('authorizerModal').currentView.$el.modal('hide');
    },
    selectedFile: function(e) {
        var input = this.$(e.target);
        var file = input.prop('files');
        if(file.length !== 0) {
            var latestFileNo = this.$('input.file:last').attr('id');
            var fileNo = latestFileNo ? parseInt(latestFileNo) + 1 : 1
            var newInput = input.clone();
            input.after(newInput);
            input.after(this.staticItemNameHtml('<span>' + file[0].name + '</span><a href="#" class="btn btn-link btn-xs remove-file">&times;</a>', fileNo, 'data-file-no="' + fileNo + '"'));
            input.attr('id', fileNo).addClass('file hide ' + fileNo).removeClass('file-tmp');
        }
    },
    onClickRemoveFile: function(e) {
        e.preventDefault();
        var fileNo = this.$(e.target).closest('p').attr('data-file-no');
        this.$('.' + fileNo).remove();
    },
    onClickSave: function() {
        this.saveRequest(1, false);
    },
    onClickSubmit: function() {
        this.saveRequest(2, true);
    },
    onClickApprove: function() {
        this.saveRequest(3, true);
    },
    onClickAccept: function() {
        this.saveRequest(4, true);
    },
    onClickReport: function() {
        this.saveRequest(5, true);
    },
    onClickFinish: function() {
        this.saveRequest(6, true);
    },
    onClickReject: function() {
        // 否認された後のステータスを現在のステータスを元に判断する
        // var next = request.getStatusAfterReject();
        var next = 1
        this.saveRequest(next, true);
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
    saveRequest: function(nextStatus, validate) {
        validate ? this.bindBackboneValidation() : this.unbindBackboneValidation();
        var category = '';
        var title = '';
        var content = '';
        var authorizer = null;
        if(this.canRequest()) {
            var inputCategory = this.ui.inputCategory.children(':checked').val();
            if(inputCategory) category = {id: inputCategory};
            title = this.ui.inputTitle.val().trim();
            content = this.ui.inputContent.val().trim();
            var inputAuthorizer = this.$('input.authorizer').val();
            if(inputAuthorizer) authorizer = JSON.parse(inputAuthorizer);
        } else {
            category = this.model.get('category');
            title = this.model.get('title');
            content = this.model.get('content');
            authorizer = this.model.get('authorizer');
        }
        var applicant = this.model.isNew() ? this.currentUser : this.model.get('applicant');
        this.model.set({
            category: category,
            title: title,
            content: content,
            authorizer: authorizer,
            applicant: applicant,
            documents: []
        });
        if(this.model.isValid(true)) {
            var statusId = this.statusList.findWhere({code: nextStatus}).id;
            var options = {
                wait: true,
                success: function(request) {
                    this.saveFile(request);
                    this.deleteFile(request);
                    Backbone.history.navigate('/requests', {trigger: true});
                }.bind(this)
            };
            this.model.save({status: {id: statusId}}, options);
        }
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
    canRequest: function() {
        return this.model.isNew() || this.canEdit();
    },
    canApprove: function() {
        return this.model.isWaitingApprove() &&
            (this.currentUser.isAuthorizer(this.model) || this.currentUser.isAdmin());
    },
    canAccept: function() {
        return this.model.isWaitingAccept() &&
            (this.currentUser.isReceptionist(this.model) || this.currentUser.isAdmin());
    },
    canReport: function() {
        return this.model.isWaitingWorkComplete() &&
            (this.currentUser.isWorker(this.model) || this.currentUser.isAdmin());
    },
    canFinish: function() {
        return this.model.isWaitingFinish() &&
            (this.currentUser.isReceptionist(this.model) || this.currentUser.isAdmin());
    },
    canRestore: function() {
        return this.model.isCompleted() &&
            (this.currentUser.isReceptionist(this.model) || this.currentUser.isAdmin());
    },
    canReject: function() {
        return this.canApprove() || this.canAccept() || this.canReport() || this.canFinish() || this.canRestore();
    },
    canDestroy: function() {
        return this.canEdit() || (!this.model.isNew() && this.currentUser.isAdmin());
    },
    staticFormItemHtml: function(name, value) {
        return '<div class="form-group">' +
                 '<label class="col-sm-2 control-label">' + name + '</label>' +
                 '<div class="col-sm-10">' +
                   '<p class="form-control-static">' + value + '</p>' +
                 '</div>' +
               '</div>'
    },
    staticItemNameHtml: function(value, className, attr) {
        if(!className) className = '';
        if(!attr) attr = '';
        return '<p class="form-control-static ' + className + '" ' + attr + '>' + value + '</p>';
    },
    categoryListHtml: function() {
        return _(this.categoryList.models).map(function(category) {
            return '<option value="' + category.id + '">' + category.get('name') + '</option>';
        }).join('');
    },
    divisionListHtml: function() {
        return _(this.divisionList.models).map(function(division) {
            return '<option value="' + division.id + '">' + division.get('name') + '</option>';
        }).join('');
    },
    replaceLine: function(text) {
        return text.replace(/\r\n/g, '<br />').replace(/(\n|\r)/g, '<br />');
    }
});
