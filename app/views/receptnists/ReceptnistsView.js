var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
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
    template: '#receptnists_view',
    ui: {
        newReceptnistBtn: '.new-receptnist'
    },
    events: {
        'click @ui.newReceptnistBtn': 'onClickNewBtn'
    },
    onClickNewBtn: function(e) {
        e.preventDefault();
        this.triggerMethod('click:new');
    }

});
