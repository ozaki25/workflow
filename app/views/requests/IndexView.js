var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var Page = require('../../models/Page');
var RequestsView = require('./RequestsView');
var PagingView = require('./PagingView');

module.exports = Backbone.Marionette.LayoutView.extend({
    className: 'panel panel-default',
    template: '#request_index_view',
    childEvents: {
    },
    regions: {
        requestsRegion: '#requests_region',
        pagingRegion: '#paging_region',
    },
    onBeforeShow: function() {
        this.renderRequests();
        this.renderPaging()
    },
    renderRequests: function() {
        var requestsView = new RequestsView({ collection: this.collection });
        this.getRegion('requestsRegion').show(requestsView);
    },
    renderPaging: function() {
        var pagingView = new PagingView({collection: this.collection,  model: new Page() });
        this.getRegion('pagingRegion').show(pagingView);
    },
});
