var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.ItemView.extend({
    tagName: 'tr',
    template: '#request_view',
    events: {
        'click .open-request': 'onClickOpen'
    },
    onClickOpen: function(e) {
        e.preventDefault();
        Backbone.history.navigate('/requests/' + this.model.id, {trigger: true});
    }
});
