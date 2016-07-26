var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    defaults: {
        content: ''
    },
    validation: {
        content: {
            required: true
        }
    }
});
