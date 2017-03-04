'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _formFieldSchema = require('./form-field-schema');

var _formFieldSchema2 = _interopRequireDefault(_formFieldSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var SQLQuerySchema = function (_FormFieldSchema) {
  _inherits(SQLQuerySchema, _FormFieldSchema);

  function SQLQuerySchema(rawColumns, tableName) {
    _classCallCheck(this, SQLQuerySchema);

    var _this = _possibleConstructorReturn(this, _FormFieldSchema.call(this, {}));

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

  SQLQuerySchema.prototype.setupColumns = function setupColumns() {
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
    key: 'tableName',
    get: function get() {
      return this._tableName;
    }
  }, {
    key: 'isSQL',
    get: function get() {
      return true;
    }
  }]);

  return SQLQuerySchema;
}(_formFieldSchema2.default);

exports.default = SQLQuerySchema;
//# sourceMappingURL=sql-query-schema.js.map