var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.csrf = require('../../csrf');
Backbone.csrf();
var Divisions = require('../../collections/Divisions');
var DivisionColView = require('./DivisionColView');

module.exports = Backbone.Marionette.CompositeView.extend({
    tagName: 'tr',
    template: '#category_view',
    childView: DivisionColView,
    childViewContainer: '#division_col_list',
    ui: {
        toDivisionsBtn: '.to-divisions',
        toReceptnistsBtn: '.to-receptnists',
        editBtn: '.edit',
        deleteBtn: '.delete'
    },
    events: {
        'click @ui.toDivisionsBtn': 'onClickToDivisionsBtn',
        'click @ui.toReceptnistsBtn': 'onClickToReceptnistsBtn',
        'click @ui.editBtn': 'onClickEditBtn',
        'click @ui.deleteBtn': 'onClickDeleteBtn'
    },
    initialize: function() {
        this.collection = new Divisions();
        this.collection.setUrl(this.model.id);
        this.collection.fetch();
    },
    onClickToDivisionsBtn: function(e) {
        e.preventDefault();
        this.triggerMethod('click:divisions');
    },
    onClickToReceptnistsBtn: function(e) {
        e.preventDefault();
        this.triggerMethod('click:receptnists');
    },
    onClickEditBtn: function(e) {
        e.preventDefault();
        this.triggerMethod('click:edit');
    },
    onClickDeleteBtn: function(e) {
        e.preventDefault();
        this.model.destroy({wait: true});
    }
});
