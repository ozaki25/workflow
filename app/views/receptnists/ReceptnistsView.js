var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var ReceptnistView = require('./ReceptnistView');

module.exports = Backbone.Marionette.CompositeView.extend({
    className: 'panel panel-default',
    childView: ReceptnistView,
    childViewContainer: '#receptnists_child_container',
    childViewOptions: function() {
        return {
            categoryName: this.model.get('name')
        }
    },
    template: '#receptnists_view'
});
