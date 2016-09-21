var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    parse: function(data) {
        data.createdDate = new Date(data.createdDate).toLocaleDateString("ja-JP");
        return data;
    }
});
