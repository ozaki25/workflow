var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.Validation = require('backbone.validation');
Backbone.csrf = require('../../csrf');
Backbone.csrf();
var Document = require('../../models/Document');
var Documents = require('../../collections/Documents');
var Users = require('../../collections/Users');
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
        removeFile: '.remove-file',
        openAuthorizerBtn: 'button.open-authorizer-modal',
        authorizerName: '.authorizer-name',
        saveBtn: '.save-btn',
        submitBtn: '.submit-btn',
        approveBtn: '.approve-btn',
        receptBtn: '.recept-btn',
        reportBtn: '.report-btn',
        finishBtn: '.finish-btn',
        rejectBtn: '.reject-btn'
    },
    events: {
        'change @ui.inputFile': 'selectedFile',
        'click @ui.removeFile': 'onClickRemoveFile',
        'click @ui.saveBtn': 'onClickSave',
        'click @ui.submitBtn': 'onClickSubmit',
        'click @ui.approveBtn': 'onClickApprove',
        'click @ui.receptBtn': 'onClickRecept',
        'click @ui.reportBtn': 'onClickReport',
        'click @ui.finishBtn': 'onClickFinish',
        'click @ui.rejectBtn': 'onClickReject'
    },
    childEvents: {
        'select:authorizer': 'selectedAuthorizer'
    },
    regions: {
        downloadFiles: '#download_file_list',
        authorizerModal: '#select_authorizer_modal'
    },
    initialize: function(options) {
        this.currentUser = options.currentUser;
        this.statusList = options.statusList;
        this.teamList = options.teamList;
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
                var html = '';
                if(this.model.has('authorizer')) {
                    html += '<p class="form-control-static authorizer-name">' + this.model.get('authorizer').name + '(' + this.model.get('authorizer').uid + ')' + '</p>';
                }
                if(this.model.isCreating()) {
                    html += '<button type="button" class="btn btn-default open-authorizer-modal" data-toggle="modal" data-target="#authorizer_list_modal">Selected Authorizer</button>';
                    var input = '<input type="hidden" class="authorizer" name="authorizer" />';
                    if(this.model.has('authorizer')) {
                        var $input = Backbone.$(input);
                        $input.val(JSON.stringify(this.model.get('authorizer')));
                        input = $input.prop('outerHTML');;
                    }
                    html += input;
                }
                return html;
            }.bind(this),
            save    : this.canCreate() ? '<button type="button" class="btn btn-default save-btn">Save</button>' : '',
            submit  : this.canCreate() ? '<button type="button" class="btn btn-default submit-btn">Submit</button>' : '',
            approve : this.canApprove() ? '<button type="button" class="btn btn-default approve-btn">Approve</button>' : '',
            recept  : this.canRecept() ? '<button type="button" class="btn btn-default recept-btn">Recept</button>' : '',
            report  : this.canReport() ? '<button type="button" class="btn btn-default report-btn">Report</button>' : '',
            complete: this.canFinish() ? '<button type="button" class="btn btn-default finish-btn">Complete</button>' : '',
            reject  : this.canReject() ? '<button type="button" class="btn btn-default reject-btn">Reject</button>' : '',
        }
    },
    onRender: function() {
        if(!this.model.isNew()) {
            var downloadFilesView = new DownloadFilesView({collection: this.documents});
            this.getRegion('downloadFiles').show(downloadFilesView);
        }
        if(this.canCreate()) this.getRegion('authorizerModal').show(new UsersModalView({collection: new Users(), currentUser: this.currentUser, teamList: this.teamList}));
    },
    selectedAuthorizer: function(view) {
        var authorizer = view.model;
        this.ui.authorizerName.remove();
        this.ui.inputAuthorizer.val(JSON.stringify(authorizer));
        this.ui.openAuthorizerBtn.before('<p class="form-control-static authorizer-name">' + authorizer.get('name') + '(' + authorizer.get('uid') + ')' + '</p>');
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
        var fileNo = this.$(e.target).closest('p').attr('class');
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
    onClickRecept: function() {
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
    saveRequest: function(nextStatus, validate) {
        validate ? this.bindBackboneValidation() : this.unbindBackboneValidation();
        var title = this.ui.inputTitle.val().trim();
        var content = this.ui.inputContent.val().trim();
        var authorizer = null;
        if(this.canCreate()) {
            var inputAuthorizer = this.ui.inputAuthorizer.val();
            if(inputAuthorizer) {
                authorizer = JSON.parse(inputAuthorizer);
                delete authorizer.id;
            }
        } else {
            authorizer = this.model.get('authorizer');
        }
        var applicant = this.model.isNew() ? this.currentUser : this.model.get('applicant');
        if(this.model.isNew()) applicant.unset('id');
        var statusId = this.statusList.findWhere({code: nextStatus}).id;
        this.model.set({
            title: title,
            content: content,
            authorizer: authorizer,
            applicant: applicant,
            status: {id: statusId},
            documents: []

        });
        var options = {
            wait: true,
            success: function(request) {
                this.saveFile(request);
                this.deleteFile(request);
                Backbone.history.navigate('/requests', {trigger: true});
            }.bind(this)
        };
        this.model.save({}, options);
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
    canCreate: function() {
        return this.model.isNew() || (this.model.isCreating() && this.currentUser.isApplicant(this.model))
    },
    canApprove: function() {
        return !this.model.isNew() && this.model.isWaitingApprove() && this.currentUser.isAuthorizer(this.model);
    },
    canRecept: function() {
        return !this.model.isNew() && this.model.isWaitingRecept() && this.currentUser.isReceptionist(this.model);
    },
    canReport: function() {
        return !this.model.isNew() && this.model.isWaitingWorkComplete() && this.currentUser.isWorker(this.model);
    },
    canFinish: function() {
        return !this.model.isNew() && this.model.isWaitingFinish() && this.currentUser.isReceptionist(this.model);
    },
    canRestore: function() {
        return !this.model.isNew() && this.model.isCompleted() && this.currentUser.isReceptionist(this.model);
    },
    canReject: function() {
        return this.canApprove() || this.canRecept() || this.canReport() || this.canFinish() || this.canRestore();
    }
});
