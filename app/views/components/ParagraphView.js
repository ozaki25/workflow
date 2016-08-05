var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.ItemView.extend({
    tagName: 'p',
    attributes: function() {
        return {
            id: this.model.get('elementId'),
            class: this.model.get('className'),
        }
    },
    template: '#paragraph_view',
    initialize: function() {
        if(!this.model.has('elementId')) this.model.set('elementId', '');
        if(!this.model.has('className')) this.model.set('className', '');
        if(!this.model.has('value')) this.model.set('value', '');
    }
});
