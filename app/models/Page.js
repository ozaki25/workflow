var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    defaults: {
        pageNumber: 0,
        totalPage: 0,
    },
    setUrl: function() {
        this.url = '/requests/page/' + this.get('pageNumber');
    },
});
