var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    validation: {
        code: {
            required: true
        },
        name: {
            required: true
        }
    }
});
