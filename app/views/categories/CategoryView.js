var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var Divisions = require('../../collections/Divisions');
var DivisionColView = require('./DivisionColView');

module.exports = Backbone.Marionette.CompositeView.extend({
    tagName: 'tr',
    template: '#category_view',
    childView: DivisionColView,
    childViewContainer: '#divisions_child_container',
    ui: {
        toDivisionsBtn  : '.to-divisions',
        toReceptnistsBtn: '.to-receptnists',
        editBtn         : '.edit',
        deleteBtn       : '.delete',
    },
    events: {
        'click @ui.toDivisionsBtn'  : 'onClickToDivisionsBtn',
        'click @ui.toReceptnistsBtn': 'onClickToReceptnistsBtn',
        'click @ui.editBtn'         : 'onClickEditBtn',
        'click @ui.deleteBtn'       : 'onClickDeleteBtn'
    },
    initialize: function() {
        this.collection = new Divisions();
        this.collection.setUrl(this.model.id);
        this.collection.fetch();
    },
    onClickToDivisionsBtn: function(e) {
        e.preventDefault();
        this.triggerMethod('click:divisions', this);
    },
    onClickToReceptnistsBtn: function(e) {
        e.preventDefault();
        this.triggerMethod('click:receptnists', this);
    },
    onClickEditBtn: function(e) {
        e.preventDefault();
        this.triggerMethod('click:edit', this);
    },
    onClickDeleteBtn: function(e) {
        e.preventDefault();
        this.model.destroy({ wait: true });
    }
});
