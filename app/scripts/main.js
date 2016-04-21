var $ = jQuery = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var Bootstrap = require('bootstrap');
var TestView = require('./views/TestView');

var App = new Marionette.Application({
    regions: {
        main: '#main'
    },
    onStart: function() {
        this.getRegion('main').show(new TestView());
    }
});

App.start();
