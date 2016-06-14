var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.ItemView.extend({
    tagName: 'ul',
    className: 'nav nav-pills nav-stacked',
    template: '#side_menu_view',
    ui: {
        requests: '.requests',
        newRequest: '.new-request',
        users: '.users',
        categories: '.categories',
        statusList: '.status-list'
    },
    events: {
        'click @ui.requests': 'onClickRequestsLink',
        'click @ui.newRequest': 'onClickNewRequestLink',
        'click @ui.users': 'onClickUsersLink',
        'click @ui.categories': 'onClickCategoriesLink',
        'click @ui.statusList': 'onClickStatusListLink'
    },
    onClickRequestsLink: function(e) {
        e.preventDefault();
        Backbone.history.navigate('requests', {trigger: true});
    },
    onClickNewRequestLink: function(e) {
        e.preventDefault();
        Backbone.history.navigate('requests/new', {trigger: true});
    },
    onClickUsersLink: function(e) {
        e.preventDefault();
        Backbone.history.navigate('users', {trigger: true});
    },
    onClickCategoriesLink: function(e) {
        e.preventDefault();
        Backbone.history.navigate('categories', {trigger: true});
    },
    onClickStatusListLink: function(e) {
        e.preventDefault();
        Backbone.history.navigate('status_list', {trigger: true});
    }
});
