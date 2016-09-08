var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

var InputView = Backbone.Marionette.ItemView.extend({
    tagName: 'input',
    attributes: function() {
        return Backbone.$.extend(this.options.attrs, {
            id: this.options._id,
            class: this.options._className || 'form-control',
            value: this.options._value,
        });
    },
    template: _.template(''),
    initialize: function(options) {
        this.changeEventName = options.changeEventName || 'change:input';
        this.keypressEventName = options.keypressEventName || 'keypress:input';
    },
    events: {
        'change': 'onChange',
        'keypress': 'onKeyPress',
    },
    onChange: function() {
        this.triggerMethod(this.changeEventName, this.$el.val());
    },
    onKeyPress: function() {
        this.triggerMethod(this.keypressEventName, this.$el.val());
    },
});

module.exports = InputView;
