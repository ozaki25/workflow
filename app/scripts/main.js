var $ = jQuery = require('jquery');
require('bootstrap');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var TestView = require('./views/TestView');

var App = new Backbone.Marionette.Application({
    regions: {
        main: '#main'
    },
    onStart: function() {
        this.getRegion('main').show(new TestView());
    }
});

App.start();
