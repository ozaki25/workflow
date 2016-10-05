var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var Category = require('../../models/Category');
var CategoriesView = require('./CategoriesView');
var FormView = require('./FormView');

module.exports = Backbone.Marionette.View.extend({
    template: '#categories_main_view',
    regions: {
        categoriesMainRegion: '#categories_main_region'
    },
    collectionEvents: {
        'sync': 'renderIndex',
    },
    childViewEvents: {
        'click:new'        : 'onClickNew',
        'click:edit'       : 'onClickEdit',
        'click:divisions'  : 'onClickDivisions',
        'click:receptnists': 'onClickReceptnists',
    },
    onRender: function() {
        this.renderIndex();
    },
    renderIndex: function() {
        var categoriesView = new CategoriesView({ collection: this.collection });
        this.getRegion('categoriesMainRegion').show(categoriesView);
    },
    renderForm: function(model) {
        var formView = new FormView({ collection: this.collection, model: model });
        this.getRegion('categoriesMainRegion').show(formView);
    },
    onClickNew: function() {
        this.renderForm(new Category());
    },
    onClickEdit: function(view) {
        this.renderForm(view.model);
    },
    onClickDivisions: function(view) {
        Backbone.history.navigate('#/categories/' + view.model.id + '/divisions', {trigger: true});
    },
    onClickReceptnists: function(view) {
        Backbone.history.navigate('#/categories/' + view.model.id + '/receptnists', {trigger: true});
    },
});

