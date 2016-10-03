var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.csrf = require('./csrf');
Backbone.csrf();
window.jQuery = Backbone.$;
require('./assets/js/bootstrap');

var User     = require('./models/User');
var Category = require('./models/Category');

var Users              = require('./collections/Users');
var StatusList         = require('./collections/StatusList');
var Categories         = require('./collections/Categories');
var Divisions          = require('./collections/Divisions');
var Receptnists        = require('./collections/Receptnists');
var Teams              = require('./collections/Teams');

var RequestsRootView = require('./views/requests/RootView.js');
var RequestRootView  = require('./views/request/RootView.js');

var HeaderView          = require('./views/HeaderView');
var SideMenuView        = require('./views/SideMenuView');
var RequestIndexView    = require('./views/requests/IndexView');
var RequestFormView     = require('./views/request/FormView');
var UsersMainView       = require('./views/users/MainView');
var StatusListView      = require('./views/statusList/StatusListView');
var CategoriesMainView  = require('./views/categories/MainView');
var DivisionsMainView   = require('./views/divisions/MainView');
var ReceptnistsMainView = require('./views/receptnists/MainView');

var currentUser;
var users = new Users();
var statusList = new StatusList();
var categories = new Categories();
var teamList;
var searchItems = ['year', 'statusId', 'categoryId', 'title', 'team', 'name', 'order'];

var appRouter = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
        ""                          : "requests",
        "requests"                  : "requests",
        "requests/new"              : "request",
        "requests/:id"              : "request",
        "users"                     : "users",
        "status"                    : "statusList",
        "categories"                : "categories",
        "categories/:id/divisions"  : "divisions",
        "categories/:id/receptnists": "receptnists"
    },
    initialize: function() {
        Backbone.$.get('/current-user', function(user) {
            currentUser = new User(user);
            //app.getRegion('header').show(new HeaderView({ model: currentUser }));
        });
        statusList.fetch();
        users.fetch({ success: function() { teamList = new Teams(users.getTeamList()); } });
        //app.getRegion('sideMenu').show(new SideMenuView());
    },
    execute: function(callback, args, name) {
        if(_(args).last() && _(args).last().includes('=')) args.push(this.parseQuery(args.pop()));
        if(callback) callback.apply(this, args);
    },
    parseQuery: function(arg) {
        var splitAmp = arg.split('&');
        var splitEq = _(splitAmp).map(function(query) { return query.split('='); });
        return _.object(splitEq);
    },
    controller: {
        requests: function(query) {
            Backbone.$.get('/current-user', function(user) {
                var pageNumber = query ? parseInt(query.page) || 1 : 1;
                var searchQuery = query ? _(query).pick(searchItems) : {};
                currentUser = new User(user);
                app.getRegion('rootRegion').show(new RequestsRootView({ currentUser: currentUser, pageNumber: pageNumber, searchQuery: searchQuery }));
            });
        },
        request: function(id) {
            Backbone.$.get('/current-user', function(user) {
                currentUser = new User(user);
                app.getRegion('rootRegion').show(new RequestRootView({ currentUser: currentUser, requestId: id }));
            });
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
        //header: '#header',
        //sideMenu: '#side_menu',
        //main: '#main',
        rootRegion: '#root_region',
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
