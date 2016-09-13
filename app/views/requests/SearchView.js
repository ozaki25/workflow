var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var SelectboxView = require('../../lib/SelectboxView')

module.exports = Backbone.Marionette.LayoutView.extend({
    className: 'panel-body',
    template: '#request_search_view',
    ui: {
        submitBtn: '.search-submit-btn',
    },
    regions: {
        statusRegion: '#search_status_region',
        categoryRegion: '#search_category_region',
    },
    events: {
        'click @ui.submitBtn': 'onClickSubmitBtn',
    },
    initialize: function(options) {
        this.statusList = options.statusList;
        this.categoryList = options.categoryList;
    },
    onRender: function() {
        this.renderStatus();
        this.renderCategory();
    },
    renderStatus: function() {
        var selectboxView = new SelectboxView({
            collection: this.statusList,
            label: 'name',
            value: 'id',
            _className: 'form-control search-status',
        })
        this.getRegion('statusRegion').show(selectboxView);
    },
    renderCategory: function() {
        var selectboxView = new SelectboxView({
            collection: this.categoryList,
            label: 'name',
            value: 'id',
            _className: 'form-control search-category',
        })
        this.getRegion('categoryRegion').show(selectboxView);
    },
    onClickSubmitBtn: function(e) {
        e.preventDefault();
        var statusId = this.$('.search-status').val();
        var categoryId = this.$('.search-category').val();
        var query = { statusId: statusId, categoryId: categoryId };
        this.triggerMethod('submit:search', query);
    }
});

