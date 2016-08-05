var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.LayoutView.extend({
    className: 'form-group',
    template: '#form_horizontal_item_view',
    regions: {
        contentRegion: '#form_horizontal_content_region'
    },
    initialize: function(options) {
        this.detailView = options.detailView;
    },
    onRender: function() {
        this.getRegion('contentRegion').show(this.detailView);
    }
});
