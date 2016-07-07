var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var UserModalView = require('./UserModalView');

module.exports = Backbone.Marionette.CompositeView.extend({
    id: 'authorizer_list_modal',
    className: 'modal fade',
    childView: UserModalView,
    childViewContainer: '#authorizer_list',
    template: '#users_modal_view',
    ui: {
        selectTeam: 'select.team-select'
    },
    events: {
        'change @ui.selectTeam': 'changeSelectedTeam'
    },
    initialize: function(options) {
        this.currentUser = options.currentUser;
        this.collection.fetch();
    },
    changeSelectedTeam: function(e) {
        var selectedTeam = this.$(e.target).children(':selected').val();
        this.collection.fetch({data: {team: selectedTeam, jobLevel: [0, 1, 2]}});
    }
});
