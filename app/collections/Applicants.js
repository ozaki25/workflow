var _ = require('underscore');
var Backbone = require('backbone');
var Applicant = require('../models/Applicant');

module.exports = Backbone.Collection.extend({
    model: Applicant,
    url: '/applicants',
});
