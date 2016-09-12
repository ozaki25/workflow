var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

var Page = Backbone.Model.extend({
    defaults: {
        pageNumber: 0,
        totalPage: 0,
    },
    isFirst: function() {
        return this.get('pageNumber') <= 1;
    },
    isLast: function() {
        return this.get('pageNumber') >= this.get('totalPage');
    },
});

var PageNumberView = Backbone.Marionette.ItemView.extend({
    tagName: 'span',
    template: _.template('&nbsp;<%- pageNumber %>&nbsp;/&nbsp;<%- totalPage %>&nbsp;'),
});

var pagingView = Backbone.Marionette.LayoutView.extend({
    tagName: 'nav',
    template: _.template(
        '<ul class="pager">' +
          '<li>' +
            '<a class="prev-btn" href="#"><%= prevLabel %></a>' +
          '</li>' +
          '<span id="page_number_region"></span>' +
          '<li>' +
            '<a class="next-btn" href="#"><%= nextLabel %></a>' +
          '</li>' +
        '</ul>'
    ),
    templateHelpers: function() {
        return {
            prevLabel: this.prevLabel,
            nextLabel: this.nextLabel,
        }
    },
    regions: {
        pageNumberRegion: '#page_number_region',
    },
    ui: {
        prevBtn: '.prev-btn',
        nextBtn: '.next-btn',
    },
    events: {
        'click @ui.prevBtn': 'onClickPrevBtn',
        'click @ui.nextBtn': 'onClickNextBtn',
    },
    modelEvents: {
        'change': 'render',
    },
    initialize: function(options) {
        this.model = new Page();
        this.model.set('pageNumber', options.page || 1);
        this.delegateEvents();
        this.prevLabel = this.options.prevLabel || '&larr; 前のページ';
        this.nextLabel = this.options.nextLabel || '次のページ &rarr;';
        this.showPageNumber = options.showPageNumber || true;
    },
    onRender: function() {
        if(this.showPageNumber) this.getRegion('pageNumberRegion').show(new PageNumberView({ model: this.model }));
    },
    onDomRefresh: function() {
        this.bothEndsCheck();
    },
    onClickPrevBtn: function(e) {
        e.preventDefault();
        if(!this.model.isFirst()) {
            this.model.set({ pageNumber: this.model.get('pageNumber') - 1 });
            this.triggerMethod('click:changePage');
        }
    },
    onClickNextBtn: function(e) {
        e.preventDefault();
        if(!this.model.isLast()) {
            this.model.set({ pageNumber: this.model.get('pageNumber') + 1 });
            this.triggerMethod('click:changePage');
        }
    },
    bothEndsCheck: function() {
        this.model.isFirst() ?
            this.ui.prevBtn.parent('li').addClass('disabled') :
            this.ui.prevBtn.parent('li').removeClass('disabled');
        this.model.isLast() ?
            this.ui.nextBtn.parent('li').addClass('disabled') :
            this.ui.nextBtn.parent('li').removeClass('disabled');
    },
});

module.exports = pagingView;
