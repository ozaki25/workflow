var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var UserModalView = require('./UserModalView');

module.exports = Backbone.Marionette.CompositeView.extend({
    id: 'authorizer_list_modal',
    className: 'modal fade',
    childView: UserModalView,
    childViewContainer: '#authorizer_list',
    template: '#users_modal_view'
});
