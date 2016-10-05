/*
var SelectboxView = require('./SelectboxView')
var selectboxView = new SelectboxView({
    collection: this.collection,                  // [必須]コレクション
    label: 'name',                                // [必須]選択肢に表示するプロパティ
    value: 'id',                                  // [必須]valueにセットするプロパティ
    changeEventName: 'change:user',               // 変更時に発生するイベント名 [デフォルト]change:selectbox
    _id: 'select_user',                           // selectタグのid
    _className: 'select-user',                    // selectタグのclass [デフォルト]form-control
    attrs: { name: 'selectUser' },                // selectタグの属性
    optionAttrs: { class: 'select-option' },      // optionタグの属性
    selected: this.model,                         // デフォルトで選択済みにする項目
    blank: true,                                  // 先頭に空のoptionを入れるかどうか
    blankLabel: '未選択',                         // 空のoptionのラベル
    blankValue: 'blank',                          // 空のoptionのvalue
})
this.getRegion('selectboxRegion').show(selectboxView);
*/

var _ = require('underscore');
var Backbone = require('backbone');
Backbone.Marionette = require('backbone.marionette');

var SelectboxOptionView = Backbone.Marionette.View.extend({
    tagName: 'option',
    attributes: function() {
        var selected = this.options.selected && this.options.selected.cid == this.model.cid ? { selected: 'selected' } : {};
        return Backbone.$.extend(this.options.attrs, selected, {
            value: this.model.get(this.options.value),
            'data-model-id': this.model.id,
        });
    },
    template: _.template('<%= label %>'),
    templateContext: function() {
        return {
            label: this.model.get(this.label),
        }
    },
    initialize: function(options) {
        this.label = options.label;
    },
});

var SelectboxView = Backbone.Marionette.CollectionView.extend({
    tagName: 'select',
    attributes: function() {
        return Backbone.$.extend(this.options.attrs, {
            id: this.options._id,
            class: this.options._className || 'form-control',
        });
    },
    childView: SelectboxOptionView,
    childViewOptions: function() {
        return {
            label: this.label,
            value: this.value,
            attrs: this.optionAttrs,
            selected: this.selected,
        }
    },
    initialize: function(options) {
        this.label = options.label;
        this.value = options.value;
        this.optionAttrs = options.optionAttrs;
        this.selected = options.selected;
        this.blank = options.blank;
        this.blankLabel = options.blankLabel || '';
        this.blankValue = options.blankValue || '';
        this.changeEventName = options.changeEventName || 'change:selectbox';
        if(this.blank) this.appendBlankOption();
    },
    events: {
        'change': 'onChange'
    },
    onChange: function() {
        var id = this.$('option:selected').attr('data-model-id');
        var value = this.$el.val();
        var model = this.collection.findWhere({ id: id }) || this.collection.findWhere({ id: parseInt(id) });
        this.triggerMethod(this.changeEventName, this, value, model);
    },
    appendBlankOption: function() {
        var blankOption = Backbone.$('<option>');
        blankOption.text(this.blankLabel);
        blankOption.val(this.blankValue);
        this.$el.append(blankOption);
    },
});

module.exports = SelectboxView;
