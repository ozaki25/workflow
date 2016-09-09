var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var RequestView = require('./RequestView');

module.exports = Backbone.Marionette.CompositeView.extend({
    tagName: 'table',
    className: 'table',
    childView: RequestView,
    childViewContainer: '#request_list',
    template: '#requests_view',
});
