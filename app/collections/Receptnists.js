var _ = require('underscore');
var Backbone = require('backbone');
var User = require('../models/User');

module.exports = Backbone.Collection.extend({
    model: User,
    setUrl: function(categoryId) {
        this.url = '/categories/' + categoryId + '/receptnists';
    }
});
