var $ = jQuery = require('jquery');
require('bootstrap');
var Marionette = require('backbone.marionette');
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
