var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.View.extend({
    tagName: 'span',
    template: '#request_page_number_view',
});
