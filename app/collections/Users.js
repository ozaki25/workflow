var Backbone = require('backbone');
var User = require('../models/User');

module.exports = Backbone.Collection.extend({
    model: User,
    url: '/users',
    addDefaultUser: function() {
        this.createUser('001', 'アドミンユーザ', '管理チーム', 0, true);
        this.createUser('002', '一般ユーザ', '開発チーム', 3, false);
        this.createUser('003', '役席ユーザ', '開発チーム', 2, false);
        this.createUser('004', '受付ユーザ', '運用チーム', 2, true);
        this.createUser('005', '担当ユーザ', '運用チーム', 4, false);
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
