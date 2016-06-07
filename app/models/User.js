var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    defaults: {
        team: 'None',
        jobLevel: 3,
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
    },
    isRequestUser: function(request) {
        return this.id === request.get('user').id;
    },
    isApproveUser: function() {
        return this.get('jobLevel') < 3;
    },
});
