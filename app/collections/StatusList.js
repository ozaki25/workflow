var _ = require('underscore');
var Backbone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');
var Status = require('../models/Status');

module.exports = Backbone.Collection.extend({
    model: Status,
    localStorage: new Backbone.LocalStorage('Workflow.status'),
    addDefaultStatus: function() {
        var statusList = [{code: 1, name: '作成中'},
                          {code: 2, name: '承認待ち'},
                          {code: 3, name: '受付待ち'},
                          {code: 4, name: '作業完了待ち'},
                          {code: 5, name: '作業完了承認待ち'},
                          {code: 6, name: '作業確認待ち'},
                          {code: 7, name: '完了'}];
        _(statusList).each(function(status) {
            this.create(status, {wait: true});
        }.bind(this));
    }
});
