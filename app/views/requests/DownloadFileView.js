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
            url: this.model.url()
        }
    },
    onClickRemoveFile: function(e) {
        e.preventDefault();
        $(e.target).closest('p').after('<input type="hidden" class="remove-file" value="' + this.model.id + '">');
    }
});
