var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var DownloadFileView = require('./DownloadFileView');

module.exports = Backbone.Marionette.CollectionView.extend({
    childView: DownloadFileView,
    childViewOptions: function() {
        return {
            canRequest: this.canRequest
        }
    },
    initialize: function(options) {
        this.canRequest = options.canRequest;
    }
});
