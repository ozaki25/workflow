var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var SearchView = require('./SearchView');
var PagingView = require('./PagingView');
var GridView = require('../../lib/GridView');
var ButtonView = require('../../lib/ButtonView');

module.exports = Backbone.Marionette.LayoutView.extend({
    className: 'panel panel-default',
    template: '#request_index_view',
    regions: {
        searchRegion: '#search_region',
        requestsRegion: '#requests_region',
        pagingRegion: '#paging_region',
    },
    childEvents: {
        'submit:search': 'onSubmitSearch',
        'click:open': 'onClickOpen',
        'click:header' : 'onClickHeader',
        'click:changePage': 'onClickChangePage',
    },
    initialize: function(options) {
        this.statusList = options.statusList;
        this.categoryList = options.categoryList;
        this.teamList = options.teamList;
        this.requestNumberList = options.requestNumberList;
        this.query = options.searchQuery;
        this.getRequestsPage();
    },
    onBeforeShow: function() {
        this.renderSearch();
        this.renderRequests();
        this.renderPaging();
    },
    renderSearch: function() {
        var searchView = new SearchView({
            query: this.query,
            statusList: this.statusList,
            categoryList: this.categoryList,
            teamList: this.teamList,
            requestNumberList: this.requestNumberList,
        });
        this.getRegion('searchRegion').show(searchView);
    },
    renderRequests: function() {
        var columns = [
            { label: 'ID', name: 'reqId' },
            { label: 'Status', name: 'status.name' },
            { label: 'Title', name: 'title' },
            { label: 'User', name: 'applicant.name' },
            { label: 'Team', name: 'applicant.team' },
            { child: { view: ButtonView, options: { label: 'Open', _className: 'btn btn-xs btn-default', clickEventName: 'click:open' } } },
        ];
        var gridView = new GridView({
            collection: this.collection,
            columns: columns,
            eventNames: ['click:open'],
        });
        this.getRegion('requestsRegion').show(gridView);
    },
    renderPaging: function() {
        var pagingView = new PagingView({ collection: this.collection, model: this.model });
        this.getRegion('pagingRegion').show(pagingView);
    },
    onSubmitSearch: function(view, query) {
        this.query = query;
        this.model.set({ pageNumber: 1 });
        this.getRequestsPage();
    },
    onClickOpen: function(view) {
        localStorage.setItem('backIndexQuery', this.getBackUrlQuery());
        Backbone.history.navigate('/requests/' + view.model.id, { trigger: true });
    },
    onClickHeader: function(view, name, e) {
        if(name === 'title') {
            this.model.set({ pageNumber: 1 });
            this.query.order = this.query.order && this.query.order === 'title.asc' ? 'title.desc' : 'title.asc';
            this.getRequestsPage();
        }
    },
    onClickChangePage: function(view) {
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
