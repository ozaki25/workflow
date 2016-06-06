var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.ItemView.extend({
    tagName: 'tr',
    template: '#request_view',
    events: {
        'click .show-request': 'onClickShow',
        'click .edit-request': 'onClickEdit',
        'click .delete-request': 'onClickDelete'
    },
    onClickShow: function(e) {
        e.preventDefault();
        Backbone.history.navigate('/requests/' + this.model.id, {trigger: true});
    },
    onClickEdit: function(e) {
        e.preventDefault();
        Backbone.history.navigate('/requests/' + this.model.id + '/edit', {trigger: true});
    },
    onClickDelete: function(e) {
        e.preventDefault();
        this.model.destroy({wait: true});
    }
});
