var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.csrf = require('../../csrf');
Backbone.csrf();
var Receptnist = require('../../models/Receptnist');

module.exports = Backbone.Marionette.ItemView.extend({
    className: 'panel panel-default',
    template: '#receptnist_form_view',
});

