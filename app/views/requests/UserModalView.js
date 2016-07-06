var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.ItemView.extend({
    tagName: 'tr',
    template: '#user_modal_view',
    ui: {
        authorizerLink: 'a.authorizer'
    },
    events: {
        'click @ui.authorizerLink': 'onClickAuthorizer'
    },
    onClickAuthorizer: function(e) {
        e.preventDefault();
        this.triggerMethod('select:authorizer');
    }
});
