"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _formFieldSchema = _interopRequireDefault(require("./form-field-schema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SQLQuerySchema = /*#__PURE__*/function (_FormFieldSchema) {
  _inheritsLoose(SQLQuerySchema, _FormFieldSchema);

  function SQLQuerySchema(rawColumns, tableName) {
    var _this;

    _this = _FormFieldSchema.call(this, {}) || this;
    _this._tableName = tableName || 'query';
    _this._columns = [];
    _this._rawColumns = rawColumns;
    _this._rawColumnsByKey = {};
    _this._columnsByKey = {};

    for (var _iterator = _createForOfIteratorHelperLoose(rawColumns), _step; !(_step = _iterator()).done;) {
      var column = _step.value;
      _this._rawColumnsByKey[column.name] = column;
    }

    _this.setupColumns();

    return _this;
  }

  var _proto = SQLQuerySchema.prototype;

  _proto.setupColumns = function setupColumns() {
    for (var _iterator2 = _createForOfIteratorHelperLoose(this._rawColumns), _step2; !(_step2 = _iterator2()).done;) {
      var column = _step2.value;
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