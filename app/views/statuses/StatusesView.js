var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var StatusView = require('./StatusView');

module.exports = Backbone.Marionette.CompositeView.extend({
    className: 'panel panel-default',
    childView: StatusView,
    childViewContainer: '#status_list',
    template: '#statuses_view'
});

