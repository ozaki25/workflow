require('bootstrap-datepicker');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var InputView = require('../../lib/InputView');

module.exports = Backbone.Marionette.View.extend({
    className: 'input-group',
    attributes: function() {
        return {
            name: 'workDate'
        }
    },
    template: '#work_date_term_view',
    regions: {
        fromDateRegion: '#from_date_region',
        toDateRegion  : '#to_date_region',
    },
    onBeforeShow: function() {
        this.renderFromDate();
        this.renderToDate();
        this.setupDatepicker();
    },
    renderFromDate: function() {
        var inputView = new InputView({ _className: 'form-control from-date' });
        this.getRegion('fromDateRegion').show(inputView);
    },
    renderToDate: function() {
        var inputView = new InputView({ _className: 'form-control to-date' });
        this.getRegion('toDateRegion').show(inputView);
    },
    setupDatepicker: function() {
        this.$('.from-date, .to-date').datepicker({
            format: "yyyy/mm/dd",
            autoclose: true,
            todayHighlight: true
        });
    }
});
