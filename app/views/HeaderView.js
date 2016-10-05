var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.View.extend({
    template: '#header_view',
    templateContext: function() {
        return {
            username: this.model ? this.model.get('name') + '(' + this.model.get('uid') + ')' : '',
        }
    }
});
