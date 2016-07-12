var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var DivisionView = require('./DivisionView');

module.exports = Backbone.Marionette.CompositeView.extend({
    className: 'panel panel-default',
    childView: DivisionView,
    childViewContainer: '#division_list',
    childViewOptions: function() {
        return {
            categoryName: this.model.get('name')
        }
    },
    template: '#divisions_view',
    ui: {
        newDivisionBtn: '.new-division'
    },
    events: {
        'click @ui.newDivisionBtn': 'onClickNewBtn'
    },
    onClickNewBtn: function(e) {
        e.preventDefault();
        this.triggerMethod('click:new');
    }

});
