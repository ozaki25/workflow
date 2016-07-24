var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var UserModalView = require('./UserModalView');

module.exports = Backbone.Marionette.CompositeView.extend({
    id: 'receptnist_list_modal',
    className: 'modal fade',
    childView: UserModalView,
    childViewContainer: '#receptnist_list',
    template: '#receptnists_modal_view',
    ui: {
        selectTeam: 'select.team-select',
        submitBtn: 'button.submit'
    },
    events: {
        'change @ui.selectTeam': 'changeSelectedTeam',
        'click @ui.submitBtn': 'onClickSubmitBtn'
    },
    initialize: function(options) {
        this.currentUser = options.currentUser;
        this.teamList = options.teamList;
    },
    templateHelpers: function() {
        return {
            teamList: function() {
                return _(this.teamList).map(function(team) {
                    return '<option value="' + team + '">' + team + '</option>';
                }).join('');
            }.bind(this)
        }
    },
    onRender: function() {
        var currentUserTeam = this.ui.selectTeam.val(this.currentUser.get('team'));
        if(currentUserTeam.length) this.changeSelectedTeam();
    },
    changeSelectedTeam: function() {
        var selectedTeam = this.ui.selectTeam.val();
        this.collection.fetch({data: {team: selectedTeam}});
    },
    onClickSubmitBtn: function(e) {
        e.preventDefault();
        var selectedInputs = this.$('input[type="checkbox"]:checked');
        var selectedUsers = _(selectedInputs).map(function(input) {
            return this.collection.findWhere({uid: this.$(input).val()});
        }.bind(this));
        this.$(selectedInputs).removeAttr('checked');
        this.$el.modal('hide');
        this.triggerMethod('selected:users', selectedUsers);
    }
});

