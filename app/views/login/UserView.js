var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.ItemView.extend({
    tagName: 'tr',
    template: '#login_user_view',
    events: {
        'click .login': 'onClickLogin'
    },
    onClickLogin: function(e) {
        e.preventDefault();
        this.triggerMethod('selected:user');
    }
});
