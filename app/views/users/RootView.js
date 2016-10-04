var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

var Users = require('../../collections/Users');

var HeaderView   = require('../HeaderView');
var SideMenuView = require('../SideMenuView');
var MainView    = require('./MainView');

module.exports = Backbone.Marionette.LayoutView.extend({
    template: '#root_view',
    regions: {
        headerRegion  : '#header_region',
        sideMenuRegion: '#side_menu_region',
        mainRegion    : '#main_region',
    },
    initialize: function(options) {
        this.currentUser = options.currentUser;
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
        var users = new Users();
        users.fetch();
        this.getRegion('mainRegion').show(new MainView({ collection: users }));
    },
});
