var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var User = require('../../models/User');

module.exports = Backbone.Marionette.ItemView.extend({
    className: 'panel panel-default',
    template: '#user_form_view',
    ui: {
        inputUid: 'input.uid',
        inputName: 'input.name',
        inputTeam: 'input.team',
        inputJobLevel: 'select.job-level',
        inputAdmin: 'input.admin',
        newUserBtn: '.new-user'
    },
    events: {
        'click @ui.newUserBtn': 'onClickNew'
    },
    onClickNew: function() {
        this.model = new User();
        this.bindBackboneValidation();

        var uid = this.ui.inputUid.val().trim();
        var name = this.ui.inputName.val().trim();
        var team = this.ui.inputTeam.val().trim();
        var jobLevel = this.ui.inputJobLevel.val().trim();
        var admin = this.ui.inputAdmin.val().trim();
        this.model.set({
            uid: uid,
            name: name,
            team: team,
            jobLevel: jobLevel,
            admin: admin
        });
        if(this.model.isValid(true)) {
            this.collection.create(this.model, {wait: true});
            this.ui.inputName.val('');
        }
    },
    bindBackboneValidation: function() {
        Backbone.Validation.bind(this, {
            valid: function(view, attr) {
                var control = view.$('[name=' + attr + ']');
                var group = control.closest('.form-group');
                group.removeClass('has-error').find('.help-block').remove();
            },
            invalid: function(view, attr, error) {
                var control = view.$('[name=' + attr + ']');
                var group = control.closest('.form-group');
                group.addClass('has-error');
                if(group.find('.help-block').length == 0) {
                    control.after('<p class="help-block"></p>');
                }
                group.find('.help-block').text(error);
            }
        });
    }
});

