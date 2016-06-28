var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var DownloadFileView = require('./DownloadFileView');

module.exports = Backbone.Marionette.CollectionView.extend({
    tagName: 'span',
    childView: DownloadFileView,
    childViewContainer: '#file_download_list'
});