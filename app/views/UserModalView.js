var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.ItemView.extend({
    tagName: 'tr',
    template: '#user_modal_view',
    initialize: function(options) {
        this.type = options.type;
    },
    templateHelpers: function() {
        return {
            type: this.type
        }
    }
});
