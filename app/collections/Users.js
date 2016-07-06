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
    }
});
