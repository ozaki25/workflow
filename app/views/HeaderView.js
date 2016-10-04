var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.ItemView.extend({
    template: '#header_view',
    templateHelpers: function() {
        return {
            username: this.model ? this.model.get('name') + '(' + this.model.get('uid') + ')' : '',
        }
    }
});
