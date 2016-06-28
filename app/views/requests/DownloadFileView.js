var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.ItemView.extend({
    tagName: 'dd',
    template: '#download_file_view',
    templateHelpers: function() {
        return {
            url: this.model.url()
        }
    }
});
