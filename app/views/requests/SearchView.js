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
        yearRegion: '#search_year_region',
        statusRegion: '#search_status_region',
        categoryRegion: '#search_category_region',
        titleRegion: '#search_title_region',
        nameRegion: '#search_name_region',
        teamRegion: '#search_team_region',
    },
    events: {
        'click @ui.submitBtn': 'onClickSubmitBtn',
    },
    initialize: function(options) {
        this.statusList = options.statusList;
        this.categoryList = options.categoryList;
        this.teamList = options.teamList;
        this.requestNumberList = options.requestNumberList;
    },
    onRender: function() {
        this.renderYear();
        this.renderStatus();
        this.renderCategory();
        this.renderTitle();
        this.renderName();
        this.renderTeam();
    },
    renderYear: function() {
        var selectboxView = new SelectboxView({
            collection: this.requestNumberList,
            label: 'year',
            value: 'year',
            _className: 'form-control search-req-id',
            blank: true,
            blankLabel: '指定なし',
        })
        this.getRegion('yearRegion').show(selectboxView);
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
    renderName: function() {
        var inputView = new InputView({ _className: 'form-control input-name' })
        this.getRegion('nameRegion').show(inputView);
    },
    renderTeam: function() {
        var selectboxView = new SelectboxView({
            collection: this.teamList,
            label: 'name',
            value: 'name',
            _className: 'form-control search-team',
            blank: true,
            blankLabel: '指定なし',
        })
        this.getRegion('teamRegion').show(selectboxView);
    },
    onClickSubmitBtn: function(e) {
        e.preventDefault();
        var year = this.$('.search-req-id').val();
        var statusId = this.$('.search-status').val();
        var categoryId = this.$('.search-category').val();
        var title = this.$('.input-title').val();
        var name = this.$('.input-name').val();
        var team = this.$('.search-team').val();
        var query = { year: year, statusId: statusId, categoryId: categoryId, title: title, team: team, name: name };
        this.triggerMethod('submit:search', query);
    }
});

