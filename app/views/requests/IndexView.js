var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var RequestsView = require('./RequestsView');
var PagingView = require('../../lib/PagingView');

module.exports = Backbone.Marionette.LayoutView.extend({
    className: 'panel panel-default',
    template: '#request_index_view',
    childEvents: {
        'click:changePage': 'getRequestsPage',
    },
    regions: {
        requestsRegion: '#requests_region',
        pagingRegion: '#paging_region',
    },
    modelEvents: {
        'change': 'renderRequests'
    },
    onBeforeShow: function() {
        this.renderRequests();
        this.renderPaging()
    },
    renderRequests: function() {
        var backUrlQuery = this.model.has('pageNumber') ? '?page=' + this.model.get('pageNumber') : '';
        var requestsView = new RequestsView({ collection: this.collection, backUrlQuery: backUrlQuery });
        this.getRegion('requestsRegion').show(requestsView);
    },
    renderPaging: function() {
        var pagingView = new PagingView({collection: this.collection, model: this.model });
        this.getRegion('pagingRegion').show(pagingView);
        this.getRequestsPage(this.getRegion('pagingRegion').currentView);
    },
    getRequestsPage: function(view) {
        this.collection.fetch({ data: { page: this.model.get('pageNumber') } });
        this.model.fetch({ data: { page: this.model.get('pageNumber') } });
    },
});
