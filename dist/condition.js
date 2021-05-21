"use strict";

exports.__esModule = true;
exports.Condition = exports.ConditionType = void 0;

var _expression = require("./expression");

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ConditionType = {
  And: 'and',
  Or: 'or',
  Not: 'not'
};
exports.ConditionType = ConditionType;

var Condition = /*#__PURE__*/function () {
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

    for (var _iterator = _createForOfIteratorHelperLoose(this._expressions), _step; !(_step = _iterator()).done;) {
      var expression = _step.value;

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

    for (var _iterator2 = _createForOfIteratorHelperLoose(this.expressions), _step2; !(_step2 = _iterator2()).done;) {
      var expression = _step2.value;
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

      for (var _iterator3 = _createForOfIteratorHelperLoose(this.expressions), _step3; !(_step3 = _iterator3()).done;) {
        var o = _step3.value;

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