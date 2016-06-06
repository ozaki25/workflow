var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var Request = require('./models/Request');
var Requests = require('./collections/Requests');
var Users = require('./collections/Users');
var HeaderView = require('./views/HeaderView');
var RequestsView = require('./views/requests/RequestsView');
var RequestFormView = require('./views/requests/FormView');
var ShowRequestView = require('./views/requests/ShowView');
var UsersMainView = require('./views/users/MainView');
var LoginView = require('./views/login/LoginView');

var requests = new Requests();
var users = new Users();

var appRouter = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
        "login"        : "login",
        ""             : "index",
        "requests"     : "index",
        "requests/new" : "newRequest",
        "requests/:id" : "showRequest",
        "users"        : "users"
    },
    onRoute: function() {
        if(!app.currentUser) this.navigate('login', {trigger: true});
        app.getRegion('header').show(new HeaderView({model: app.currentUser}));
    },
    controller: {
        login: function() {
            users.fetch().done(function() {
                if(users.length == 0) users.addDefaultUser();
                var loginView = new LoginView({collection: users, app: app});
                app.getRegion('main').show(loginView);
            });
        },
        index: function() {
            requests.fetch().done(function() {
                var requestsView = new RequestsView({collection: requests});
                app.getRegion('main').show(requestsView);
            });
        },
        newRequest: function() {
            requests.fetch().done(function() {
                var formView = new RequestFormView({collection: requests, currentUser: app.currentUser});
                app.getRegion('main').show(formView);
            });
        },
        showRequest: function(id) {
            var request = new Request({id: id});
            request.collection = requests; // backbone.localstorage用
            request.fetch().done(function() {
                var showView = new ShowRequestView({model: request});
                app.getRegion('main').show(showView);
            });
        },
        users: function() {
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
