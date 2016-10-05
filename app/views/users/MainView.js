var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var UsersView = require('./UsersView');
var FormView = require('./FormView');

module.exports = Backbone.Marionette.View.extend({
    template: '#users_main_view',
    regions: {
        usersMain: '#users_main'
    },
    collectionEvents: {
        'add change': 'showIndex'
    },
    childViewEvents: {
        'click:new' : 'showNew',
        'click:edit': 'showEdit'
    },
    onRender: function() {
        var usersView = new UsersView({collection: this.collection});
        this.getRegion('usersMain').show(usersView);
    },
    showNew: function() {
        var formView = new FormView({collection: this.collection});
        this.getRegion('usersMain').show(formView);
    },
    showEdit: function(view) {
        var formView = new FormView({collection: this.collection, model: view.model});
        this.getRegion('usersMain').show(formView);
    },
    showIndex: function() {
        var usersView = new UsersView({collection: this.collection});
        this.getRegion('usersMain').show(usersView);
    }
});

