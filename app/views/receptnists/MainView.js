var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var User = require('../../models/User');
var Users = require('../../collections/Users');
var ReceptnistsView = require('./ReceptnistsView');
var UsersModalView = require('../UsersModalView');

module.exports = Backbone.Marionette.LayoutView.extend({
    template: '#receptnists_main_view',
    regions: {
        receptnistsMain: '#receptnists_main',
        receptnistsModal: '#select_receptnists_modal'
    },
    collectionEvents: {
        'add change': 'showIndex'
    },
    childEvents: {
        'click:edit': 'showEdit',
        'select:users': 'onSelectedUsers'
    },
    initialize: function(options) {
        this.currentUser = options.currentUser;
        this.teams = options.teams;
    },
    onRender: function() {
        var receptnistsView = new ReceptnistsView({collection: this.collection, model: this.model});
        this.getRegion('receptnistsMain').show(receptnistsView);
        var usersModalView = new UsersModalView({collection: new Users(), currentUser: this.currentUser, teams: this.teams, type: 'checkbox'});
        this.getRegion('receptnistsModal').show(usersModalView);
    },
    showEdit: function(view) {
        var formView = new FormView({collection: this.collection, model: view.model});
        this.getRegion('receptnistsMain').show(formView);
    },
    showIndex: function() {
        var receptnistsView = new ReceptnistsView({collection: this.collection, model: this.model});
        this.getRegion('receptnistsMain').show(receptnistsView);
    },
    onSelectedUsers: function(view, users) {
        _(users).each(function(user) {
            if(!this.collection.findWhere({uid: user.get('uid')})) {
                var clone = user.clone().set({category: {id: this.model.id}});
                this.collection.create(clone);
            }
        }.bind(this));
    }
});

