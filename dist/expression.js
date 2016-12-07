'use strict';

exports.__esModule = true;
exports.Expression = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _operator = require('./operator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Expression = exports.Expression = function () {
  function Expression(attrs, schema) {
    _classCallCheck(this, Expression);

    this._field = attrs.field || null;
    this._operator = attrs.operator || null;
    this._value = attrs.value || null;
    this._schema = schema;
  }

  Expression.prototype.toggleValue = function toggleValue(value) {
    if (!this._value) {
      this._value = [];
    }

    if (this.containsValue(value)) {
      this._value = _lodash2.default.without(this.value, value);
    } else {
      this._value.push(value);
    }
  };

  Expression.prototype.containsValue = function containsValue(value) {
    if (this.value == null) {
      return false;
    }

    return this.value.find(function (o) {
      return o.toString().toLowerCase().indexOf(value.toString().toLowerCase()) > -1;
    });
  };

  Expression.prototype.toJSON = function toJSON() {
    return {
      field: this._field,
      operator: this._operator,
      value: this._value
    };
  };

  Expression.prototype.isEqual = function isEqual(other) {
    if (other == null || !(other instanceof Expression)) {
      return false;
    }

    return this.field === other.field && this.operator === other.operator && JSON.stringify(this.value) === JSON.stringify(other.value);
  };

  Expression.prototype.availableOperators = function availableOperators() {
    return (0, _operator.availableOperatorsForColumn)(this.column);
  };

  _createClass(Expression, [{
    key: 'isValid',
    get: function get() {
      if (!(0, _operator.isValueRequired)(this.operator)) {
        return this.column && this.operator;
      }

      return this.column && this.operator && this.hasValue;
    }
  }, {
    key: 'supportsValue',
    get: function get() {
      return (0, _operator.isValueRequired)(this.operator);
    }
  }, {
    key: 'hasValue',
    get: function get() {
      return this.value !== null && this.value.length;
    }
  }, {
    key: 'value',
    get: function get() {
      return this._value;
    }
  }, {
    key: 'scalarValue',
    get: function get() {
      if (this.hasValue) {
        return this.value[0];
      }

      return null;
    },
    set: function set(value) {
      this._value = value ? [value] : null;
    }
  }, {
    key: 'operator',
    get: function get() {
      return this._operator;
    },
    set: function set(operator) {
      this._operator = operator;
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
    },
    set: function set(column) {
      var _this = this;

      this._field = column ? column.id : null;

      // if the change in the field results in the operator not being valid, clear the operator
      if (this._operator && this.availableOperators().find(function (o) {
        return o.name === _this._operator;
      }) === -1) {
        this._operator = null;
      }
    }
  }, {
    key: 'columnName',
    get: function get() {
      if (this.column) {
        return this.column.columnName;
      }
      return null;
    }
  }, {
    key: 'expressions',
    get: function get() {
      return this._expressions;
    }
  }]);

  return Expression;
}();
//# sourceMappingURL=expression.js.map