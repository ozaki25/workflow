var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var CategoriesView = require('./CategoriesView');
var FormView = require('./FormView');

module.exports = Backbone.Marionette.LayoutView.extend({
    template: '#categories_main_view',
    regions: {
        categoriesMain: '#categories_main'
    },
    collectionEvents: {
        'add change': 'showIndex'
    },
    childEvents: {
        'click:new': 'showNew',
        'click:edit': 'showEdit',
        'click:divisions': 'showDivisions'
    },
    onRender: function() {
        var categoriesView = new CategoriesView({collection: this.collection});
        this.getRegion('categoriesMain').show(categoriesView);
    },
    showNew: function() {
        var formView = new FormView({collection: this.collection});
        this.getRegion('categoriesMain').show(formView);
    },
    showEdit: function(view) {
        var formView = new FormView({collection: this.collection, model: view.model});
        this.getRegion('categoriesMain').show(formView);
    },
    showIndex: function() {
        var categoriesView = new CategoriesView({collection: this.collection});
        this.getRegion('categoriesMain').show(categoriesView);
    },
    showDivisions: function(view) {
        Backbone.history.navigate('#/categories/' + view.model.id + '/divisions', {trigger: true});
    },
});

