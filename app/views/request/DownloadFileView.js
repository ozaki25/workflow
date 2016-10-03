var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.ItemView.extend({
    ui: {
        fileRemoveLink: '.file-remove-link'
    },
    events: {
        'click @ui.fileRemoveLink': 'onClickFileRemoveLink'
    },
    template: '#download_file_view',
    templateHelpers: function() {
        return {
            url: this.model.url(),
            removeLink: this.canRequest ? '<a href="#" class="btn btn-link btn-xs file-remove-link">&times;</a>' : ''
        }
    },
    initialize: function(options) {
        this.canRequest = options.canRequest;
    },
    onClickFileRemoveLink: function(e) {
        e.preventDefault();
        this.model.collection.remove(this.model);
    }
});
