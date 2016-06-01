var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var Requests = require('./collections/Requests');
var HeaderView = require('./views/HeaderView');
var TestView = require('./views/test/TestView');
var RequestsView = require('./views/requests/RequestsView');

var appRouter = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
        "": "index",
        "requests": "index",
        "request/new": "newRequest"
    },
    initialize: function() {
        app.getRegion('header').show(new HeaderView());
    },
    controller: {
        index: function() {
            app.getRegion('main').show(new TestView());
        },
        newRequest: function() {
            var requests = new Requests();
            requests.fetch().done(function() {
                var requestsView = new RequestsView({collection: requests});
                app.getRegion('main').show(requestsView);
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
