var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

var Request = require('../../models/Request');

var Requests   = require('../../collections/Requests');
var StatusList = require('../../collections/StatusList');
var Categories = require('../../collections/Categories');
var Users      = require('../../collections/Users')
var Teams      = require('../../collections/Teams')

var HeaderView   = require('../HeaderView');
var SideMenuView = require('../SideMenuView');
var FormView     = require('./FormView');

module.exports = Backbone.Marionette.LayoutView.extend({
    template: '#root_view',
    regions: {
        headerRegion  : '#header_region',
        sideMenuRegion: '#side_menu_region',
        mainRegion    : '#main_region',
    },
    initialize: function(options) {
        this.requestId   = options.requestId;
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
        var request =  new Request({}, { collection: new Requests() });
        if(!!this.requestId) request.set({ id: this.requestId });
        var statusList = new StatusList();
        var categories = new Categories();
        var users = new Users();

        Backbone.$.when(
            request.has('id') ? request.fetch() : _.noop(),
            statusList.fetch(),
            categories.fetch(),
            users.fetch()
        ).done(function() {
            var formView = new FormView({
                model      : request,
                statusList : statusList,
                categories : categories,
                teams      : new Teams(users.getTeamList()),
                currentUser: this.currentUser,
            });
            this.getRegion('mainRegion').show(formView);
        }.bind(this));
    },
});
