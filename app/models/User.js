var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
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
        return this.get('uid') === request.get('applicant').uid;
    },
    isApproveUser: function() {
        return this.get('jobLevel') < 3;
    }
});
