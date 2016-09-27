var _ = require('underscore');
var Backbone = require('backbone');
var User = require('../models/User');
var Teams = require('./Teams');

module.exports = Backbone.Collection.extend({
    model: User,
    url: '/users',
    getAuthorizerList: function() {
        return _(this.models).filter(function(user) {
            return user.get('jobLevel') <= 2;
        });
    },
    getTeamList: function() {
        var teamList = _(_(this.pluck('team')).uniq()).map(function(team) {
            return { name: team }
        });
        return new Teams(teamList);
    }
});
