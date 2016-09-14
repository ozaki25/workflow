var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');
var ButtonView = require('./ButtonView');

var GridRowView = Backbone.Marionette.LayoutView.extend({
    tagName: 'tr',
    template: _.template('<%= values %>'),
    templateHelpers: function() {
        return {
            values: _(this.columns).map(function(col) {
                var id = 'table_data_' + this.model.id + '_' + (col.view ? col.view.cid : col.name);
                var value = '';
                if(!col.view) {
                    var nameSplit = col.name.split('.');
                    value = _(nameSplit).reduce(function(tmp, name) {
                        return tmp ? tmp[name] : '';
                    }, this.model.get(nameSplit.shift()));
                }
                return '<td id="' + id + '">' + value + '</td>';
            }.bind(this))
        }
    },
    initialize: function(options) {
        this.columns = options.columns;
        _(this.columns).map(function(col) {
            if(col.child) col.view = new col.child.view(col.child.options);
        });
        this.eventNames = options.eventNames;
        this.addChildEvents();
    },
    onRender: function() {
        _(this.columns).each(function(col) {
            if(col.view) {
                this.addRegion(this.model.id + col.view.cid, '#table_data_' + this.model.id + '_' + col.view.cid);
                this.getRegion(this.model.id + col.view.cid).show(col.view);
            }
        }.bind(this));
    },
    addChildEvents: function() {
        _(this.eventNames).each(function(eventName) {
            var event = {};
            event[eventName] = function() {
                this.triggerMethod.apply(this, [eventName].concat(_(arguments).rest()));
            };
            this.childEvents = Backbone.$.extend({}, this.childEvents, event);
        }.bind(this));
    },
});

var GridView = Backbone.Marionette.CompositeView.extend({
    tagName: 'table',
    attributes: function() {
        return Backbone.$.extend(this.options.attrs, {
            id: this.options._id,
            class: this.options._className || 'table',
        });
    },
    childView: GridRowView,
    childViewContainer: '#grid_child_container',
    childViewOptions: function() {
        return {
            columns: this.columns,
            eventNames: this.eventNames,
        }
    },
    template: _.template(
      '<thead>' +
        '<tr><%= tableHeader %></tr>' +
      '</thead>' +
      '<tbody id="grid_child_container"></tbody>'
    ),
    templateHelpers: function() {
        return {
            tableHeader: _(this.columns).map(function(col) {
                return '<th class="table-header" name="' + col.name + '">' + (col.label || col.name || '') + '</th>'
            }).join('')
        }
    },
    initialize: function(options) {
        this.sortable = options.sort;
        this.columns = options.columns;
        this.eventNames = options.eventNames
    },
    ui: {
         tableHeader: 'th.table-header',
    },
    events: {
        'click @ui.tableHeader': 'onClickTableHeader',
    },
    onClickTableHeader: function(e) {
        if(this.sortable) {
            this.collection.comparator = this.$(e.target).attr('name');
            this.collection.sort();
        }
    }
});

module.exports = GridView;
