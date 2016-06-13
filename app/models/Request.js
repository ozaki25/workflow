var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    validation: {
        title: {
            required: true,
            msg: '必須項目です。'
        },
        content: {
            required: true,
            msg: '必須項目です。'
        }
    },
    isCreating: function() {
        return this.get('status').code == 1;
    },
    isWaitingApproval: function() {
        return this.get('status').code == 2;
    }
});
