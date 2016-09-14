var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var SelectboxView = require('../../lib/SelectboxView')
var InputView = require('../../lib/InputView')

module.exports = Backbone.Marionette.LayoutView.extend({
    className: 'panel-body',
    template: '#request_search_view',
    ui: {
        submitBtn: '.search-submit-btn',
    },
    regions: {
        statusRegion: '#search_status_region',
        categoryRegion: '#search_category_region',
        titleRegion: '#search_title_region',
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
        this.renderTitle();
    },
    renderStatus: function() {
        var selectboxView = new SelectboxView({
            collection: this.statusList,
            label: 'name',
            value: 'id',
            _className: 'form-control search-status',
            blank: true,
            blankLabel: '指定なし',
        })
        this.getRegion('statusRegion').show(selectboxView);
    },
    renderCategory: function() {
        var selectboxView = new SelectboxView({
            collection: this.categoryList,
            label: 'name',
            value: 'id',
            _className: 'form-control search-category',
            blank: true,
            blankLabel: '指定なし',
        })
        this.getRegion('categoryRegion').show(selectboxView);
    },
    renderTitle: function() {
        var inputView = new InputView({ _className: 'form-control input-title' })
        this.getRegion('titleRegion').show(inputView);
    },
    onClickSubmitBtn: function(e) {
        e.preventDefault();
        var statusId = this.$('.search-status').val();
        var categoryId = this.$('.search-category').val();
        var title = this.$('.input-title').val();
        var query = { statusId: statusId, categoryId: categoryId, title: title };
        this.triggerMethod('submit:search', query);
    }
});

