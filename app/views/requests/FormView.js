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
        inputFile: 'input.file',
        saveBtn: '.save-btn',
        submitBtn: '.submit-btn'
    },
    events: {
        'click @ui.saveBtn': 'onClickSave',
        'click @ui.submitBtn': 'onClickSubmit'
    },
    modelEvents: {
        'all': function(a, b, c) {
            console.log(a);
            console.log(b);
            console.log(c);
        }
    },
    initialize: function(options) {
        this.currentUser = options.currentUser;
        this.statusList = options.statusList;
    },
    templateHelpers: function() {
        return {
            id: function() {
                if(!this.model.isNew()) {
                    return '<div class="form-group">' +
                             '<label class="col-sm-2 control-label">ID</label>' +
                             '<div class="col-sm-10">' +
                               '<p class="form-control-static">' + this.model.id + '</p>' +
                             '</div>' +
                           '</div>'
                }
            }.bind(this),
            status: function() {
                if(!this.model.isNew()) {
                    return '<div class="form-group">' +
                             '<label class="col-sm-2 control-label">Status</label>' +
                             '<div class="col-sm-10">' +
                               '<p class="form-control-static">' + this.model.get('status').name + '</p>' +
                             '</div>' +
                           '</div>'
                }
            }.bind(this)
        }
    },
    onRender: function() {
        if(!this.model.isNew()) {
            this.ui.inputTitle.val(this.model.get('title'));
            this.ui.inputContent.val(this.model.get('content'));
        }
    },
    onClickSave: function() {
        this.saveRequest(1, false);
    },
    onClickSubmit: function() {
        this.saveRequest(2, true);
    },
    saveRequest: function(nextStatus, validate) {
        validate ? this.bindBackboneValidation() : this.unbindBackboneValidation();
        var title = this.ui.inputTitle.val().trim();
        var content = this.ui.inputContent.val().trim();
        var filename = this.ui.inputFile.val();
        var file = this.ui.inputFile.prop("files")[0];
        var status = this.statusList.findWhere({code: nextStatus});
        this.model.set({
            title: title,
            content: content,
            user: {id: this.currentUser.id},
            status: {id: status.id},
            //file: file
        });
        if(!validate || this.model.isValid(true)) {
            var data = {
                title: title,
                content: content,
                user: {id: this.currentUser.id},
                status: {id: status.id},
                file: file
            }
            var formData = new FormData();
            formData.append('file', file);
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8080/requests',
                dataType: 'json',
                processData: false,
                cache: false,
                contentType: false,
                data: formData
            });
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
