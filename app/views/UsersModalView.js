var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var UserModalView = require('./UserModalView');

module.exports = Backbone.Marionette.CompositeView.extend({
    id: 'select_users_modal',
    className: 'modal fade',
    childView: UserModalView,
    childViewContainer: '#select_user_list',
    childViewOptions: function() {
        return {
            type: this.type
        }
    },
    template: '#users_modal_view',
    ui: {
        selectTeam: 'select.team-select',
        submitBtn: 'button.submit'
    },
    events: {
        'change @ui.selectTeam': 'changeSelectedTeam',
        'click @ui.submitBtn': 'onClickSubmitBtn'
    },
    initialize: function(options) {
        this.type = options.type || 'radio';
        this.currentUser = options.currentUser;
        this.teamList = options.teamList;
        this.findOptions = options.findOptions;
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
        var fetchOptions = {data: {team: selectedTeam}};
        $.extend(true, fetchOptions, this.findOptions);
        this.collection.fetch(fetchOptions);
    },
    onClickSubmitBtn: function(e) {
        e.preventDefault();
        var selectedInputs = this.$('input[type="' + this.type + '"]:checked');
        var selectedUsers = _(selectedInputs).map(function(input) {
            return this.collection.findWhere({uid: this.$(input).val()});
        }.bind(this));
        this.$(selectedInputs).removeAttr('checked');
        this.$el.modal('hide');
        if(this.type === 'checkbox') this.triggerMethod('select:users', selectedUsers);
        if(this.type === 'radio') this.triggerMethod('select:user', selectedUsers[0]);
    }
});

