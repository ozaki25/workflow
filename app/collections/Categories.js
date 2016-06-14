var _ = require('underscore');
var Backbone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');
var Category = require('../models/Category');

module.exports = Backbone.Collection.extend({
    model: Category,
    localStorage: new Backbone.LocalStorage('Workflow.categories'),
    addDefaultCategories: function() {
        var categoryList = [{code: 1, name: '投手'},
                            {code: 2, name: '捕手'},
                            {code: 2, name: '内野手'},
                            {code: 4, name: '外野手'}];
        _(categoryList).each(function(category) {
            this.create(category, {wait: true});
        }.bind(this));
    }
});
