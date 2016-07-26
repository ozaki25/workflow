var Backbone = require('backbone');
var Work = require('../models/Work');

module.exports = Backbone.Collection.extend({
    model: Work,
    setUrl: function(requestId) {
        this.url = '/requests/' + requestId + '/works';
    }
});
