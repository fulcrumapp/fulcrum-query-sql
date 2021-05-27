"use strict";

exports.__esModule = true;
exports.Condition = exports.ConditionType = void 0;

var _expression = require("./expression");

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ConditionType = {
  And: 'and',
  Or: 'or',
  Not: 'not'
};
exports.ConditionType = ConditionType;

var Condition =
/*#__PURE__*/
function () {
  function Condition(attrs, schema) {
    attrs = attrs || {};
    this._type = attrs.type || ConditionType.And;
    this._schema = schema;
    this._expressions = [];

    if (attrs.expressions) {
      this._expressions = attrs.expressions.filter(function (o) {
        return o;
      }).map(function (o) {
        if (o.expressions) {
          return new Condition(o, schema);
        }

        return new _expression.Expression(o, schema);
      });
    }

    this.ensureEmptyExpression();
  }

  var _proto = Condition.prototype;

  _proto.addEmptyCondition = function addEmptyCondition() {
    var condition = new Condition({}, this._schema);
    condition.addEmptyExpression();

    this._expressions.push(condition);
  };

  _proto.removeCondition = function removeCondition(condition) {
    this._expressions = _lodash["default"].without(this._expressions, condition);
  };

  _proto.ensureEmptyExpression = function ensureEmptyExpression() {
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

  _proto.addEmptyExpression = function addEmptyExpression() {
    this._expressions.push(new _expression.Expression({}, this._schema));
  };

  _proto.removeExpression = function removeExpression(expression) {
    this._expressions = _lodash["default"].without(this._expressions, expression);
  };

  _proto.toJSON = function toJSON() {
    var expressions = this.expressions.map(function (o) {
      return o.toJSON();
    }).filter(function (o) {
      return o;
    });

    if (!expressions.length) {
      return null;
    }

    return {
      type: this.type,
      expressions: expressions
    };
  };

  _proto.toHumanDescription = function toHumanDescription(topLevel) {
    if (topLevel === void 0) {
      topLevel = false;
    }

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
    key: "type",
    get: function get() {
      return this._type;
    },
    set: function set(type) {
      this._type = type;
    }
  }, {
    key: "expressions",
    get: function get() {
      return this._expressions;
    }
  }, {
    key: "allExpressions",
    get: function get() {
      var expressions = [];

      for (var _iterator3 = this.expressions, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
        var _ref3;

        if (_isArray3) {
          if (_i3 >= _iterator3.length) break;
          _ref3 = _iterator3[_i3++];
        } else {
          _i3 = _iterator3.next();
          if (_i3.done) break;
          _ref3 = _i3.value;
        }

        var o = _ref3;

        if (o.expressions) {
          expressions.push.apply(expressions, o.allExpressions);
        } else {
          expressions.push(o);
        }
      }

      return expressions;
    }
  }]);

  return Condition;
}();

exports.Condition = Condition;
//# sourceMappingURL=condition.js.map