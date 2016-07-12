var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var SelectDivisionView = require('./SelectDivisionView');

module.exports = Backbone.Marionette.CompositeView.extend({
    childView: SelectDivisionView,
    childViewContainer: '#division_list',
    childViewOptions: function() {
        return {
            selectedDivision: this.model.id
        }
    },
    template: '#select_category_view',
    ui: {
        selectCategory: 'select.category'
    },
    events: {
        'change @ui.selectCategory': 'changeSelectedCategory'
    },
    initialize: function(options) {
        this.categoryList = options.categoryList;
    },
    onRender: function() {
        if(this.categoryList.models.length !== 0) {
            var selectedCategory = this.model.has('category') ? this.model.get('category') : this.categoryList.models[0].id;
            this.ui.selectCategory.val(selectedCategory);
            this.changeSelectedCategory();
        }
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
    changeSelectedCategory: function() {
        var selectedCategory = this.ui.selectCategory.val();
        this.collection.setUrl(selectedCategory);
        this.collection.fetch();
    },
    categoryListHtml: function() {
        return _(this.categoryList.models).map(function(category) {
            return '<option value="' + category.id + '">' + category.get('name') + '</option>';
        }).join('');
    }
});
