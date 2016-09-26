var moment = require('moment');
var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    parse: function(data) {
        data.createdDate = moment(new Date(data.createdDate)).format('YYYY/MM/DD HH:mm');
        return data;
    }
});
