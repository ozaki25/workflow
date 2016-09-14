var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var SearchView = require('./SearchView');
var RequestsView = require('./RequestsView');
var PagingView = require('./PagingView');

module.exports = Backbone.Marionette.LayoutView.extend({
    className: 'panel panel-default',
    template: '#request_index_view',
    regions: {
        searchRegion: '#search_region',
        requestsRegion: '#requests_region',
        pagingRegion: '#paging_region',
    },
    modelEvents: {
        'sync': 'renderRequests',
    },
    childEvents: {
        'click:changePage': 'onClickChangePage',
        'submit:search': 'onSubmitSearch',
    },
    initialize: function(options) {
        this.statusList = options.statusList;
        this.categoryList = options.categoryList;
        this.query = options.searchQuery;
        this.getRequestsPage();
    },
    onBeforeShow: function() {
        this.renderSearch();
        this.renderRequests();
        this.renderPaging()
    },
    renderSearch: function() {
        var searchView = new SearchView({ statusList: this.statusList, categoryList: this.categoryList });
        this.getRegion('searchRegion').show(searchView);
    },
    renderRequests: function() {
        var requestsView = new RequestsView({ collection: this.collection, backUrlQuery: this.getBackUrlQuery() });
        this.getRegion('requestsRegion').show(requestsView);
    },
    renderPaging: function() {
        var pagingView = new PagingView({ collection: this.collection, model: this.model });
        this.getRegion('pagingRegion').show(pagingView);
    },
    onClickChangePage: function(view) {
        this.getRequestsPage();
    },
    onSubmitSearch: function(view, query) {
        this.query = query;
        this.model.set({ pageNumber: 1 });
        this.getRequestsPage();
    },
    getRequestsPage: function() {
        var options = Backbone.$.extend({}, this.query, { page: this.model.get('pageNumber') })
        this.collection.fetch({ data: options });
        this.model.setUrl();
        this.model.fetch({ data: this.query });
    },
    getBackUrlQuery: function() {
        var queryObject = Backbone.$.extend({}, this.query, { page: this.model.get('pageNumber') })
        return '?' + Backbone.$.param(queryObject);
    },
});
