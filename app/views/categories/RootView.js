var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

var Categories = require('../../collections/Categories');

var HeaderView   = require('../HeaderView');
var SideMenuView = require('../SideMenuView');
var MainView     = require('./MainView');

module.exports = Backbone.Marionette.View.extend({
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
        var categories = new Categories();
        categories.fetch().done(function() {
            this.getRegion('mainRegion').show(new MainView({ collection: categories }));
        }.bind(this));
    },
});
