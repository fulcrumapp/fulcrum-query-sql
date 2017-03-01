'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _expression = require('./expression');

var _operator = require('./operator');

var _columnFilter = require('./column-filter');

var _columnFilter2 = _interopRequireDefault(_columnFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ColumnSettingsItem = function () {
  function ColumnSettingsItem(attrs, schema) {
    _classCallCheck(this, ColumnSettingsItem);

    this._schema = schema;
    this._hidden = !!attrs.hidden;
    this._column = attrs.column;
    this._search = attrs.search || '';
    this._filter = new _columnFilter2.default(_extends({}, attrs.filter, { field: attrs.column.id }), this._schema);
    this._expression = new _expression.Expression(_extends({}, attrs.expression, { field: attrs.column.id }), schema);
    this._range = new _expression.Expression(_extends({}, attrs.expression, {
      operator: attrs.column.isDate ? _operator.OperatorType.DateBetween.name : _operator.OperatorType.Between.name,
      field: attrs.column.id }), schema);
  }

  ColumnSettingsItem.prototype.clear = function clear() {
    this._hidden = false;
    this._search = '';
    this._filter = new _columnFilter2.default({ field: this.column.id }, this._schema);
    this._expression = new _expression.Expression({ field: this.column.id }, this._schema);
    this._range = new _expression.Expression({ operator: this.column.isDate ? _operator.OperatorType.DateBetween.name : _operator.OperatorType.Between.name,
      field: this.column.id }, this._schema);
  };

  ColumnSettingsItem.prototype.toJSON = function toJSON() {
    var json = {
      hidden: this.isHidden,
      column: this.column.field,
      search: this.search
    };

    if (this.search) {
      json.search = this.search;
    }

    if (this.filter.hasFilter) {
      json.filter = this.filter.toJSON();
    }

    if (this.expression.isValid) {
      json.expression = this.expression.toJSON();
    }

    if (this.range.isValid) {
      json.range = this.range.toJSON();
    }

    return json;
  };

  _createClass(ColumnSettingsItem, [{
    key: 'hasFilter',
    get: function get() {
      return this._search || this._filter.hasFilter || this._expression.isValid || this._range.isValid;
    }
  }, {
    key: 'search',
    get: function get() {
      return this._search;
    },
    set: function set(search) {
      this._search = search || '';
    }
  }, {
    key: 'column',
    get: function get() {
      return this._column;
    }
  }, {
    key: 'filter',
    get: function get() {
      return this._filter;
    }
  }, {
    key: 'isVisible',
    get: function get() {
      return !this._hidden;
    }
  }, {
    key: 'isHidden',
    get: function get() {
      return this._hidden;
    }
  }, {
    key: 'hidden',
    set: function set(hidden) {
      this._hidden = !!hidden;
    }
  }, {
    key: 'expression',
    get: function get() {
      return this._expression;
    }
  }, {
    key: 'range',
    get: function get() {
      return this._range;
    }
  }]);

  return ColumnSettingsItem;
}();

exports.default = ColumnSettingsItem;
//# sourceMappingURL=column-settings-item.js.map