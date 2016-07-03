var Backbone = require('backbone');
var User = require('../models/User');

module.exports = Backbone.Collection.extend({
    model: User,
    url: '/users'
});
