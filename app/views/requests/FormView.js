var $ = require('jquery');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.Validation = require('backbone.validation');
var Request = require('../../models/Request');
var Status = require('../../models/Status');

module.exports = Backbone.Marionette.ItemView.extend({
    className: 'panel panel-default',
    template: '#request_form_view',
    ui: {
        inputTitle: 'input.title',
        inputContent: 'textarea.content',
        inputs: 'input, textarea',
        saveBtn: '.save-btn',
        submitBtn: '.submit-btn'
    },
    events: {
        'click @ui.saveBtn': 'onClickSave',
        'click @ui.submitBtn': 'onClickSubmit'
    },
    initialize: function(options) {
        this.currentUser = options.currentUser;
        this.statusList = options.statusList;
    },
    onRender: function() {
        if(this.model) {
            this.ui.inputTitle.val(this.model.get('title'));
            this.ui.inputContent.val(this.model.get('content'));
        }
    },
    onClickSave: function() {
        this.saveRequest(0, false);
    },
    onClickSubmit: function() {
        this.saveRequest(1, true);
    },
    saveRequest: function(nextStatus, validate) {
        if(!this.model) this.model = new Request();
        validate ? this.bindBackboneValidation() : this.unbindBackboneValidation();
        var title = this.ui.inputTitle.val().trim();
        var content = this.ui.inputContent.val().trim();
        var status = this.statusList.findWhere({code: nextStatus});
        this.model.set({
            title: title,
            content: content,
            user: this.currentUser,
            status: status
        });
        if(!validate || this.model.isValid(true)) {
            this.collection.create(this.model, {wait: true});
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
    },
    unbindBackboneValidation: function() {
        Backbone.Validation.unbind(this);
    }
});
