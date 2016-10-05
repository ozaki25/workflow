var _ = require('underscore');
var Backbone = require('backbone');
var Receptnist = require('../models/Receptnist');

module.exports = Backbone.Collection.extend({
    model: Receptnist,
    setUrl: function(categoryId) {
        this.url = '/categories/' + categoryId + '/receptnists';
    }
});
