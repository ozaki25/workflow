var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var Requests = require('./collections/Requests');
var Users = require('./collections/Users');
var HeaderView = require('./views/HeaderView');
var RequestsView = require('./views/requests/RequestsView');
var FormView = require('./views/requests/FormView');
var UsersMainView = require('./views/users/MainView');

var appRouter = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
        ""           : "index",
        "requests"   : "index",
        "request/new": "newRequest",
        "users"      : "users"
    },
    initialize: function() {
        app.getRegion('header').show(new HeaderView());
    },
    controller: {
        index: function() {
            var requests = new Requests();
            requests.fetch().done(function() {
                var requestsView = new RequestsView({collection: requests});
                app.getRegion('main').show(requestsView);
            });
        },
        newRequest: function() {
            var requests = new Requests();
            requests.fetch().done(function() {
                var formView = new FormView({collection: requests});
                app.getRegion('main').show(formView);
            });
        },
        users: function() {
            var users = new Users();
            users.fetch().done(function() {
                var usersMainView = new UsersMainView({collection: users});
                app.getRegion('main').show(usersMainView);
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
