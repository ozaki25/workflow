var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.csrf = require('./csrf');
Backbone.csrf();
window.jQuery = Backbone.$;
require('./assets/js/bootstrap');

var User = require('./models/User');

var RequestsRootView    = require('./views/requests/RootView.js');
var RequestRootView     = require('./views/request/RootView.js');
var UsersRootView       = require('./views/users/RootView.js');
var CategoriesRootView  = require('./views/categories/RootView.js');
var DivisionsRootView   = require('./views/divisions/RootView.js');
var ReceptnistsRootView = require('./views/receptnists/RootView.js');
var StatusRootView      = require('./views/statusList/RootView.js');

var searchItems = ['year', 'statusId', 'categoryId', 'title', 'team', 'name', 'order'];

var getCurrentUser = Backbone.$.get('/current-user');

var appRouter = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
        ""                          : "requests",
        "requests"                  : "requests",
        "requests/new"              : "request",
        "requests/:id"              : "request",
        "users"                     : "users",
        "categories"                : "categories",
        "categories/:id/divisions"  : "divisions",
        "categories/:id/receptnists": "receptnists",
        "status"                    : "statusList",
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
            getCurrentUser.done(function(user) {
                var pageNumber = query ? parseInt(query.page) || 1 : 1;
                var searchQuery = query ? _(query).pick(searchItems) : {};
                var currentUser = new User(user);
                app.getRegion('rootRegion').show(new RequestsRootView({ currentUser: currentUser, pageNumber: pageNumber, searchQuery: searchQuery }));
            });
        },
        request: function(id) {
            getCurrentUser.done(function(user) {
                var currentUser = new User(user);
                app.getRegion('rootRegion').show(new RequestRootView({ currentUser: currentUser, requestId: id }));
            });
        },
        users: function() {
            getCurrentUser.done(function(user) {
                var currentUser = new User(user);
                app.getRegion('rootRegion').show(new UsersRootView({ currentUser: currentUser }));
            });
        },
        categories: function() {
            getCurrentUser.done(function(user) {
                var currentUser = new User(user);
                app.getRegion('rootRegion').show(new CategoriesRootView({ currentUser: currentUser }));
            });
        },
        divisions: function(categoryId) {
            getCurrentUser.done(function(user) {
                var currentUser = new User(user);
                app.getRegion('rootRegion').show(new DivisionsRootView({ currentUser: currentUser, categoryId: categoryId }));
            });
        },
        receptnists: function(categoryId) {
            getCurrentUser.done(function(user) {
                var currentUser = new User(user);
                app.getRegion('rootRegion').show(new ReceptnistsRootView({ currentUser: currentUser, categoryId: categoryId }));
            });
        },
        statusList: function() {
            getCurrentUser.done(function(user) {
                var currentUser = new User(user);
                app.getRegion('rootRegion').show(new StatusRootView({ currentUser: currentUser }));
            });
        },
    }
});

var app = new Backbone.Marionette.Application({
    regions: {
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
