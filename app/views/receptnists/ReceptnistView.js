var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.View.extend({
    tagName: 'tr',
    template: '#receptnist_view',
    ui: {
        deleteBtn: '.delete'
    },
    events: {
        'click @ui.editBtn'  : 'onClickEditBtn',
        'click @ui.deleteBtn': 'onClickDeleteBtn'
    },
    initialize: function(options) {
        this.categoryName = options.categoryName;
    },
    templateContext: function() {
        return {
            categoryName: this.categoryName
        }
    },
    onClickDeleteBtn: function(e) {
        e.preventDefault();
        this.model.destroy({ wait: true });
    }
});
