var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.ItemView.extend({
    className: 'panel panel-default',
    template: '#show_request_view',
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
            approval: function() {
                if(this.isApproval()) return '<button type="button" class="btn btn-default approval-btn">Approval</button>'
            }.bind(this),
            reject: function() {
                if(this.isApproval()) return '<button type="button" class="btn btn-default reject-btn">Reject</button>'
            }.bind(this)
        }
    },
    initialize: function(options) {
        this.currentUser = options.currentUser;
        this.statusList = options.statusList;
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
