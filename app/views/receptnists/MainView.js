var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var ReceptnistsView = require('./ReceptnistsView');
var FormView = require('./FormView');

module.exports = Backbone.Marionette.LayoutView.extend({
    template: '#receptnists_main_view',
    regions: {
        receptnistsMain: '#receptnists_main'
    },
    collectionEvents: {
        'add change': 'showIndex'
    },
    childEvents: {
        'click:new': 'showNew',
        'click:edit': 'showEdit'
    },
    onRender: function() {
        var receptnistsView = new ReceptnistsView({collection: this.collection, model: this.model});
        this.getRegion('receptnistsMain').show(receptnistsView);
    },
    showNew: function() {
        var formView = new FormView({collection: this.collection, category: this.model});
        this.getRegion('receptnistsMain').show(formView);
    },
    showEdit: function(view) {
        var formView = new FormView({collection: this.collection, model: view.model});
        this.getRegion('receptnistsMain').show(formView);
    },
    showIndex: function() {
        var receptnistsView = new ReceptnistsView({collection: this.collection, model: this.model});
        this.getRegion('receptnistsMain').show(receptnistsView);
    }
});

