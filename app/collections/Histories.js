var Backbone = require('backbone');
var History = require('../models/History');

module.exports = Backbone.Collection.extend({
    model: History,
    setUrl: function(requestId) {
        this.url = '/requests/' + requestId + '/histories';
    },
});
