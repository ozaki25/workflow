var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var DownloadFileView = require('./DownloadFileView');

module.exports = Backbone.Marionette.CompositeView.extend({
    childView: DownloadFileView,
    childViewContainer: '#download_files_child_container',
    childViewOptions: function() {
        return {
            canRequest: this.canRequest
        }
    },
    template: '#download_files_view',
    templateContext: function() {
        return {
            inputFile: this.canRequest ? '<input type="file" class="form-control file" />' : '',
        }
    },
    initialize: function(options) {
        this.canRequest = options.canRequest;
    },
});
