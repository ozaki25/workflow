var _ = require('underscore');
var Backbone = require('backbone');

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
        return !this.isNew() && this.get('status').code == 1;
    },
    isWaitingApprove: function() {
        return !this.isNew() && this.get('status').code == 2;
    },
    isWaitingAccept: function() {
        return !this.isNew() && this.get('status').code == 3;
    },
    isWaitingWorkComplete: function() {
        return !this.isNew() && this.get('status').code == 4;
    },
    isWaitingFinish: function() {
        return !this.isNew() && this.get('status').code == 5;
    },
    isCompleted: function() {
        return !this.isNew() && this.get('status').code == 6;
    }
});
