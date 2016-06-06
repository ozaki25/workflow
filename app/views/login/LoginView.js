var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var UsersView = require('./UsersView');

module.exports = Backbone.Marionette.LayoutView.extend({
    template: '#users_main_view',
    regions: {
        usersMain: '#users_main'
    },
    childEvents: {
        'selected:user': 'login'
    },
    initialize: function(options) {
        this.app = options.app;
    },
    onRender: function() {
        var usersView = new UsersView({collection: this.collection});
        this.getRegion('usersMain').show(usersView);
    },
    login: function(view) {
        this.app.currentUser = view.model;
        Backbone.history.navigate('', {trigger: true});
    }
});

