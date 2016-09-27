var _ = require('underscore');
var Backbone = require('backbone');
var User = require('../models/User');

module.exports = Backbone.Collection.extend({
    model: User,
    url: '/users',
    getAuthorizerList: function() {
        return _(this.models).filter(function(user) {
            return user.get('jobLevel') <= 2;
        });
    },
    getTeamList: function() {
        return _(this.models).reduce(function(tmp, model) {
            var team = model.pick('team');
            if(!_(tmp).some(function(t) { return t.team == team.team })) tmp.push(team);
            return tmp;
        }, []);
    },
});
