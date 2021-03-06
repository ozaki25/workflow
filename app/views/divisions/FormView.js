var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.csrf = require('../../csrf');
Backbone.csrf();

module.exports = Backbone.Marionette.ItemView.extend({
    className: 'panel panel-default',
    template: '#division_form_view',
    ui: {
        inputCode: 'input.code',
        inputName: 'input.name',
        submitBtn: '.submit-division'
    },
    events: {
        'click @ui.submitBtn': 'onClickSubmit'
    },
    templateHelpers: function() {
        return {
            action: this.model.isNew() ? 'Create' : 'Update',
            code: this.model.isNew() ? '' : this.model.get('code'),
            name: this.model.isNew() ? '' : this.model.get('name'),
        }
    },
    onClickSubmit: function() {
        this.bindBackboneValidation();
        var code = this.ui.inputCode.val().trim();
        var name = this.ui.inputName.val().trim();
        this.model.set({ code: code, name: name });
        if(this.model.isValid(true)) this.collection.create(this.model, { wait: true });
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

