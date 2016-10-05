var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

var Page = require('../../models/Page');

var Requests           = require('../../collections/Requests');
var StatusList         = require('../../collections/StatusList');
var Categories         = require('../../collections/Categories');
var RequestNumbers     = require('../../collections/RequestNumbers');
var RequestDepartments = require('../../collections/RequestDepartments');

var HeaderView   = require('../HeaderView');
var SideMenuView = require('../SideMenuView');
var IndexView    = require('./IndexView');

module.exports = Backbone.Marionette.View.extend({
    template: '#root_view',
    regions: {
        headerRegion  : '#header_region',
        sideMenuRegion: '#side_menu_region',
        mainRegion    : '#main_region',
    },
    initialize: function(options) {
        this.currentUser = options.currentUser;
        this.pageNumber  = options.pageNumber;
        this.searchQuery = options.searchQuery;
    },
    onRender: function() {
        this.renderHeader();
        this.renderSideMenu();
        this.renderMain();
    },
    renderHeader: function() {
        this.getRegion('headerRegion').show(new HeaderView({ model: this.currentUser }));
    },
    renderSideMenu: function() {
        this.getRegion('sideMenuRegion').show(new SideMenuView());
    },
    renderMain: function() {
        var requests       = new Requests();
        var statusList     = new StatusList();
        var categories     = new Categories();
        var teams          = new RequestDepartments();
        var requestNumbers = new RequestNumbers();
        Backbone.$.when(
            requests.fetch(),
            statusList.fetch(),
            categories.fetch(),
            teams.fetch(),
            requestNumbers.fetch()
        ).done(function() {
            var indexView = new IndexView({
                collection    : requests,
                model         : new Page({ pageNumber: this.pageNumber }),
                statusList    : statusList,
                categories    : categories,
                teams         : teams,
                requestNumbers: requestNumbers,
                searchQuery   : this.searchQuery,
            });
            this.getRegion('mainRegion').show(indexView);
        }.bind(this));
    },
});
