var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var User = require('../../models/User');
var UserView = require('./UserView');

module.exports = Backbone.Marionette.CompositeView.extend({
    className: 'panel panel-default',
    childView: UserView,
    childViewContainer: '#user_list',
    template: '#login_users_view'
});

