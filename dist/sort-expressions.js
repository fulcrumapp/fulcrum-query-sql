"use strict";

exports.__esModule = true;
exports["default"] = void 0;
var _sort = require("./sort");
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
var SortExpressions = /*#__PURE__*/function () {
  function SortExpressions(sorts, schema) {
    sorts = sorts || [];
    this._expressions = sorts.map(function (o) {
      return new _sort.Sort(o, schema);
    });
    this._schema = schema;
  }
  var _proto = SortExpressions.prototype;
  _proto.sortByAsc = function sortByAsc(column) {
    this._expressions = [new _sort.Sort({
      field: column.id,
      direction: 'asc'
    }, this._schema)];
  };
  _proto.sortByDesc = function sortByDesc(column) {
    this._expressions = [new _sort.Sort({
      field: column.id,
      direction: 'desc'
    }, this._schema)];
  };
  _proto.toJSON = function toJSON() {
    return this.expressions.map(function (o) {
      return o.toJSON();
    });
  };
  _proto.toHumanDescription = function toHumanDescription() {
    if (!this.hasSort) {
      return null;
    }
    return this.expressions.map(function (o) {
      return o.toHumanDescription();
    }).join(', ');
  };
  _createClass(SortExpressions, [{
    key: "isEmpty",
    get: function get() {
      return this._expressions.find(function (e) {
        return e.isValid;
      }) == null;
    }
  }, {
    key: "hasSort",
    get: function get() {
      return !this.isEmpty;
    }
  }, {
    key: "expressions",
    get: function get() {
      return this._expressions;
    }
  }]);
  return SortExpressions;
}();
exports["default"] = SortExpressions;
//# sourceMappingURL=sort-expressions.js.map