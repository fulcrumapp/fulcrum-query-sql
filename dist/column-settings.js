'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _arrayMove = require('array-move');

var _arrayMove2 = _interopRequireDefault(_arrayMove);

var _columnSettingsItem = require('./column-settings-item');

var _columnSettingsItem2 = _interopRequireDefault(_columnSettingsItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ColumnSettings = function () {
  function ColumnSettings(schema, settings) {
    _classCallCheck(this, ColumnSettings);

    this._schema = schema;

    this._columns = [];
    this._columnsByID = {};

    this._allColumns = [];

    var newColumns = [];

    var existingSettingsByID = {};

    if (settings) {
      for (var _iterator = settings, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var setting = _ref;

        existingSettingsByID[setting.column.id] = setting;
      }
    }

    var columns = schema.columns.slice();

    for (var index = 0; index < columns.length; ++index) {
      var column = columns[index];

      var existingAttributes = existingSettingsByID[column.id];

      var item = new _columnSettingsItem2.default(_extends({}, existingAttributes, { column: column }), this._schema);

      if (existingAttributes == null) {
        newColumns.push({ column: item, index: index });
      }

      this._allColumns.push(item);
      this._columnsByID[column.id] = item;
    }

    if (settings) {
      for (var _iterator2 = settings, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var _setting = _ref2;

        var _item = this._columnsByID[_setting.column.id];

        if (_item) {
          this._columns.push(_item);
        }
      }
    }

    for (var _iterator3 = newColumns, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref3 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref3 = _i3.value;
      }

      var newColumn = _ref3;

      this._columns.splice(newColumn.index, 0, newColumn.column);
    }
  }

  ColumnSettings.prototype.reset = function reset() {
    this._columns = this._allColumns.slice();
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
      return this.enabledColumnSettings.map(function (c) {
        return c.column;
      });
    }
  }, {
    key: 'enabledColumnSettings',
    get: function get() {
      return this.columns.filter(function (c) {
        return c.isVisible;
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