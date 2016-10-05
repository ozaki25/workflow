var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.View.extend({
    className: function() {
        var classNames = (this.options._className || '') + ' alert alert-dismissible ';
        switch(this.options.alertType) {
            case 'success':
                classNames += 'alert-success';
                break;
            case 'info':
                classNames += 'alert-info';
                break;
            case 'warning':
                classNames += 'alert-warning';
                break;
            case 'danger':
                classNames += 'alert-danger';
                break;
            default:
                classNames += 'alert-success';
                break;
        }
        return classNames;
    },
    attributes: function() {
        return Backbone.$.extend(this.options.attrs, {
            id: this.options._id,
        });
    },
    template: _.template(
        '<button type="button" class="close" data-dismiss="alert">' +
          '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '<%= message %>'
    ),
    templateContext: function() {
        return {
            message: typeof this.message === 'string' ? this.message : '<div id="message_region"></div>',
        }
    },
    initialize: function(options) {
        this.message = options.message || '';
    },
    onBeforeShow: function() {
        if(typeof this.message === 'object') {
            this.addRegion('messageRegion', '#message_region');
            this.getRegion('messageRegion').show(this.message);
        }
    },
});
