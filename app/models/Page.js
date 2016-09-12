var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    defaults: {
        pageNumber: 0,
        totalPage: 0,
    },
    isFirst: function() {
        return this.get('pageNumber') <= 1;
    },
    isLast: function() {
        return this.get('pageNumber') >= this.get('totalPage');
    },
});
