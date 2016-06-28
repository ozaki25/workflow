var Backbone = require('backbone');
var Document = require('../models/Document');

module.exports = Backbone.Collection.extend({
    model: Document,
    setUrl: function(requestId) {
        this.url = 'http://localhost:8080/requests/' + requestId + '/documents'
    }
});
