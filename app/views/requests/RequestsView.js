var $ = require('jquery');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.Validation = require('backbone.validation');
var Request = require('../../models/Request');
var RequestView = require('./RequestView');

module.exports = Backbone.Marionette.CompositeView.extend({
    className: 'container',
    childView: RequestView,
    childViewContainer: '#request_list',
    template: '#requests_view',
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
        this.model = new Request();
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

