"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QueryOptions = function () {
  function QueryOptions() {
    var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, QueryOptions);

    this.timeZone = attrs.time_zone || null;
  }

  QueryOptions.prototype.toJSON = function toJSON() {
    return {
      time_zone: this.timeZone
    };
  };

  return QueryOptions;
}();

exports.default = QueryOptions;
//# sourceMappingURL=query-options.js.map