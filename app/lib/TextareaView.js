var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

var TextareaView = Backbone.Marionette.View.extend({
    tagName: 'textarea',
    attributes: function() {
        return Backbone.$.extend(this.options.attrs, {
            id: this.options._id,
            class: this.options._className || 'form-control',
        });
    },
    template: _.template('<%= value %>'),
    templateContext: function() {
        return {
            value: this.value,
        }
    },
    initialize: function(options) {
        this.value = this.options._value;
        this.changeEventName = options.changeEventName || 'change:textarea';
        this.keypressEventName = options.keypressEventName || 'keypress:textarea';
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

module.exports = TextareaView;
