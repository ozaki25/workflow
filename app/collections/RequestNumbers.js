var _ = require('underscore');
var Backbone = require('backbone');
var RequestNumber = require('../models/RequestNumber');

module.exports = Backbone.Collection.extend({
    model: RequestNumber,
    url: '/request-numbers',
});
