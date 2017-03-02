'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Join = function () {
  function Join(_ref) {
    var alias = _ref.alias,
        tableName = _ref.tableName,
        sourceColumn = _ref.sourceColumn,
        joinColumn = _ref.joinColumn;

    _classCallCheck(this, Join);

    this._alias = alias;
    this._tableName = tableName;
    this._sourceColumn = sourceColumn;
    this._joinColumn = joinColumn;

    (0, _assert2.default)(alias && tableName && sourceColumn && joinColumn, 'invalid join');
  }

  _createClass(Join, [{
    key: 'alias',
    get: function get() {
      return this._alias;
    }
  }, {
    key: 'tableName',
    get: function get() {
      return this._tableName;
    }
  }, {
    key: 'sourceColumn',
    get: function get() {
      return this._sourceColumn;
    }
  }, {
    key: 'joinColumn',
    get: function get() {
      return this._joinColumn;
    }
  }]);

  return Join;
}();

exports.default = Join;
//# sourceMappingURL=join.js.map