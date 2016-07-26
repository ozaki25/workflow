var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.ItemView.extend({
    template: '#work_form_view',
    initialize: function(options) {
        this.canWork = options.canWork;
    },
    templateHelpers: function() {
        return {
            inputContent: this.canWork ?
                '<textarea type="text" class="content form-control" name="content">' + this.model.get('content') + '</textarea>' :
                '<p class="form-control-static">' + this.replaceLine(this.model.get('content')) + '</p>'
        }
    },
    replaceLine: function(text) {
        return text.replace(/\r\n/g, '<br />').replace(/(\n|\r)/g, '<br />');
    }
});
