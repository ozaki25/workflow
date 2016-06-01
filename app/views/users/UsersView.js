var $ = require('jquery');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.Validation = require('backbone.validation');
var User = require('../../models/User');
var UserView = require('./UserView');

module.exports = Backbone.Marionette.CompositeView.extend({
    className: 'container',
    childView: UserView,
    childViewContainer: '#user_list',
    template: '#users_view',
    ui: {
        inputName: 'input.name',
        inputAge: 'input.age',
        inputs: 'input',
        createBtn: '.create-btn'
    },
    events: {
        'click @ui.createBtn': 'onClickCreate'
    },
    onClickCreate: function() {
        this.model = new User();
        this.bindBackboneValidation();

        var name = this.ui.inputName.val().trim();
        var age = this.ui.inputAge.val().trim();
        this.model.set({name: name, age: age});
        if(this.model.isValid(true)) {
            this.collection.create(this.model, {wait: true});
            this.ui.inputs.val('');
        }
    },
    bindBackboneValidation: function() {
        Backbone.Validation.bind(this, {
            valid: function(view, attr) {
                var control = view.$('[name=' + attr + ']');
                var group = control.closest('.form-group');
                group.removeClass('has-error').find('.help-inline').empty();
            },
            invalid: function(view, attr, error) {
                var control = view.$('[name=' + attr + ']');
                var group = control.closest('.form-group');
                group.addClass('has-error').find('.help-inline').text(error);
            }
        });
    }
});

