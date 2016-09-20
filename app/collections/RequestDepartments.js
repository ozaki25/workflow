var _ = require('underscore');
var Backbone = require('backbone');
var RequestDepartment = require('../models/RequestDepartment');

module.exports = Backbone.Collection.extend({
    model: RequestDepartment,
    url: '/request-departments',
});
