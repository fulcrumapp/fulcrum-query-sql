'use strict';

exports.__esModule = true;
exports.Condition = exports.ConditionType = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _expression = require('./expression');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConditionType = exports.ConditionType = {
  And: 'and',
  Or: 'or',
  Not: 'not'
};

var Condition = exports.Condition = function () {
  function Condition(attrs, schema) {
    _classCallCheck(this, Condition);

    this._type = attrs.type || ConditionType.And;
    this._schema = schema;
    this._expressions = [];

    if (attrs.expressions) {
      this._expressions = attrs.expressions.map(function (o) {
        if (o.expressions) {
          return new Condition(o, schema);
        }

        return new _expression.Expression(o, schema);
      });
    }
  }

  Condition.prototype.addEmptyCondition = function addEmptyCondition() {
    var condition = new Condition({}, this._schema);

    condition.addEmptyExpression();

    this._expressions.push(condition);
  };

  Condition.prototype.removeCondition = function removeCondition(condition) {
    this._expressions = _lodash2.default.without(this._expressions, condition);
  };

  Condition.prototype.ensureEmptyExpression = function ensureEmptyExpression() {
    var hasEmpty = false;

    for (var _iterator = this._expressions, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var expression = _ref;

      if (!expression.field) {
        hasEmpty = true;
        break;
      }
    }

    if (!hasEmpty) {
      this.addEmptyExpression();
    }
  };

  Condition.prototype.addEmptyExpression = function addEmptyExpression() {
    this._expressions.push(new _expression.Expression({}, this._schema));
  };

  Condition.prototype.removeExpression = function removeExpression(expression) {
    this._expressions = _lodash2.default.without(this._expressions, expression);
  };

  Condition.prototype.toJSON = function toJSON() {
    return {
      type: this.type,
      expressions: this.expressions ? this.expressions.map(function (o) {
        return o.toJSON();
      }) : null
    };
  };

  Condition.prototype.toHumanDescription = function toHumanDescription() {
    var topLevel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (this.expressions.length === 0) {
      return null;
    }

    var descriptions = [];

    for (var _iterator2 = this.expressions, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var expression = _ref2;

      var desc = expression.toHumanDescription();

      if (desc) {
        descriptions.push(desc);
      }
    }

    if (descriptions.length === 0) {
      return null;
    }

    if (this.type === 'not') {
      return '(NOT ' + descriptions.join(' AND ') + ')';
    }

    return '(' + descriptions.join(' ' + this.type.toUpperCase() + ' ') + ')';
  };

  _createClass(Condition, [{
    key: 'type',
    get: function get() {
      return this._type;
    },
    set: function set(type) {
      this._type = type;
    }
  }, {
    key: 'expressions',
    get: function get() {
      return this._expressions;
    }
  }]);

  return Condition;
}();
//# sourceMappingURL=condition.js.map