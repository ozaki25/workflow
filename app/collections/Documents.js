var Backbone = require('backbone');
var Document = require('../models/Document');

module.exports = Backbone.Collection.extend({
    model: Document,
    setUrl: function(requestId) {
        this.url = '/requests/' + requestId + '/documents'
    }
});
