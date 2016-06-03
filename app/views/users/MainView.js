var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var UsersView = require('./UsersView');
var FormView = require('./FormView');

module.exports = Backbone.Marionette.LayoutView.extend({
    className: 'container',
    template: '#users_main_view',
    regions: {
        usersMain: '#users_main'
    },
    collectionEvents: {
        'add': 'showIndex'
    },
    childEvents: {
        'click:new': 'showNew'
    },
    onRender: function() {
        var usersView = new UsersView({collection: this.collection});
        this.getRegion('usersMain').show(usersView);
    },
    showNew: function() {
        var formView = new FormView({collection: this.collection});
        this.getRegion('usersMain').show(formView);
    },
    showIndex: function() {
        var usersView = new UsersView({collection: this.collection});
        this.getRegion('usersMain').show(usersView);
    }
});

