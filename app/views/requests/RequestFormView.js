var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var Document = require('../../models/Document');
var Category = require('../../models/category');
var Division = require('../../models/Division');
var Documents = require('../../collections/Documents');
var Divisions = require('../../collections/Divisions');
var Users = require('../../collections/Users');
var DownloadFilesView = require('./DownloadFilesView');
var SelectCategoryView = require('./SelectCategoryView');
var UsersModalView = require('../UsersModalView');

module.exports = Backbone.Marionette.LayoutView.extend({
    template: '#request_form_view',
        ui: {
        inputFile: 'input.file-tmp',
        removeFile: '.remove-file',
        openAuthorizerBtn: 'button.open-authorizer-modal'
    },
    events: {
        'change @ui.inputFile': 'selectedFile',
        'click @ui.removeFile': 'onClickRemoveFile'
    },
    childEvents: {
        'select:user': 'selectedAuthorizer'
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
        this.canRequest = options.canRequest;
        this.documents = new Documents(this.model.get('documents'));
        if(!this.model.isNew()) this.documents.setUrl(this.model.id);
    },
    templateHelpers: function() {
        return {
            id     : this.model.isNew() ? '' : this.staticFormItemHtml('ID', this.model.id),
            status : this.model.isNew() ? '' : this.staticFormItemHtml('Status', this.model.get('status').name),
            inputTitle: this.canRequest ?
                '<input type="text" class="title form-control" name="title" value="' + this.model.get('title') + '" />' :
                this.staticItemNameHtml(this.model.get('title')),
            inputContent: this.canRequest ?
                '<textarea type="text" class="content form-control" name="content">' + this.model.get('content') + '</textarea>' :
                this.staticItemNameHtml(this.replaceLine(this.model.get('content'))),
            inputFile: this.canRequest ? '<input type="file" class="form-control file-tmp" />' : '',
            authorizer: function() {
                var html = '';
                if(this.model.has('authorizer')) {
                    html += this.staticItemNameHtml(this.model.get('authorizer').name + '(' + this.model.get('authorizer').uid + ')', 'authorizer-name');
                }
                if(this.canRequest) {
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
        }
    },
    onRender: function() {
        if(!this.model.isNew()) {
            var downloadFilesView = new DownloadFilesView({collection: this.documents, canRequest: this.canRequest});
            this.getRegion('downloadFiles').show(downloadFilesView);
        }
        if(this.canRequest) {
            var usersModalView = new UsersModalView({collection: new Users(), currentUser: this.currentUser, teamList: this.teamList, type: 'radio', findOptions: {data: {jobLevel: {lte: 2}}}});
            this.getRegion('authorizerModal').show(usersModalView);
        }
        var selectedDivision = this.model.isNew() ? new Division() : new Division(this.model.get('division'));
        var selectCategoryView = new SelectCategoryView({collection: new Divisions(), model: selectedDivision, categoryList: this.categoryList, canRequest: this.canRequest});
        this.getRegion('selectCategoryField').show(selectCategoryView);
    },
    selectedAuthorizer: function(view, user) {
        this.$('.authorizer-name').remove();
        this.$('input.authorizer').val(JSON.stringify(user));
        this.ui.openAuthorizerBtn.before(this.staticItemNameHtml(user.get('name') + '(' + user.get('uid') + ')', 'authorizer-name'));
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
    staticItemNameHtml: function(value, className = '', attr = '') {
        return '<p class="form-control-static ' + className + '" ' + attr + '>' + value + '</p>';
    },
    staticFormItemHtml: function(name, value) {
        return '<div class="form-group">' +
                 '<label class="col-sm-2 control-label">' + name + '</label>' +
                 '<div class="col-sm-10">' +
                   '<p class="form-control-static">' + value + '</p>' +
                 '</div>' +
               '</div>'
    },
    replaceLine: function(text) {
        return text.replace(/\r\n/g, '<br />').replace(/(\n|\r)/g, '<br />');
    }
});
