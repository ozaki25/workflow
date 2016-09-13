var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var PageNumberView = require('./PageNumberView');

module.exports = Backbone.Marionette.LayoutView.extend({
    tagName: 'nav',
    template: '#request_paging_view',
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
        if(!this.model.get('hasPrev')) this.ui.prevBtn.parent('li').addClass('disabled');
        if(!this.model.get('hasNext')) this.ui.nextBtn.parent('li').addClass('disabled');
    },
});

