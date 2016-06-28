var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    setUrl: function(requestId) {
        this.url = 'http://localhost:8080/requests/' + requestId + '/documents'
    }
});
