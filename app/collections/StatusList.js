var _ = require('underscore');
var Backbone = require('backbone');
var Status = require('../models/Status');

module.exports = Backbone.Collection.extend({
    model: Status,
    url: 'http://localhost:8080/statuses',
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
