var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.csrf = require('./csrf');
Backbone.csrf();
window.jQuery = Backbone.$;
var Bootstrap = require('./assets/js/bootstrap');
var Request = require('./models/Request');
var User = require('./models/User');
var Category = require('./models/Category');
var Page = require('./models/Page');
var Requests = require('./collections/Requests');
var Users = require('./collections/Users');
var StatusList = require('./collections/StatusList');
var Categories = require('./collections/Categories');
var Divisions = require('./collections/Divisions');
var Receptnists = require('./collections/Receptnists');
var HeaderView = require('./views/HeaderView');
var SideMenuView = require('./views/SideMenuView');
var RequestIndexView = require('./views/requests/IndexView');
var RequestFormView = require('./views/requests/FormView');
var UsersMainView = require('./views/users/MainView');
var StatusListView = require('./views/statusList/StatusListView');
var CategoriesMainView = require('./views/categories/MainView');
var DivisionsMainView = require('./views/divisions/MainView');
var ReceptnistsMainView = require('./views/receptnists/MainView');

var currentUser;
var requests = new Requests();
var users = new Users();
var statusList = new StatusList();
var categories = new Categories();
var teamList;

var appRouter = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
        ""                         : "requests",
        "requests"                 : "requests",
        "requests/new"             : "newRequest",
        "requests/:id"             : "request",
        "users"                    : "users",
        "status_list"              : "statusList",
        "categories"               : "categories",
        "categories/:id/divisions" : "divisions",
        "categories/:id/receptnists": "receptnists"
    },
    initialize: function() {
        Backbone.$.get('/current-user', function(user) {
            currentUser = new User(user);
            app.getRegion('header').show(new HeaderView({model: currentUser}));
        });
        statusList.fetch();
        users.fetch({success: function() {teamList = users.getTeamList();}});
        app.getRegion('sideMenu').show(new SideMenuView());
    },
    onRoute: function() {
        if(!currentUser) {
            Backbone.$.get('/current-user', function(user) {
                currentUser = new User(user);
            });
        }
    },
    execute: function(callback, args, name) {
        if(_(args).last() && _(args).last().includes('=')) args.push(this._parseQuery(args.pop()));
        if(callback) callback.apply(this, args);
    },
    _parseQuery: function(arg) {
        var splitAmp = arg.split('&');
        var splitEq = _(splitAmp).map(function(query) { return query.split('='); });
        return _.object(splitEq);
    },
    controller: {
        requests: function(query) {
            var categoryFetchOptions = {
                success: function() {
                    var pageNumber = query ? parseInt(query.page) || 1 : 1;
                    var requestIndexView = new RequestIndexView({
                        collection: requests,
                        model: new Page({ pageNumber: pageNumber }),
                        statusList: statusList,
                        categoryList: categories,
                    });
                    app.getRegion('main').show(requestIndexView);
                }
            }
            categories.fetch(categoryFetchOptions);
        },
        newRequest: function(query) {
            var backUrlQuery = '?' + _(query).map(function(value, key) {
                return key + '=' + value;
            }).join('&');
            var categoryFetchOptions = {
                success: function() {
                    var formView = new RequestFormView({
                        model: new Request({}, { collection: requests }),
                        currentUser: currentUser,
                        statusList: statusList,
                        categoryList: categories,
                        teamList: teamList,
                        backUrlQuery: backUrlQuery,
                    });
                    app.getRegion('main').show(formView);
                }
            }
            categories.fetch(categoryFetchOptions);
        },
        request: function(id, query) {
            var backUrlQuery = '?' + _(query).map(function(value, key) {
                return key + '=' + value;
            }).join('&');
            var request = new Request({ id: id }, { collection: requests });
            var requestFetchOption = {
                success: function() {
                    var categoryFetchOptions = {
                        success: function() {
                            var formView = new RequestFormView({
                                model: request,
                                currentUser: currentUser,
                                statusList: statusList,
                                teamList: teamList,
                                categoryList: categories,
                                backUrlQuery: backUrlQuery,
                            });
                            app.getRegion('main').show(formView);
                        }
                    }
                    categories.fetch(categoryFetchOptions);
                }
            };
            request.fetch(requestFetchOption);
        },
        users: function() {
            var usersFetchOption = {
                success: function() {
                    var usersMainView = new UsersMainView({ collection: users });
                    app.getRegion('main').show(usersMainView);
                }
            };
            users.fetch(usersFetchOption);
        },
        statusList: function() {
            var statusListView = new StatusListView({ collection: statusList });
            app.getRegion('main').show(statusListView);
        },
        categories: function() {
            var categoriesFetchOption = {
                success: function() {
                    var categoriesMainView = new CategoriesMainView({ collection: categories });
                    app.getRegion('main').show(categoriesMainView);
                }
            };
            categories.fetch(categoriesFetchOption);
        },
        divisions: function(categoryId) {
            var category = new Category({ id: categoryId }, { collection: new Categories() });
            var options = {
                success: function() {
                    var divisionsMainView = new DivisionsMainView({ collection: new Divisions(), model: category });
                    divisionsMainView.collection.setUrl(categoryId);
                    divisionsMainView.collection.fetch();
                    app.getRegion('main').show(divisionsMainView);
                }
            }
            category.fetch(options);
        },
        receptnists: function(categoryId) {
            var category = new Category({ id: categoryId }, { collection: new Categories() });
            var options = {
                success: function() {
                    var receptnistsMainView = new ReceptnistsMainView({
                        collection: new Receptnists(),
                        model: category,
                        currentUser: currentUser,
                        teamList: teamList
                    });
                    receptnistsMainView.collection.setUrl(categoryId);
                    receptnistsMainView.collection.fetch();
                    app.getRegion('main').show(receptnistsMainView);
                }
            }
            category.fetch(options);
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
