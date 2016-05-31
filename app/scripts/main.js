var $ = jQuery = require('jquery');
require('bootstrap');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var HeaderView = require('./views/HeaderView');
var TestView = require('./views/TestView');

var App = new Backbone.Marionette.Application({
    regions: {
        header: '#header',
        main: '#main'
    },
    onStart: function() {
        this.getRegion('header').show(new HeaderView());
        this.getRegion('main').show(new TestView());
    }
});

App.start();
