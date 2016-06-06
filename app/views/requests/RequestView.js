var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.ItemView.extend({
    tagName: 'tr',
    template: '#request_view',
    events: {
        'click .delete-request': 'onClickDelete'
    },
    onClickDelete: function(e) {
        e.preventDefault();
        this.model.destroy({wait: true});
    }
});
