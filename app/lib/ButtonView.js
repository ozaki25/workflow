var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

var ButtonView = Backbone.Marionette.View.extend({
    tagName: 'button',
    attributes: function() {
        return Backbone.$.extend(this.options.attrs, {
            id: this.options._id,
            class: this.options._className || 'btn btn-default',
        });
    },
    template: _.template('<%= label %>'),
    templateContext: function() {
        return {
            label: this.label
        }
    },
    initialize: function(options) {
        this.label = options.label;
        this.clickEventName = options.clickEventName || 'click:button';
    },
    events: {
        'click': 'onClick'
    },
    onClick: function(e) {
        e.preventDefault();
        this.triggerMethod(this.clickEventName, this);
    }
});

module.exports = ButtonView;
