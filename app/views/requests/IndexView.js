var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var RequestsView = require('./RequestsView');
var PagingView = require('../../lib/PagingView');

module.exports = Backbone.Marionette.LayoutView.extend({
    className: 'panel panel-default',
    template: '#request_index_view',
    childEvents: {
        'click:changePage': 'onClickChangePageBtn',
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
        var pagingView = new PagingView({collection: this.collection });
        this.getRegion('pagingRegion').show(pagingView);
        this.onClickChangePageBtn(this.getRegion('pagingRegion').currentView);
    },
    onClickChangePageBtn: function(view) {
        this.collection.fetch({ data: { page: view.model.get('pageNumber') - 1 } });
        Backbone.$.get('/requests/total-page', function(totalPage) {
            view.model.set({ totalPage: totalPage });
        });
    },
});
