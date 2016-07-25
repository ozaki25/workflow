var _ = require('underscore');
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
        return this.get('uid') === request.get('applicant').uid;
    },
    isAuthorizer: function(request) {
        return this.get('uid') === request.get('authorizer').uid;
    },
    isReceptionist: function(receptnists) {
        return _.chain(receptnists).pluck('uid').contains(this.get('uid')).value();
    },
    isWorker: function(request) {
        //var workerUids = _(request.get('workers').pluck('uid'));
        //return _(workerUids).contains(this.get('uid'));
        return true;
    }
});
