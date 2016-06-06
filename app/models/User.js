var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    defaults: {
        team: 'None',
        jobLeel: 3,
        admin: false
    },
    validation: {
        name: {
            required: true
        },
        uid: {
            required: true
        },
        jobLevel: {
            required: true,
            range: [0, 4]
        },
        admin: {
            required: true
        }
    }
});
