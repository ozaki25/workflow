var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var Division = require('../../models/Division');
var DivisionsView = require('./DivisionsView');
var FormView = require('./FormView');

module.exports = Backbone.Marionette.LayoutView.extend({
    template: '#divisions_main_view',
    regions: {
        divisionsMainRegion: '#divisions_main_region'
    },
    collectionEvents: {
        'sync': 'renderIndex',
    },
    childEvents: {
        'click:new' : 'onClickNew',
        'click:edit': 'onClickEdit',
    },
    onRender: function() {
        this.renderIndex();
    },
    renderIndex: function() {
        var divisionsView = new DivisionsView({ collection: this.collection, model: this.model });
        this.getRegion('divisionsMainRegion').show(divisionsView);
    },
    renderForm: function(model) {
        var formView = new FormView({ collection: this.collection, model: model });
        this.getRegion('divisionsMainRegion').show(formView);
    },
    onClickNew: function() {
        this.renderForm(new Division({ category: this.model }))
    },
    onClickEdit: function(view) {
        this.renderForm(view.model);
    },
});

