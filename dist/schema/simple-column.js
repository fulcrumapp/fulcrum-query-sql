"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _column = _interopRequireDefault(require("./column"));

var _join = _interopRequireDefault(require("./join"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SimpleColumn =
/*#__PURE__*/
function (_Column) {
  _inheritsLoose(SimpleColumn, _Column);

  function SimpleColumn(_ref) {
    var _this;

    var name = _ref.name,
        attributeName = _ref.attributeName,
        columnName = _ref.columnName,
        _ref$type = _ref.type,
        type = _ref$type === void 0 ? null : _ref$type,
        _ref$accessor = _ref.accessor,
        accessor = _ref$accessor === void 0 ? null : _ref$accessor,
        _ref$join = _ref.join,
        join = _ref$join === void 0 ? null : _ref$join,
        _ref$sql = _ref.sql,
        sql = _ref$sql === void 0 ? null : _ref$sql,
        index = _ref.index;
    _this = _Column.call(this) || this;

    _defineProperty(_assertThisInitialized(_this), "defaultAccessor", function (object) {
      return object[_this.attributeName];
    });

    _this._type = type || 'string';
    _this._name = name;
    _this._attributeName = attributeName;
    _this._columnName = columnName;
    _this._accessor = accessor || _this.defaultAccessor;
    _this._sql = !!sql;
    _this._index = index;

    if (join) {
      _this._join = new _join["default"](join);
    }

    return _this;
  }

  var _proto = SimpleColumn.prototype;

  _proto.valueFrom = function valueFrom(object) {
    return this._accessor(object);
  };

  _proto.exportValue = function exportValue(object, options) {
    if (options === void 0) {
      options = {};
    }

    return this._accessor(object, options);
  };

  _createClass(SimpleColumn, [{
    key: "type",
    get: function get() {
      return this._type;
    }
  }, {
    key: "id",
    get: function get() {
      if (this._sql) {
        // The double underscore is the marker for an internal column id
        return "__" + this._index + ":" + this._columnName;
      }

      return this._columnName;
    }
  }, {
    key: "name",
    get: function get() {
      return this._name;
    }
  }, {
    key: "join",
    get: function get() {
      return this._join;
    }
  }, {
    key: "source",
    get: function get() {
      if (this.join) {
        return this._columnName.split('.')[0];
      }

      return null;
    }
  }, {
    key: "joinedColumnName",
    get: function get() {
      return this.columnName;
    }
  }, {
    key: "columnName",
    get: function get() {
      if (this.join) {
        return this._columnName.split('.')[1];
      }

      return this._columnName;
    }
  }, {
    key: "attributeName",
    get: function get() {
      return this._attributeName;
    }
  }, {
    key: "isSQL",
    get: function get() {
      return this._sql;
    }
  }]);

  return SimpleColumn;
}(_column["default"]);

exports["default"] = SimpleColumn;
//# sourceMappingURL=simple-column.js.map