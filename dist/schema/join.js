"use strict";

exports.__esModule = true;
exports["default"] = void 0;
var _assert = _interopRequireDefault(require("assert"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
var Join = /*#__PURE__*/function () {
  function Join(_ref) {
    var alias = _ref.alias,
      tableName = _ref.tableName,
      sourceTableName = _ref.sourceTableName,
      sourceColumn = _ref.sourceColumn,
      joinColumn = _ref.joinColumn,
      inner = _ref.inner,
      ast = _ref.ast;
    this._alias = alias;
    this._tableName = tableName;
    this._sourceColumn = sourceColumn;
    this._joinColumn = joinColumn;
    this._inner = !!inner;
    this._sourceTableName = sourceTableName || null;
    this._ast = ast;
    (0, _assert["default"])(alias && tableName && (sourceColumn && joinColumn || ast), 'invalid join');
  }
  _createClass(Join, [{
    key: "inner",
    get: function get() {
      return this._inner;
    }
  }, {
    key: "alias",
    get: function get() {
      return this._alias;
    }
  }, {
    key: "tableName",
    get: function get() {
      return this._tableName;
    }
  }, {
    key: "sourceColumn",
    get: function get() {
      return this._sourceColumn;
    }
  }, {
    key: "sourceTableName",
    get: function get() {
      return this._sourceTableName;
    }
  }, {
    key: "joinColumn",
    get: function get() {
      return this._joinColumn;
    }
  }, {
    key: "ast",
    get: function get() {
      return this._ast;
    }
  }]);
  return Join;
}();
exports["default"] = Join;
//# sourceMappingURL=join.js.map