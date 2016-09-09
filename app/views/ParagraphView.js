var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

var ParagraphView = Backbone.Marionette.ItemView.extend({
    tagName: 'p',
    attributes: function() {
        return Backbone.$.extend(this.options.attrs, {
            id: this.options._id,
            class: this.options._className,
        });
    },
    template: _.template('<%= text %>'),
    templateHelpers: function() {
        return {
            text: this._text,
        }
    },
    initialize: function(options) {
        this._text = options._text;
    },
});

module.exports = ParagraphView;
