var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.View.extend({
    tagName: 'tr',
    template: '#status_view'
});
