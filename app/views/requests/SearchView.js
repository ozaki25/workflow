var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var SelectboxView = require('../../lib/SelectboxView')
var InputView = require('../../lib/InputView')

module.exports = Backbone.Marionette.View.extend({
    className: 'panel-body',
    template: '#request_search_view',
    ui: {
        submitBtn: '.search-submit-btn',
    },
    regions: {
        yearRegion    : '#search_year_region',
        statusRegion  : '#search_status_region',
        categoryRegion: '#search_category_region',
        titleRegion   : '#search_title_region',
        nameRegion    : '#search_name_region',
        teamRegion    : '#search_team_region',
    },
    events: {
        'click @ui.submitBtn': 'onClickSubmitBtn',
    },
    initialize: function(options) {
        this.query          = options.query;
        this.statusList     = options.statusList;
        this.categories     = options.categories;
        this.teams          = options.teams;
        this.requestNumbers = options.requestNumbers;
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
        var selected = this.requestNumbers.findWhere({ year: parseInt(this.query.year) });
        var selectboxView = new SelectboxView({
            collection: this.requestNumbers,
            label : 'year',
            value : 'year',
            _className: 'form-control search-req-id',
            blank : true,
            blankLabel: '指定なし',
            selected : selected,
        })
        this.getRegion('yearRegion').show(selectboxView);
    },
    renderStatus: function() {
        var selected = this.statusList.findWhere({ id: parseInt(this.query.statusId) });
        var selectboxView = new SelectboxView({
            collection: this.statusList,
            label : 'name',
            value : 'id',
            _className: 'form-control search-status',
            blank : true,
            blankLabel: '指定なし',
            selected : selected,
        })
        this.getRegion('statusRegion').show(selectboxView);
    },
    renderCategory: function() {
        var selected = this.categories.findWhere({ id: parseInt(this.query.categoryId) });
        var selectboxView = new SelectboxView({
            collection: this.categories,
            label : 'name',
            value : 'id',
            _className: 'form-control search-category',
            blank : true,
            blankLabel: '指定なし',
            selected : selected,
        })
        this.getRegion('categoryRegion').show(selectboxView);
    },
    renderTitle: function() {
        var inputView = new InputView({
            _className: 'form-control input-title',
            _value : this.query.title,
        })
        this.getRegion('titleRegion').show(inputView);
    },
    renderName: function() {
        var inputView = new InputView({
            _className: 'form-control input-name',
            _value : this.query.name,
        })
        this.getRegion('nameRegion').show(inputView);
    },
    renderTeam: function() {
        var selected = this.teams.findWhere({ name: this.query.team });
        var selectboxView = new SelectboxView({
            collection: this.teams,
            label : 'name',
            value : 'name',
            _className: 'form-control search-team',
            blank : true,
            blankLabel: '指定なし',
            selected: selected,
        })
        this.getRegion('teamRegion').show(selectboxView);
    },
    onClickSubmitBtn: function(e) {
        e.preventDefault();
        var query = {
            year      : this.$('.search-req-id').val(),
            statusId  : this.$('.search-status').val(),
            categoryId: this.$('.search-category').val(),
            title     : this.$('.input-title').val().trim(),
            team      : this.$('.input-name').val().trim(),
            name      : this.$('.search-team').val(),
        };
        this.triggerMethod('submit:search', query);
    }
});

