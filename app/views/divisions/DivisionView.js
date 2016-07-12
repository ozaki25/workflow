var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
Backbone.csrf = require('../../csrf');
Backbone.csrf();

module.exports = Backbone.Marionette.ItemView.extend({
    tagName: 'tr',
    template: '#division_view',
    ui: {
        editBtn: '.edit',
        deleteBtn: '.delete'
    },
    events: {
        'click @ui.editBtn': 'onClickEditBtn',
        'click @ui.deleteBtn': 'onClickDeleteBtn'
    },
    onClickEditBtn: function(e) {
        e.preventDefault();
        this.triggerMethod('click:edit');
    },
    onClickDeleteBtn: function(e) {
        e.preventDefault();
        this.model.destroy({wait: true});
    }
});
