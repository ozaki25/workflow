var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var Category = require('../../models/Category');

module.exports = Backbone.Marionette.ItemView.extend({
    className: 'panel panel-default',
    template: '#category_form_view',
    ui: {
        inputCode: 'input.code',
        inputName: 'input.name',
        newCategoryBtn: '.new-category'
    },
    events: {
        'click @ui.newCategoryBtn': 'onClickNew'
    },
    templateHelpers: function() {
        return {
            submit: !!this.model ? 'Update' : 'Create'
        }
    },
    onRender: function() {
        if(this.model) {
            this.ui.inputCode.val(this.model.get('code'));
            this.ui.inputName.val(this.model.get('name'));
        }
    },
    onClickNew: function() {
        if(!this.model) this.model = new Category();
        this.bindBackboneValidation();

        var code = this.ui.inputCode.val().trim();
        var name = this.ui.inputName.val().trim();
        this.model.set({code: code, name: name});
        if(this.model.isValid(true)) {
            this.collection.create(this.model, {wait: true});
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
