var Backbone = require('backbone');
var Division = require('../models/Division');

module.exports = Backbone.Collection.extend({
    model: Division,
    setUrl: function(categoryId) {
        this.url = '/categories/' + categoryId + '/divisions';
    }
});
