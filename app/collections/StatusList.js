var _ = require('underscore');
var Backbone = require('backbone');
var Status = require('../models/Status');

module.exports = Backbone.Collection.extend({
    model: Status,
    url: '/statuses'
});
