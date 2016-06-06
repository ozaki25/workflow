var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var Requests = require('./collections/Requests');
var Users = require('./collections/Users');
var HeaderView = require('./views/HeaderView');
var RequestsView = require('./views/requests/RequestsView');
var FormView = require('./views/requests/FormView');
var UsersMainView = require('./views/users/MainView');
var LoginView = require('./views/login/LoginView');

var appRouter = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
        "login"      : "login",
        ""           : "index",
        "requests"   : "index",
        "request/new": "newRequest",
        "users"      : "users"
    },
    onRoute: function() {
        if(!app.currentUser) this.navigate('login', {trigger: true});
        app.getRegion('header').show(new HeaderView({model: app.currentUser}));
    },
    controller: {
        login: function() {
            var users = new Users();
            users.fetch().done(function() {
                if(users.length == 0) users.addDefaultUser();
                var loginView = new LoginView({collection: users, app: app});
                app.getRegion('main').show(loginView);
            });
        },
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
