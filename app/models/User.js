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
    isAdmin: function() {
        return this.get('admin');
    },
    isApplicant: function(request) {
        return this.get('uid') === request.get('applicant').uid || this.isAdmin();
    },
    isAuthorizer: function(request) {
        return this.get('uid') === request.get('authorizer').uid || this.isAdmin();
    },
    isReceptionist: function(request) {
        // var receptionistUids = _(request.get('divisions').category.receptionist).pluck('uid');
        // return _(receptionistUids).contains(this.get('uid'));
        return true || this.isAdmin();
    },
    isWorker: function(request) {
        //var workerUids = _(request.get('workers').pluck('uid'));
        //return _(workerUids).contains(this.get('uid'));
        return true || this.isAdmin();
    }
});
