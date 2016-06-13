var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var Request = require('./models/Request');
var Requests = require('./collections/Requests');
var Users = require('./collections/Users');
var StatusList = require('./collections/StatusList');
var HeaderView = require('./views/HeaderView');
var SideMenuView = require('./views/SideMenuView');
var RequestsView = require('./views/requests/RequestsView');
var RequestFormView = require('./views/requests/FormView');
var ShowRequestView = require('./views/requests/ShowView');
var UsersMainView = require('./views/users/MainView');
var StatusListView = require('./views/statusList/StatusListView');
var LoginView = require('./views/login/LoginView');

var requests = new Requests();
var users = new Users();
var statusList = new StatusList();

var appRouter = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
        "login"             : "login",
        ""                  : "index",
        "requests"          : "index",
        "requests/new"      : "newRequest",
        "requests/:id/edit" : "editRequest",
        "requests/:id"      : "showRequest",
        "users"             : "users",
        "status_list"       : "statusList"
    },
    initialize: function() {
        statusList.fetch();
        if(statusList.length === 0) statusList.addDefaultStatus();
    },
    onRoute: function() {
        if(!app.currentUser) this.navigate('login', {trigger: true});
        app.getRegion('header').show(new HeaderView({model: app.currentUser}));
        app.getRegion('sideMenu').show(new SideMenuView());
    },
    controller: {
        login: function() {
            users.fetch().done(function() {
                if(users.length === 0) users.addDefaultUser();
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
            var request = new Request({}, {collection: requests});
            var formView = new RequestFormView({model: request, currentUser: app.currentUser, statusList: statusList});
            app.getRegion('main').show(formView);
        },
        editRequest: function(id) {
            var request = new Request({id: id}, {collection: requests});
            request.fetch().done(function() {
                var formView = new RequestFormView({model: request, currentUser: app.currentUser, statusList: statusList});
                app.getRegion('main').show(formView);
            });
        },
        showRequest: function(id) {
            var request = new Request({id: id}, {collection: requests});
            request.fetch().done(function() {
                var showView = new ShowRequestView({model: request, currentUser: app.currentUser, statusList: statusList});
                app.getRegion('main').show(showView);
            });
        },
        users: function() {
            users.fetch().done(function() {
                var usersMainView = new UsersMainView({collection: users});
                app.getRegion('main').show(usersMainView);
            });
        },
        statusList: function() {
            var statusListView = new StatusListView({collection: statusList});
            app.getRegion('main').show(statusListView);
        }
    }
});

var app = new Backbone.Marionette.Application({
    regions: {
        header: '#header',
        sideMenu: '#side_menu',
        main: '#main'
    },
    onStart: function() {
        new appRouter();
        Backbone.history.start();
    }
});

app.start();
