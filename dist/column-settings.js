"use strict";

exports.__esModule = true;
exports["default"] = void 0;
var _arrayMove = _interopRequireDefault(require("array-move"));
var _columnSettingsItem = _interopRequireDefault(require("./column-settings-item"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
var ColumnSettings = /*#__PURE__*/function () {
  function ColumnSettings(schema, settings) {
    this._schema = schema;
    this._columns = [];
    this._columnsByID = {};
    this._allColumns = [];
    var newColumns = [];
    var existingSettingsByID = {};
    if (settings) {
      for (var _iterator = _createForOfIteratorHelperLoose(settings), _step; !(_step = _iterator()).done;) {
        var setting = _step.value;
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
        item.hidden = true;
        newColumns.push({
          column: item,
          index: index
        });
      }
      this._allColumns.push(item);
      this._columnsByID[column.id] = item;
    }
    if (settings) {
      for (var _iterator2 = _createForOfIteratorHelperLoose(settings), _step2; !(_step2 = _iterator2()).done;) {
        var _setting = _step2.value;
        var _item = this._columnsByID[_setting.column.id];
        if (_item) {
          this._columns.push(_item);
        }
      }
    }
    for (var _i = 0, _newColumns = newColumns; _i < _newColumns.length; _i++) {
      var newColumn = _newColumns[_i];
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