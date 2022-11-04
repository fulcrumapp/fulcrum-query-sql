"use strict";

exports.__esModule = true;
exports["default"] = void 0;
var _expression = require("./expression");
var _operator = require("./operator");
var _columnFilter = _interopRequireDefault(require("./column-filter"));
var _columnSummary = _interopRequireDefault(require("./column-summary"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
var ColumnSettingsItem = /*#__PURE__*/function () {
  function ColumnSettingsItem(attrs, schema) {
    this._schema = schema;
    this._hidden = !!attrs.hidden;
    this._column = attrs.column;
    this._search = attrs.search || '';
    this._filter = new _columnFilter["default"](_extends({}, attrs.filter, {
      field: attrs.column.id
    }), this._schema);
    this._expression = new _expression.Expression(_extends({}, attrs.expression, {
      field: attrs.column.id
    }), schema);
    this._range = new _expression.Expression(_extends({}, attrs.range, {
      operator: attrs.column.isDate ? _operator.OperatorType.DateBetween.name : _operator.OperatorType.Between.name,
      field: attrs.column.id
    }), schema);
    this._summary = new _columnSummary["default"](_extends({}, attrs.summary, {
      field: attrs.column.id
    }), this._schema);
  }
  var _proto = ColumnSettingsItem.prototype;
  _proto.clear = function clear() {
    this._search = '';
    this._filter = new _columnFilter["default"]({
      field: this.column.id
    }, this._schema);
    this._expression = new _expression.Expression({
      field: this.column.id
    }, this._schema);
    this._range = new _expression.Expression({
      operator: this.column.isDate ? _operator.OperatorType.DateBetween.name : _operator.OperatorType.Between.name,
      field: this.column.id
    }, this._schema);
  };
  _proto.toJSON = function toJSON() {
    var json = {
      hidden: this.isHidden,
      column: this.column.toJSON()
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
    key: "hasFilter",
    get: function get() {
      return this._search || this._filter.hasFilter || this._expression.isValid || this._range.isValid;
    }
  }, {
    key: "search",
    get: function get() {
      return this._search;
    },
    set: function set(search) {
      this._search = search || '';
    }
  }, {
    key: "column",
    get: function get() {
      return this._column;
    }
  }, {
    key: "filter",
    get: function get() {
      return this._filter;
    }
  }, {
    key: "summary",
    get: function get() {
      return this._summary;
    }
  }, {
    key: "isVisible",
    get: function get() {
      return !this._hidden;
    }
  }, {
    key: "isHidden",
    get: function get() {
      return this._hidden;
    }
  }, {
    key: "hidden",
    set: function set(hidden) {
      this._hidden = !!hidden;
    }
  }, {
    key: "expression",
    get: function get() {
      return this._expression;
    }
  }, {
    key: "range",
    get: function get() {
      return this._range;
    }
  }]);
  return ColumnSettingsItem;
}();
exports["default"] = ColumnSettingsItem;
//# sourceMappingURL=column-settings-item.js.map