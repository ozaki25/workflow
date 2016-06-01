var $ = jQuery = require('jquery');
require('bootstrap');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var Users = require('./collections/Users');
var HeaderView = require('./views/HeaderView');
var TestView = require('./views/test/TestView');
var UsersView = require('./views/users/UsersView');

var appRouter = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
        "": "test",
        "test": "test",
        "users": "users"
    },
    initialize: function() {
        app.getRegion('header').show(new HeaderView());
    },
    controller: {
        test: function() {
            app.getRegion('main').show(new TestView());
        },
        users: function() {
            var users = new Users();
            users.fetch().done(function() {
                var usersView = new UsersView({collection: users});
                app.getRegion('main').show(usersView);
            });
        }
    }
});

var app = new Backbone.Marionette.Application({
    regions: {
        header: '#header',
        main: '#main'
    },
    onStart: function() {
        new appRouter();
        Backbone.history.start();
    }
});

app.start();
