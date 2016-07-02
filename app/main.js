var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.csrf = require('./csrf');
Backbone.csrf()
var Request = require('./models/Request');
var Requests = require('./collections/Requests');
var Users = require('./collections/Users');
var Categories = require('./collections/Categories');
var StatusList = require('./collections/StatusList');
var HeaderView = require('./views/HeaderView');
var SideMenuView = require('./views/SideMenuView');
var RequestsMainView = require('./views/requests/MainView');
var RequestFormView = require('./views/requests/FormView');
var UsersMainView = require('./views/users/MainView');
var CategoriesMainView = require('./views/categories/MainView');
var StatusListView = require('./views/statusList/StatusListView');
var LoginView = require('./views/login/LoginView');

var requests = new Requests();
var users = new Users();
var statusList = new StatusList();
var categories = new Categories();

var appRouter = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
        "login"        : "login",
        ""             : "requests",
        "requests"     : "requests",
        "requests/:id" : "request",
        "users"        : "users",
        "categories"   : "categories",
        "status_list"  : "statusList"
    },
    initialize: function() {
        statusList.fetch().done(function() {
            if(statusList.length === 0) statusList.addDefaultStatus();
        });
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
        requests: function() {
            requests.fetch().done(function() {
                var requestsMainView = new RequestsMainView({collection: requests, currentUser: app.currentUser, statusList: statusList});
                app.getRegion('main').show(requestsMainView);
            });
        },
        request: function(id) {
            var request = new Request({id: id}, {collection: requests});
            request.fetch().done(function() {
                var formView = new RequestFormView({model: request, currentUser: app.currentUser, statusList: statusList});
                app.getRegion('main').show(formView);
            });
        },
        users: function() {
            users.fetch().done(function() {
                var usersMainView = new UsersMainView({collection: users});
                app.getRegion('main').show(usersMainView);
            });
        },
        categories: function() {
            categories.fetch().done(function() {
                if(categories.length === 0) categories.addDefaultCategories();
                var categoriesMainView = new CategoriesMainView({collection: categories});
                app.getRegion('main').show(categoriesMainView);
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
    onBeforeStart: function() {
        // springbootのviewでunderscoreのtemplateを使えるようにタグを変更
        _.templateSettings = {
            evaluate:    /\{\{(.+?)\}\}/g,
            interpolate: /\{\{=(.+?)\}\}/g,
            escape:      /\{\{-(.+?)\}\}/g
        };
    },
    onStart: function() {
        new appRouter();
        Backbone.history.start();
    }
});

app.start();
