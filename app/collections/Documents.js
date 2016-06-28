var Backbone = require('backbone');
var Document = require('../models/Document');

module.exports = Backbone.Collection.extend({
    model: Document
});
