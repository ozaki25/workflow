var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

var Category = require('../../models/Category');

var Categories = require('../../collections/Categories');
var Divisions  = require('../../collections/Divisions');

var HeaderView   = require('../HeaderView');
var SideMenuView = require('../SideMenuView');
var MainView     = require('./MainView');

module.exports = Backbone.Marionette.LayoutView.extend({
    template: '#root_view',
    regions: {
        headerRegion  : '#header_region',
        sideMenuRegion: '#side_menu_region',
        mainRegion    : '#main_region',
    },
    initialize: function(options) {
        this.currentUser= options.currentUser;
        this.categoryId = options.categoryId;
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
        var category = new Category({ id: this.categoryId }, { collection: new Categories() });
        var divisions = new Divisions();
        divisions.setUrl(this.categoryId);
        Backbone.$.when(
            category.fetch(),
            divisions.fetch()
        ).done(function() {
            this.getRegion('mainRegion').show(new MainView({ collection: divisions, model: category }));
        }.bind(this));
    },
});
