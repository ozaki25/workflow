var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

var StatusList = require('../../collections/StatusList');

var HeaderView   = require('../HeaderView');
var SideMenuView = require('../SideMenuView');
var IndexView    = require('./IndexView');

module.exports = Backbone.Marionette.LayoutView.extend({
    template: '#root_view',
    regions: {
        headerRegion  : '#header_region',
        sideMenuRegion: '#side_menu_region',
        mainRegion    : '#main_region',
    },
    initialize: function(options) {
        this.currentUser= options.currentUser;
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
        var statusList = new StatusList();
        statusList.fetch();
        this.getRegion('mainRegion').show(new IndexView({ collection: statusList }));
    },
});
