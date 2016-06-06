var Backbone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');
var User = require('../models/User');

module.exports = Backbone.Collection.extend({
    model: User,
    localStorage: new Backbone.LocalStorage('Workflow.users'),
    addDefaultUser: function() {
        this.create({
            uid: 'admin1234',
            name: 'テストユーザ',
            team: 'テストチーム',
            jobLevel: '1',
            admin: true
        }, {wait: true});
    }
});
