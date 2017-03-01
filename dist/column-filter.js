'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ColumnFilter = function () {
  function ColumnFilter(attrs, schema) {
    _classCallCheck(this, ColumnFilter);

    this._field = attrs.field;
    this._value = attrs.value || null;
    this._schema = schema;
  }

  ColumnFilter.prototype.reset = function reset() {
    this._value = null;
  };

  ColumnFilter.prototype.resetIfEmpty = function resetIfEmpty() {
    if (this.isEmptySet) {
      this.reset();
    }
  };

  ColumnFilter.prototype.clearValues = function clearValues() {
    this._value = [];
  };

  ColumnFilter.prototype.ensureValue = function ensureValue(value) {
    if (!this._value) {
      this._value = [];
    }

    if (!this.containsValue(value)) {
      this._value.push(value);
    }
  };

  ColumnFilter.prototype.toggleValue = function toggleValue(value) {
    if (!this._value) {
      this._value = [];
    }

    if (this.containsValue(value)) {
      this._value = _lodash2.default.without(this.value, value);
    } else {
      this._value.push(value);
    }
  };

  ColumnFilter.prototype.containsValue = function containsValue(value) {
    if (this.value == null) {
      return false;
    }

    return this.value.indexOf(value) > -1;
  };

  ColumnFilter.prototype.toJSON = function toJSON() {
    if (!this.hasFilter) {
      return null;
    }

    return {
      field: this._field,
      value: this._value
    };
  };

  ColumnFilter.prototype.toHumanDescription = function toHumanDescription() {
    if (!this.hasFilter) {
      return null;
    }

    return [this.field, 'one of', '[' + this.value.join(', ') + ']'].join(' ');
  };

  _createClass(ColumnFilter, [{
    key: 'value',
    get: function get() {
      return this._value;
    }

    // when the filter is fully blank (default state) all rows are returned

  }, {
    key: 'isNull',
    get: function get() {
      return this.value == null;
    }
  }, {
    key: 'hasFilter',
    get: function get() {
      return !this.isNull;
    }
  }, {
    key: 'hasValues',
    get: function get() {
      return this.value != null && this.value.length > 0;
    }

    // when the set is empty, it should always return no results

  }, {
    key: 'isEmptySet',
    get: function get() {
      return this.value != null && this.value.length === 0;
    }
  }, {
    key: 'field',
    get: function get() {
      return this._field;
    }
  }, {
    key: 'column',
    get: function get() {
      return this._schema.columnForFieldKey(this.field);
    }
  }, {
    key: 'columnName',
    get: function get() {
      if (this.column) {
        return this.column.columnName;
      }
      return null;
    }
  }]);

  return ColumnFilter;
}();

exports.default = ColumnFilter;
//# sourceMappingURL=column-filter.js.map