var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var Category = require('../../models/Category');
var CategoryView = require('./CategoryView');

module.exports = Backbone.Marionette.CompositeView.extend({
    className: 'panel panel-default',
    childView: CategoryView,
    childViewContainer: '#category_list',
    template: '#categories_view',
    ui: {
        newCategoryBtn: '.new-category'
    },
    events: {
        'click @ui.newCategoryBtn': 'onClickNewBtn'
    },
    onClickNewBtn: function(e) {
        e.preventDefault();
        this.triggerMethod('click:new');
    }
});

