var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

var Request = require('../../models/Request');

var Requests    = require('../../collections/Requests');
var StatusList  = require('../../collections/StatusList');
var Categories  = require('../../collections/Categories');
var Users       = require('../../collections/Users')
var Teams       = require('../../collections/Teams')
var Documents   = require('../../collections/Documents');
var Histories   = require('../../collections/Histories')
var Receptnists = require('../../collections/Receptnists')

var HeaderView   = require('../HeaderView');
var SideMenuView = require('../SideMenuView');
var FormView     = require('./FormView');

module.exports = Backbone.Marionette.View.extend({
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
        var request     = new Request({}, { collection: new Requests() });
        var statusList  = new StatusList();
        var categories  = new Categories();
        var users       = new Users();
        var histories   = new Histories();
        var receptnists = new Receptnists();
        if(!!this.requestId) {
            request.set({ id: this.requestId });
            histories.setUrl(this.requestId);
        }

        Backbone.$.when(
            request.has('id') ? request.fetch() : _.noop(),
            statusList.fetch(),
            categories.fetch(),
            users.fetch(),
            histories.url ? histories.fetch() : _.noop()
        ).done(function() {
            var formView = new FormView({
                model      : request,
                statusList : statusList,
                categories : categories,
                teams      : new Teams(users.getTeamList()),
                documents  : new Documents(request.get('documents')),
                histories  : histories,
                receptnists: receptnists,
                currentUser: this.currentUser,
            });
            if(request.isRequested()) {
                receptnists.setUrl(request.get('category').id);
                receptnists.fetch().done(function() {
                    formView.receptnists = receptnists;
                    this.getRegion('mainRegion').show(formView);
                }.bind(this));
            } else {
                this.getRegion('mainRegion').show(formView);
            }
        }.bind(this));
    },
});
