var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.ItemView.extend({
    tagName: 'tr',
    template: '#request_view',
    events: {
        'click .open-request': 'onClickOpen'
    },
    initialize: function(options) {
        this.backUrlQuery = options.backUrlQuery || '';
    },
    onClickOpen: function(e) {
        e.preventDefault();
    }
});
