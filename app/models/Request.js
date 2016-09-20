var _ = require('underscore');
var Backbone = require('backbone');
var StatusCodes = require('../const/StatusCodes');

module.exports = Backbone.Model.extend({
    defaults: {
        title: '',
        content: ''
    },
    validation: {
        title: {
            required: true,
            msg: '必須項目です。'
        },
        content: {
            required: true,
            msg: '必須項目です。'
        },
        authorizer: {
            required: true,
            msg: '必須項目です。'
        }
    },
    isCreating: function() {
        return !this.isNew() && this.get('status').code == StatusCodes.Creating;
    },
    isWaitingApprove: function() {
        return !this.isNew() && this.get('status').code == StatusCodes.WaitingApprove;
    },
    isWaitingAccept: function() {
        return !this.isNew() && this.get('status').code == StatusCodes.WaitingAccept;
    },
    isWaitingWorkComplete: function() {
        return !this.isNew() && this.get('status').code == StatusCodes.WaitingWorkComplete;
    },
    isWaitingFinish: function() {
        return !this.isNew() && this.get('status').code == StatusCodes.WaitingFinish;
    },
    isCompleted: function() {
        return !this.isNew() && this.get('status').code == StatusCodes.Completed;
    },
    isWork: function() {
        var workStatus = [
            StatusCodes.WaitingAccept,
            StatusCodes.WaitingWorkComplete,
            StatusCodes.WaitingFinish,
            StatusCodes.Completed
        ];
        return !this.isNew() && _(workStatus).contains(this.get('status').code);
    },
    getProgressBtnLabel: function() {
        if(this.isNew())                 return 'Submit';
        if(this.isCreating())            return 'Submit';
        if(this.isWaitingApprove())      return 'Approve';
        if(this.isWaitingAccept())       return 'Accept';
        if(this.isWaitingWorkComplete()) return 'Report';
        if(this.isWaitingFinish())       return 'Complete';
        console.warn('this request status can not progress.');
        return '';
    },
    getStatusAfterSave: function() {
        return StatusCodes.Creating;
    },
    getStatusAfterProgressing: function() {
        if(this.isNew())                 return StatusCodes.WaitingApprove;
        if(this.isCreating())            return StatusCodes.WaitingApprove;
        if(this.isWaitingApprove())      return StatusCodes.WaitingAccept;
        if(this.isWaitingAccept())       return StatusCodes.WaitingWorkComplete;
        if(this.isWaitingWorkComplete()) return StatusCodes.WaitingFinish;
        if(this.isWaitingFinish())       return StatusCodes.Completed;
        console.warn('this request status can not progress.');
        return null;
    },
    getStatusAfterRejection: function() {
        if(this.isWaitingApprove())      return StatusCodes.Creating;
        if(this.isWaitingAccept())       return StatusCodes.Creating;
        if(this.isWaitingWorkComplete()) return StatusCodes.WaitingAccept;
        if(this.isWaitingFinish())       return StatusCodes.WaitingWorkComplete;
        if(this.isCompleted())           return StatusCodes.WaitingFinish;
        console.warn('this request status can not reject.');
        return null;
    },
    trimProp: function() {
        var tmp = this.get('category');
        delete this.attributes.category;
        this.set({ category: _(tmp).pick('id', 'name', 'code', 'receptnists') });

        var tmp = this.get('division');
        delete this.attributes.division;
        this.set({ division: _(tmp).pick('id', 'name', 'code') });
    },
});
