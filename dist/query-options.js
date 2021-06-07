"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var QueryOptions = /*#__PURE__*/function () {
  function QueryOptions(attrs) {
    if (attrs === void 0) {
      attrs = {};
    }

    this.timeZone = attrs.time_zone || null;
  }

  var _proto = QueryOptions.prototype;

  _proto.toJSON = function toJSON() {
    return {
      time_zone: this.timeZone
    };
  };

  return QueryOptions;
}();

exports["default"] = QueryOptions;
//# sourceMappingURL=query-options.js.map