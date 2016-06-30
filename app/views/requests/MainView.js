var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var Request = require('../../models/Request');
var RequestsView = require('./RequestsView');
var FormView = require('./FormView');

module.exports = Backbone.Marionette.LayoutView.extend({
    template: '#requests_main_view',
    regions: {
        requestsMain: '#requests_main'
    },
    childEvents: {
        'click:new': 'showNew',
    },
    initialize: function(options) {
        this.currentUser = options.currentUser;
        this.statusList = options.statusList;
    },
    onRender: function() {
        var requestsView = new RequestsView({collection: this.collection});
        this.getRegion('requestsMain').show(requestsView);
    },
    showNew: function() {
        var request = new Request({}, {collection: this.collection});
        var formView = new FormView({model: request, currentUser: this.currentUser, statusList: this.statusList});
        this.getRegion('requestsMain').show(formView);
    }
});

