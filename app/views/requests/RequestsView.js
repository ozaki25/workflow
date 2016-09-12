var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var RequestView = require('./RequestView');

module.exports = Backbone.Marionette.CompositeView.extend({
    tagName: 'table',
    className: 'table',
    childView: RequestView,
    childViewContainer: '#request_list',
    childViewOptions: function() {
        return {
            backUrlQuery: this.backUrlQuery,
        }
    },
    template: '#requests_view',
    initialize: function(options) {
        this.backUrlQuery = options.backUrlQuery;
    },
});
