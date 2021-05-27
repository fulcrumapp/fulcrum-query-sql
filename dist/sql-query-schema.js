"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _formFieldSchema = _interopRequireDefault(require("./form-field-schema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var SQLQuerySchema =
/*#__PURE__*/
function (_FormFieldSchema) {
  _inheritsLoose(SQLQuerySchema, _FormFieldSchema);

  function SQLQuerySchema(rawColumns, tableName) {
    var _this;

    _this = _FormFieldSchema.call(this, {}) || this;
    _this._tableName = tableName || 'query';
    _this._columns = [];
    _this._rawColumns = rawColumns;
    _this._rawColumnsByKey = {};
    _this._columnsByKey = {};

    for (var _iterator = rawColumns, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
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
      _this._rawColumnsByKey[column.name] = column;
    }

    _this.setupColumns();

    return _this;
  }

  var _proto = SQLQuerySchema.prototype;

  _proto.setupColumns = function setupColumns() {
    for (var _iterator2 = this._rawColumns, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var column = _ref2;
      this.addSystemColumn(column.name, column.name, column.name, column.type, null, null, true);
    }
  };

  _createClass(SQLQuerySchema, [{
    key: "tableName",
    get: function get() {
      return this._tableName;
    }
  }, {
    key: "isSQL",
    get: function get() {
      return true;
    }
  }]);

  return SQLQuerySchema;
}(_formFieldSchema["default"]);

exports["default"] = SQLQuerySchema;
//# sourceMappingURL=sql-query-schema.js.map