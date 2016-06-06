var Backbone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');

module.exports = Backbone.Model.extend({
    localStorage: new Backbone.LocalStorage('Workflow.requests'),
    validation: {
        title: {
            required: true,
            msg: '必須項目です。'
        },
        content: {
            required: true,
            msg: '必須項目です。'
        },
        userId: { }
    }
});
