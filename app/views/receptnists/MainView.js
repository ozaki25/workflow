var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var User = require('../../models/User');
var Users = require('../../collections/Users');
var ReceptnistsView = require('./ReceptnistsView');
var UsersModalView = require('../UsersModalView');

module.exports = Backbone.Marionette.View.extend({
    template: '#receptnists_main_view',
    regions: {
        receptnistsMainRegion : '#receptnists_main_region',
        receptnistsModalRegion: '#select_receptnists_modal_region'
    },
    collectionEvents: {
        'sync': 'renderIndex'
    },
    childEvents: {
        'click:edit'  : 'onClickEdit',
        'select:users': 'onSelectUsers'
    },
    initialize: function(options) {
        this.currentUser = options.currentUser;
        this.teams       = options.teams;
    },
    onRender: function() {
        this.renderIndex();
        this.renderUserModal();
    },
    renderIndex: function() {
        var receptnistsView = new ReceptnistsView({ collection: this.collection, model: this.model });
        this.getRegion('receptnistsMainRegion').show(receptnistsView);
    },
    renderForm: function(model) {
        var formView = new FormView({ collection: this.collection, model: model });
        this.getRegion('receptnistsMainRegion').show(formView);
    },
    renderUserModal: function() {
        var usersModalView = new UsersModalView({
            collection: new Users(),
            currentUser: this.currentUser,
            teams: this.teams,
            type: 'checkbox',
        });
        this.getRegion('receptnistsModalRegion').show(usersModalView);
    },
    onClickEdit: function(view) {
        this.renderForm(view.model);
    },
    onSelectUsers: function(view, users) {
        _(users).each(function(user) {
            if(!this.collection.findWhere({ uid: user.get('uid') })) {
                var clone = user.clone().set({ category: { id: this.model.id } });
                var receptionist = Backbone.$.extend({}, user.toJSON(), { category: { id: this.model.id } });
                this.collection.create(receptionist);
            }
        }.bind(this));
    }
});

