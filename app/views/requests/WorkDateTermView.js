var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var InputView = require('../../lib/InputView');

module.exports = Backbone.Marionette.LayoutView.extend({
    className: 'input-group',
    attributes: function() {
        return {
            name: 'workDate'
        }
    },
    template: '#work_date_term_view',
    regions: {
        fromDateRegion: '#from_date_region',
        toDateRegion: '#to_date_region',
    },
    onBeforeShow: function() {
        this.renderFromDate();
        this.renderToDate();
    },
    renderFromDate: function() {
        var inputView = new InputView({
            _className: 'form-control from-date',
            attrs: { name: 'workDateFrom' },
        });
        this.getRegion('fromDateRegion').show(inputView);
    },
    renderToDate: function() {
        var inputView = new InputView({
            _className: 'form-control to-date',
            attrs: { name: 'workDateTo' },
        });
        this.getRegion('toDateRegion').show(inputView);
    },
});
