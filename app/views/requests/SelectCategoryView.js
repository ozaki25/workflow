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
        this.canRequest = options.canRequest;
    },
    onRender: function() {
        if(this.canRequest && this.categoryList.models.length !== 0) {
            var selectedCategory = this.model.has('category') ? this.model.get('category') : this.categoryList.models[0].id;
            this.ui.selectCategory.val(selectedCategory);
            this.changeSelectedCategory();
        }
    },
    templateHelpers: function() {
        return {
            inputCategory: this.canRequest ?
                '<select class="category form-control" name="category">' + this.categoryListHtml() + '</select>' :
                '<p class="form-control-static">' + this.categoryList.findWhere({id: this.model.get('category')}).get('name') + '</p>',
            inputDivision: this.canRequest ?
                '<select id="division_list" class="division form-control" name="division"></select>' :
                '<p class="form-control-static">' + this.model.get('name') + '</p>'
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
