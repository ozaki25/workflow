var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

var PageNumberView = Backbone.Marionette.ItemView.extend({
    tagName: 'span',
    template: _.template('&nbsp;<%- pageNumber %>&nbsp;/&nbsp;<%- totalPage %>&nbsp;'),
});

var pagingView = Backbone.Marionette.LayoutView.extend({
    tagName: 'nav',
    template: _.template(
        '<ul class="pager">' +
          '<li>' +
            '<a class="prev-btn" href="#">&larr; 前のページ</a>' +
          '</li>' +
          '<span id="page_number_region"></span>' +
          '<li>' +
            '<a class="next-btn" href="#">次のページ &rarr;</a>' +
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
        'sync': 'render',
    },
    onRender: function() {
        this.getRegion('pageNumberRegion').show(new PageNumberView({ model: this.model }));
    },
    onDomRefresh: function() {
        this.bothEndsCheck();
    },
    onClickPrevBtn: function(e) {
        e.preventDefault();
        if(this.model.get('hasPrev')) {
            this.model.set({ pageNumber: this.model.get('pageNumber') - 1 });
            this.triggerMethod('click:changePage');
        }
    },
    onClickNextBtn: function(e) {
        e.preventDefault();
        if(this.model.get('hasNext')) {
            this.model.set({ pageNumber: this.model.get('pageNumber') + 1 });
            this.triggerMethod('click:changePage');
        }
    },
    bothEndsCheck: function() {
        console.log(this.model);
        if(!this.model.get('hasPrev')) this.ui.prevBtn.parent('li').addClass('disabled');
        if(!this.model.get('hasNext')) this.ui.nextBtn.parent('li').addClass('disabled');
    },
});

module.exports = pagingView;
