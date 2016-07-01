var Backbone = require('backbone');
var Request = require('../models/Request');

module.exports = Backbone.Collection.extend({
    model: Request,
    url: '/requests',
});
