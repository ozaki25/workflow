var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var RequestView = require('./RequestView');

module.exports = Backbone.Marionette.CompositeView.extend({
    className: 'panel panel-default',
    childView: RequestView,
    childViewContainer: '#request_list',
    template: '#requests_view',
    ui: {
        newRequestBtn: '.new-request'
    },
    events: {
        'click @ui.newRequestBtn': 'onClickNewBtn'
    },
    onClickNewBtn: function(e) {
        e.preventDefault();
        this.triggerMethod('click:new');
    }
});
