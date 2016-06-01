var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var Requests = require('./collections/Requests');
var HeaderView = require('./views/HeaderView');
var RequestsView = require('./views/requests/RequestsView');
var FormView = require('./views/requests/FormView');

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
