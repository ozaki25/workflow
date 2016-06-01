var Backbone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');
var Request = require('../models/Request');

module.exports = Backbone.Collection.extend({
    model: Request,
    localStorage: new Backbone.LocalStorage('BackboneMarionetteTemplate.requests')
});
