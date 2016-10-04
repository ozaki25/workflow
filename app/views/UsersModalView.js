var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var GridView = require('../lib/GridView');
var InputView = require('../lib/InputView');
var SelectboxView = require('../lib/SelectboxView');

module.exports = Backbone.Marionette.LayoutView.extend({
    id: 'select_users_modal',
    className: 'modal fade',
    template: '#users_modal_view',
    regions: {
        'teamSelectboxRegion': '#team_selectbox_region',
        'userTableRegion'    : '#user_table_region',
    },
    ui: {
        submitBtn: 'button.submit'
    },
    events: {
        'click @ui.submitBtn': 'onClickSubmitBtn'
    },
    childEvents: {
        'change:selectbox': 'onChangeSelectbox',
        'click:row'       : 'onClickRow',
    },
    initialize: function(options) {
        this.type        = options.type || 'radio';
        this.currentUser = options.currentUser;
        this.teams       = options.teams;
        this.findOptions = options.findOptions;
        this._getUsers(this.currentUser.get('team'));
    },
    onRender: function() {
        this.renderTeamSelectbox();
        this.renderUserTable();
    },
    renderTeamSelectbox: function() {
        var selected = this.teams.findWhere({ name: this.currentUser.get('team') });
        var selectboxView = new SelectboxView({
            collection: this.teams,
            label: 'team',
            value: 'team',
            selected: selected,
        });
        this.getRegion('teamSelectboxRegion').show(selectboxView);
    },
    renderUserTable: function() {
        var columns = [
            { child: { view: InputView, options: { _type: this.type, _className: ' ', attrs: { name: 'user' } } } },
            { label: 'Uid', name: 'uid' },
            { label: 'Name', name: 'name' },
            { label: 'Team', name: 'team' },
            { label: 'JobLevel', name: 'jobLevel' },
        ];
        var gridView = new GridView({
            collection: this.collection,
            columns: columns,
        });
        this.getRegion('userTableRegion').show(gridView);
    },
    onClickSubmitBtn: function(e) {
        e.preventDefault();
        var selectedUsers = _(this.$('input[name="user"]:checked')).map(function(input) {
            this._uncheck(input);
            var cid = this.$(input).parent('td').attr('data-row-id');
            return _(this.collection.models).findWhere({ cid: cid });
        }.bind(this));
        if(this.type === 'radio') this.triggerMethod('select:user', selectedUsers[0]);
        if(this.type === 'checkbox') this.triggerMethod('select:users', selectedUsers);
        this.$el.modal('hide');
    },
    onChangeSelectbox: function(view, value, model) {
        this._getUsers(value);
    },
    onClickRow: function(view, e) {
        e.preventDefault();
        var input = view.$('input')[0];
        if(this.type === 'radio') {
            _(this.$('input[type="radio"]')).each(function(i) { this._uncheck(i); }.bind(this));
            this._check(input);
        }
        if(this.type === 'checkbox') {
            this.$(input).attr('checked') ? this._uncheck(input) : this._check(input);
        }
    },
    _getUsers: function(team) {
        var fetchOptions = Backbone.$.extend({}, { team: team }, this.findOptions);
        this.collection.fetch({ data: fetchOptions });
    },
    _check: function(element) {
        element.checked =  true;
        this.$(element).attr('checked', 'checked');
    },
    _uncheck: function(element) {
        element.checked = false;
        this.$(element).removeAttr('checked');
    },
});

