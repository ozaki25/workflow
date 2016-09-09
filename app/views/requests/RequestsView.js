var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var RequestView = require('./RequestView');

module.exports = Backbone.Marionette.CompositeView.extend({
    className: 'panel panel-default',
    childView: RequestView,
    childViewContainer: '#request_list',
    template: '#requests_view',
    ui: {
        prevLi: '.prev-li',
        nextLi: '.next-li',
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
        this.getRequests();
    },
    onRender: function() {
        this.disabledCheck();
    },
    onClickPrevBtn: function(e) {
        e.preventDefault();
        if(this.model.get('pageNumber') > 0) {
            this.model.set({ pageNumber: this.model.get('pageNumber') - 1 });
            this.getRequests();
        }
    },
    onClickNextBtn: function(e) {
        e.preventDefault();
        if(this.model.get('pageNumber') + 1 < this.model.get('totalPage')) {
            this.model.set({ pageNumber: this.model.get('pageNumber') + 1 });
            this.getRequests();
        }
    },
    getRequests: function() {
        this.collection.fetch({ data: { page: this.model.get('pageNumber') } });
        Backbone.$.get('/requests/total-page', function(totalPage) {
            this.model.set({ totalPage: totalPage });
        }.bind(this));
    },
    disabledCheck: function() {
        this.model.get('pageNumber') > 0 ?
            this.ui.prevLi.removeClass('disabled') :
            this.ui.prevLi.addClass('disabled');
        this.model.get('pageNumber') + 1 < this.model.get('totalPage') ?
            this.ui.nextLi.removeClass('disabled') :
            this.ui.nextLi.addClass('disabled');
    },
});
