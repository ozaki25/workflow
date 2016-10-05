var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.View.extend({
    tagName: 'tr',
    template: '#user_view',
    ui: {
        editBtn  : '.edit',
        deleteBtn: '.delete'
    },
    events: {
        'click @ui.editBtn'  : 'onClickEditBtn',
        'click @ui.deleteBtn': 'onClickDeleteBtn'
    },
    onClickEditBtn: function(e) {
        e.preventDefault();
        this.triggerMethod('click:edit');
    },
    onClickDeleteBtn: function(e) {
        e.preventDefault();
        console.log(this.model);
        this.model.destroy({ wait: true });
    }
});
