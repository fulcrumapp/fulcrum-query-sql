"use strict";

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QueryOptions = function () {
  function QueryOptions() {
    var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, QueryOptions);

    this._timeZone = attrs.time_zone || null;
  }

  QueryOptions.prototype.toJSON = function toJSON() {
    return {
      time_zone: this.timeZone
    };
  };

  _createClass(QueryOptions, [{
    key: "timeZone",
    get: function get() {
      return this._timeZone;
    },
    set: function set(timeZone) {
      this._timeZone = timeZone;
    }
  }]);

  return QueryOptions;
}();

exports.default = QueryOptions;
//# sourceMappingURL=query-options.js.map