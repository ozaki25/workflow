var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    defaults: {
        team: 'None',
        jobLebel: 3,
        admin: false
    },
    validation: {
        name: {
            required: true
        },
        uid: {
            required: true
        },
        jobLebel: {
            required: true,
            range: [0, 4]
        },
        admin: {
            required: true
        }
    }
});
