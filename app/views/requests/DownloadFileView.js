var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.ItemView.extend({
    ui: {
        removeFile: '.remove-file'
    },
    events: {
        'click @ui.removeFile': 'onClickRemoveFile'
    },
    template: '#download_file_view',
    templateHelpers: function() {
        return {
            url: this.model.url(),
            removeLink: this.canRequest ? '<a href="#" class="btn btn-link btn-xs remove-file">&times;</a>' : ''
        }
    },
    initialize: function(options) {
        this.canRequest = options.canRequest;
    },
    onClickRemoveFile: function(e) {
        e.preventDefault();
        Backbone.$(e.target).closest('p').after('<input type="hidden" class="remove-file" value="' + this.model.id + '">');
    }
});
