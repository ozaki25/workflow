var _ = require('underscore');
var Backbone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');
var Status = require('../models/Status');

module.exports = Backbone.Collection.extend({
    model: Status,
    localStorage: new Backbone.LocalStorage('Workflow.users'),
    addDefaultStatus: function() {
        var statusList = ['作成中', '承認待ち', '完了'];
        _(statusList).each(function(status, i) {
            this.create({code: i, name: status}, {wait: true});
        }.bind(this));
    }
});
