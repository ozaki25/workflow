var $ = require('jquery');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.Validation = require('backbone.validation');
var Request = require('../../models/Request');

module.exports = Backbone.Marionette.ItemView.extend({
    className: 'container',
    template: '#form_view',
    ui: {
        inputTitle: 'input.title',
        inputContent: 'textarea.content',
        inputs: 'input, textarea',
        createBtn: '.create-btn'
    },
    events: {
        'click @ui.createBtn': 'onClickCreate'
    },
    initialize: function(options) {
        this.currentUser = options.currentUser;
    },
    onClickCreate: function() {
        this.model = new Request();
        this.bindBackboneValidation();

        var title = this.ui.inputTitle.val().trim();
        var content = this.ui.inputContent.val().trim();
        this.model.set({
            title: title,
            content: content,
            user: this.currentUser
        });
        if(this.model.isValid(true)) {
            this.collection.create(this.model, {wait: true});
            this.ui.inputs.val('');
            Backbone.history.navigate('/requests', {trigger: true});
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
                group.addClass('has-error')
                if(group.find('.help-block').length == 0) {
                    control.after('<p class="help-block"></p>');
                }
                group.find('.help-block').text(error);
            }
        });
    }
});
