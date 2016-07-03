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

var requests = new Requests();
var users = new Users();
var statusList = new StatusList();
var categories = new Categories();

var appRouter = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
        ""             : "requests",
        "requests"     : "requests",
        "requests/:id" : "request",
        "users"        : "users",
        "categories"   : "categories",
        "status_list"  : "statusList"
    },
    initialize: function() {
        var usersFetchOption = {
            success: function() {
                var uid = Backbone.$('input[name="current-user"]').val();
                app.currentUser = users.findWhere({uid: uid});
                app.getRegion('header').show(new HeaderView({model: app.currentUser}));
            }
        };
        statusList.fetch();
        users.fetch(usersFetchOption);
        app.getRegion('sideMenu').show(new SideMenuView());
    },
    controller: {
        requests: function() {
            var requestsFetchOption = {
                success: function() {
                    var requestsMainView = new RequestsMainView({collection: requests,
                                                                 currentUser: app.currentUser,
                                                                 statusList: statusList});
                    app.getRegion('main').show(requestsMainView);
                }
            };
            requests.fetch(requestsFetchOption);
        },
        request: function(id) {
            var request = new Request({id: id}, {collection: requests});
            var requestFetchOption = {
                success: function() {
                    var formView = new RequestFormView({model: request,
                                                        currentUser: app.currentUser,
                                                        statusList: statusList});
                    app.getRegion('main').show(formView);
                }
            };
            request.fetch(requestFetchOption);
        },
        users: function() {
            var usersFetchOption = {
                success: function() {
                    var usersMainView = new UsersMainView({collection: users});
                    app.getRegion('main').show(usersMainView);
                }
            };
            users.fetch(usersFetchOption);
        },
        categories: function() {
            var categoriesFetchOption = {
                success: function() {
                    if(categories.length === 0) categories.addDefaultCategories();
                    var categoriesMainView = new CategoriesMainView({collection: categories});
                    app.getRegion('main').show(categoriesMainView);
                }
            };
            categories.fetch(categoriesFetchOption);
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
