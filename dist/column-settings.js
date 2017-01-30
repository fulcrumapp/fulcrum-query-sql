'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _arrayMove = require('array-move');

var _arrayMove2 = _interopRequireDefault(_arrayMove);

var _columnSettingsItem = require('./column-settings-item');

var _columnSettingsItem2 = _interopRequireDefault(_columnSettingsItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ColumnSettings = function () {
  function ColumnSettings(schema) {
    _classCallCheck(this, ColumnSettings);

    this._schema = schema;

    this._columns = [];
    this._columnsByID = {};

    var columns = schema.columns.slice();

    for (var _iterator = columns, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var column = _ref;

      var item = new _columnSettingsItem2.default({ column: column }, this._schema);

      this._columns.push(item);
      this._columnsByID[column.id] = item;
    }
  }

  ColumnSettings.prototype.reset = function reset() {
    this._columns.map(function (o) {
      return o.clear();
    });
  };

  ColumnSettings.prototype.toJSON = function toJSON() {
    return this.columns.map(function (o) {
      return o.toJSON();
    });
  };

  ColumnSettings.prototype.move = function move(from, to) {
    this._columns = (0, _arrayMove2.default)(this._columns, from, to);
  };

  ColumnSettings.prototype.byColumn = function byColumn(column) {
    return this._columnsByID[column.id];
  };

  _createClass(ColumnSettings, [{
    key: 'enabledColumns',
    get: function get() {
      return this.columns.filter(function (c) {
        return c.isVisible;
      }).map(function (c) {
        return c.column;
      });
    }
  }, {
    key: 'columns',
    get: function get() {
      return this._columns;
    }
  }, {
    key: 'columnsByID',
    get: function get() {
      return this._columnsByID;
    }
  }]);

  return ColumnSettings;
}();

exports.default = ColumnSettings;
//# sourceMappingURL=column-settings.js.map