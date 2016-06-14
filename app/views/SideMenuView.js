var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.ItemView.extend({
    tagName: 'ul',
    className: 'nav nav-pills nav-stacked',
    template: '#side_menu_view'
});
