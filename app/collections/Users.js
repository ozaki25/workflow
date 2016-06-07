var Backbone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');
var User = require('../models/User');

module.exports = Backbone.Collection.extend({
    model: User,
    localStorage: new Backbone.LocalStorage('Workflow.users'),
    addDefaultUser: function() {
        this.createUser('ABC0001', 'アドミンユーザ', '管理チーム', 0, true);
        this.createUser('ABC0002', '一般ユーザ', '開発チーム', 3, false);
        this.createUser('ABC0003', '役席ユーザ', '開発チーム', 2, false);
        this.createUser('ABC0004', '受付ユーザ', '運用チーム', 2, true);
        this.createUser('ABC0005', '担当ユーザ', '運用チーム', 4, false);
    },
    createUser: function(uid, name, team, jobLevel, admin) {
        this.create({
            uid: uid,
            name: name,
            team: team,
            jobLevel: jobLevel,
            admin: admin
        }, {wait: true});
    }
});
