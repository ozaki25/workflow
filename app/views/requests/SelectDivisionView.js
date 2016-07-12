var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

module.exports = Backbone.Marionette.ItemView.extend({
    tagName: 'option',
    template: '#select_division_view',
    initialize: function(options) {
        this.selectedDivision = options.selectedDivision;
    },
    templateHelpers: function() {
        return {
            /*inputDivision: this.canRequest() ?
                '<select class="division form-control" name="division">' + this.divisionListHtml() + '</select>' :
                this.staticItemNameHtml(this.model.get('division').name)
            */
        }
    },
    onRender: function() {
        this.$el.val(this.model.id);
        if(this.selectedDivision == this.model.id) this.$el.attr('selected', 'selected');
    }
});
