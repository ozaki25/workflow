var Backbone = require('backbone');
module.exports = Backbone.Model.extend({
    defaults: {
        pageNumber: 0,
        totalPage: 0
    }
});
