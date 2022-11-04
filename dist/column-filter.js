"use strict";

exports.__esModule = true;
exports["default"] = void 0;
var _lodash = _interopRequireDefault(require("lodash"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
var ColumnFilter = /*#__PURE__*/function () {
  function ColumnFilter(attrs, schema) {
    this._field = attrs.field;
    this._value = attrs.value || null;
    this._schema = schema;
  }
  var _proto = ColumnFilter.prototype;
  _proto.reset = function reset() {
    this._value = null;
  };
  _proto.resetIfEmpty = function resetIfEmpty() {
    if (this.isEmptySet) {
      this.reset();
    }
  };
  _proto.clearValues = function clearValues() {
    this._value = [];
  };
  _proto.ensureValue = function ensureValue(value) {
    if (!this._value) {
      this._value = [];
    }
    if (!this.containsValue(value)) {
      this._value.push(value);
    }
  };
  _proto.toggleValue = function toggleValue(value) {
    if (!this._value) {
      this._value = [];
    }
    if (this.containsValue(value)) {
      this._value = _lodash["default"].without(this.value, value);
    } else {
      this._value.push(value);
    }
  };
  _proto.containsValue = function containsValue(value) {
    if (this.value == null) {
      return false;
    }
    return this.value.indexOf(value) > -1;
  };
  _proto.toJSON = function toJSON() {
    if (!this.hasFilter) {
      return null;
    }
    return {
      field: this._field,
      value: this._value
    };
  };
  _proto.toHumanDescription = function toHumanDescription() {
    if (!this.hasFilter) {
      return null;
    }
    return [this.column ? this.column.name : this.field, 'one of', '[' + this.value.join(', ') + ']'].join(' ');
  };
  _createClass(ColumnFilter, [{
    key: "value",
    get: function get() {
      return this._value;
    }

    // when the filter is fully blank (default state) all rows are returned
  }, {
    key: "isNull",
    get: function get() {
      return this.value == null;
    }
  }, {
    key: "hasFilter",
    get: function get() {
      return !this.isNull;
    }
  }, {
    key: "hasValues",
    get: function get() {
      return this.value != null && this.value.length > 0;
    }

    // when the set is empty, it should always return no results
  }, {
    key: "isEmptySet",
    get: function get() {
      return this.value != null && this.value.length === 0;
    }
  }, {
    key: "field",
    get: function get() {
      return this._field;
    }
  }, {
    key: "column",
    get: function get() {
      return this._schema.columnForFieldKey(this.field);
    }
  }, {
    key: "columnName",
    get: function get() {
      if (this.column) {
        return this.column.columnName;
      }
      return null;
    }
  }]);
  return ColumnFilter;
}();
exports["default"] = ColumnFilter;
//# sourceMappingURL=column-filter.js.map