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
      return value == null && o == null || o.toString() === value.toString();
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

  Expression.prototype.labelForValue = function labelForValue(value) {
    var column = this.column;

    if (!column) {
      return value;
    }

    var element = this.column.element;

    if (element) {
      if (element.isStatusElement) {
        var choice = element.statusForValue(value);

        if (choice) {
          return choice.label;
        }
      } else if (element.isChoiceElement) {
        var _choice = element.choiceByValue(value);

        if (_choice) {
          return _choice.label;
        }
      }
    }

    return value;
  };

  Expression.prototype.toHumanDescription = function toHumanDescription() {
    if (!this.isValid) {
      return null;
    }

    var parts = [this.columnName, _operator.OperatorsByValue[this.operator].label];

    if (this.supportsValue) {
      if (this.value.length === 1) {
        parts.push(this.value.join(', '));
      } else {
        parts.push('[' + this.value.join(', ') + ']');
      }
    }

    return parts.join(' ');
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
    key: 'value1',
    get: function get() {
      return this.value && this.value[0];
    }
  }, {
    key: 'value2',
    get: function get() {
      return this.value && this.value[1];
    }
  }, {
    key: 'isDateOperator',
    get: function get() {
      return (0, _operator.isDateOperator)(this.operator);
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
  }, {
    key: 'startDate',
    get: function get() {
      return this._value && this._value[0];
    },
    set: function set(date) {
      if (!this._value) {
        this._value = [];
      }

      this._value = [date && date.format('YYYY-MM-DD'), this.value[1]];
    }
  }, {
    key: 'endDate',
    get: function get() {
      return this._value && this._value[1];
    },
    set: function set(date) {
      if (!this._value) {
        this._value = [];
      }

      this._value = [this.value[0], date && date.format('YYYY-MM-DD')];
    }
  }]);

  return Expression;
}();
//# sourceMappingURL=expression.js.map