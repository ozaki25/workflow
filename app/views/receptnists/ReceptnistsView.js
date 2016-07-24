var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var csrf = require('../../csrf');
csrf();
var ReceptnistView = require('./ReceptnistView');

module.exports = Backbone.Marionette.CompositeView.extend({
    className: 'panel panel-default',
    childView: ReceptnistView,
    childViewContainer: '#receptnist_list',
    childViewOptions: function() {
        return {
            categoryName: this.model.get('name')
        }
    },
    template: '#receptnists_view'
});
