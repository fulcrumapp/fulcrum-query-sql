"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _arrayMove = _interopRequireDefault(require("array-move"));

var _columnSettingsItem = _interopRequireDefault(require("./column-settings-item"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ColumnSettings =
/*#__PURE__*/
function () {
  function ColumnSettings(schema, settings) {
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
      var item = new _columnSettingsItem["default"](_extends({}, existingAttributes, {
        column: column
      }), this._schema);

      if (existingAttributes == null) {
        newColumns.push({
          column: item,
          index: index
        });
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

    for (var _i3 = 0, _newColumns = newColumns; _i3 < _newColumns.length; _i3++) {
      var newColumn = _newColumns[_i3];

      this._columns.splice(newColumn.index, 0, newColumn.column);
    }
  }

  var _proto = ColumnSettings.prototype;

  _proto.reset = function reset() {
    this._columns = this._allColumns.slice();

    this._columns.map(function (o) {
      return o.clear();
    });
  };

  _proto.toJSON = function toJSON() {
    return this.columns.map(function (o) {
      return o.toJSON();
    });
  };

  _proto.move = function move(from, to) {
    this._columns = (0, _arrayMove["default"])(this._columns, from, to);
  };

  _proto.byColumn = function byColumn(column) {
    return this._columnsByID[column.id];
  };

  _createClass(ColumnSettings, [{
    key: "enabledColumns",
    get: function get() {
      return this.enabledColumnSettings.map(function (c) {
        return c.column;
      });
    }
  }, {
    key: "enabledColumnSettings",
    get: function get() {
      return this.columns.filter(function (c) {
        return c.isVisible;
      });
    }
  }, {
    key: "columns",
    get: function get() {
      return this._columns;
    }
  }, {
    key: "columnsByID",
    get: function get() {
      return this._columnsByID;
    }
  }]);

  return ColumnSettings;
}();

exports["default"] = ColumnSettings;
//# sourceMappingURL=column-settings.js.map