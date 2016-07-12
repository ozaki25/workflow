var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var SelectDivisionView = require('./SelectDivisionView');

module.exports = Backbone.Marionette.CompositeView.extend({
    childView: SelectDivisionView,
    childViewContainer: '#division_list',
    template: '#select_category_view',
    initialize: function(options) {
        this.categoryList = options.categoryList;
    },
    onRender: function() {
        this.collection.setUrl(this.categoryList.models[0].id);
        this.collection.fetch();
    },
    templateHelpers: function() {
        return {
            /*inputCategory: this.canRequest() ?
              '<select class="category form-control" name="category">' + this.categoryListHtml() + '</select>' :
              this.staticItemNameHtml(this.model.get('category').name)
            */
            inputCategory: '<select class="category form-control" name="category">' + this.categoryListHtml() + '</select>'
        }
    },
    categoryListHtml: function() {
        return _(this.categoryList.models).map(function(category) {
            return '<option value="' + category.id + '">' + category.get('name') + '</option>';
        }).join('');
    }
});
