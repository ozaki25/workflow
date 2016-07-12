var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var DivisionsView = require('./DivisionsView');
var FormView = require('./FormView');

module.exports = Backbone.Marionette.LayoutView.extend({
    template: '#divisions_main_view',
    regions: {
        divisionsMain: '#divisions_main'
    },
    collectionEvents: {
        'add change': 'showIndex'
    },
    childEvents: {
        'click:new': 'showNew',
        'click:edit': 'showEdit'
    },
    onRender: function() {
        var divisionsView = new DivisionsView({collection: this.collection, model: this.model});
        this.getRegion('divisionsMain').show(divisionsView);
    },
    showNew: function() {
        var formView = new FormView({collection: this.collection, category: this.model});
        this.getRegion('divisionsMain').show(formView);
    },
    showEdit: function(view) {
        var formView = new FormView({collection: this.collection, model: view.model});
        this.getRegion('divisionsMain').show(formView);
    },
    showIndex: function() {
        var divisionsView = new DivisionsView({collection: this.collection, model: this.model});
        this.getRegion('divisionsMain').show(divisionsView);
    }
});

