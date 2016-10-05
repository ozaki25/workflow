var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

var GridRowView = Backbone.Marionette.View.extend({
    tagName: 'tr',
    attributes: function() {
        return {
            id: this.model.cid,
        }
    },
    template: _.template('<%= rowData %>'),
    templateContext: function() {
        return {
            rowData: _(this.columns).map(function(col) {
                var id = this.model.cid + '_' + (col.view ? col.view.cid : col.name);
                var value = '';
                if(!col.view) {
                    var nameSplit = col.name.split('.');
                    value = _(nameSplit).reduce(function(tmp, name) {
                        return tmp ? tmp[name] : '';
                    }, this.model.get(nameSplit.shift()));
                }
                return '<td id="' + id + '" data-row-id="' + this.model.cid + '" data-col-id="' + (col.view ? col.view.cid : col.name) + '">' + value + '</td>';
            }.bind(this))
        }
    },
    events: {
        'click': 'onClick',
    },
    initialize: function(options) {
        this.columns = options.columns;
        _(this.columns).each(function(col) {
            if(col.child) col.view = new col.child.view(col.child.options);
        });
        this.clickRowEventName = options.clickRowEventName;
        this.eventNames = options.eventNames;
        this.addChildEvents();
    },
    onRender: function() {
        _(this.columns).each(function(col) {
            if(col.view) {
                this.addRegion(this.model.cid + col.view.cid, '#' + this.model.cid + '_' + col.view.cid);
                this.getRegion(this.model.cid + col.view.cid).show(col.view);
            }
        }.bind(this));
    },
    onClick: function(e) {
        e.preventDefault();
        this.triggerMethod(this.clickRowEventName, this, e);
    },
    addChildEvents: function() {
        _(this.eventNames).each(function(eventName) {
            var event = {};
            event[eventName] = function() {
                this.triggerMethod.apply(this, [eventName].concat(_(arguments).rest()));
            };
            this.childViewEvents = Backbone.$.extend({}, this.childViewEvents, event);
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
            clickRowEventName: this.clickRowEventName,
            eventNames: this.eventNames,
        }
    },
    template: _.template(
      '<thead>' +
        '<tr><%= tableHeader %></tr>' +
      '</thead>' +
      '<tbody id="grid_child_container"></tbody>'
    ),
    templateContext: function() {
        return {
            tableHeader: _(this.columns).map(function(col) {
                return '<th name="' + (col.name || '') + '">' + (col.label || col.name || '') + '</th>'
            }).join('')
        }
    },
    initialize: function(options) {
        this.columns = options.columns;
        this.clickRowEventName = options.clickRowEventName || 'click:row';
        this.clickHeaderEventName = options.clickHeaderEventName || 'click:header';
        this.eventNames = options.eventNames;
    },
    ui: {
        tableHeader: 'th',
    },
    events: {
        'click @ui.tableHeader': 'onClickTableHeader',
    },
    onClickTableHeader: function(e) {
        this.triggerMethod(this.clickHeaderEventName, this, this.$(e.target).attr('name'), e);
    }
});

module.exports = GridView;
