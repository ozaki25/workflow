var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var Documents = require('../../collections/Documents');
var DownloadFilesView = require('./DownloadFilesView');

module.exports = Backbone.Marionette.LayoutView.extend({
    className: 'panel panel-default',
    template: '#show_request_view',
    regions: {
        downloadFiles: '#download_file_list'
    },
    ui: {
        approvalBtn: '.approval-btn',
        rejectBtn: '.reject-btn'
    },
    events: {
        'click @ui.approvalBtn': 'onClickApproval',
        'click @ui.rejectBtn': 'onClickReject'
    },
    templateHelpers: function() {
        return {
            approval: this.isApproval() ? '<button type="button" class="btn btn-default approval-btn">Approval</button>' : '',
            reject: this.isApproval() ? '<button type="button" class="btn btn-default reject-btn">Reject</button>' : ''
        }
    },
    initialize: function(options) {
        this.currentUser = options.currentUser;
        this.statusList = options.statusList;
    },
    onRender: function() {
        var documents = new Documents(this.model.get('documents'));
        documents.setUrl(this.model.id);
        var downloadFilesView = new DownloadFilesView({collection: documents});
        this.getRegion('downloadFiles').show(downloadFilesView);
    },
    onClickApproval: function() {
        this.updateStatus(3);
    },
    onClickReject: function() {
        this.updateStatus(1);
    },
    updateStatus: function(nextStatus) {
        var status = this.statusList.findWhere({code: nextStatus});
        this.model.save({status: status}, {wait: true});
        Backbone.history.navigate('/requests', {trigger: true});
    },
    isApproval: function() {
        return this.model.isWaitingApproval() && this.currentUser.isApproveUser();
    }
});
