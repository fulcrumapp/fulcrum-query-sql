'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _column = require('./column');

var _column2 = _interopRequireDefault(_column);

var _join = require('./join');

var _join2 = _interopRequireDefault(_join);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var SimpleColumn = function (_Column) {
  _inherits(SimpleColumn, _Column);

  function SimpleColumn(_ref) {
    var name = _ref.name,
        attributeName = _ref.attributeName,
        columnName = _ref.columnName,
        _ref$type = _ref.type,
        type = _ref$type === undefined ? null : _ref$type,
        _ref$accessor = _ref.accessor,
        accessor = _ref$accessor === undefined ? null : _ref$accessor,
        _ref$join = _ref.join,
        join = _ref$join === undefined ? null : _ref$join;

    _classCallCheck(this, SimpleColumn);

    var _this = _possibleConstructorReturn(this, _Column.call(this));

    _this.defaultAccessor = function (object) {
      return object[_this.attributeName];
    };

    _this._type = type || 'string';
    _this._name = name;
    _this._attributeName = attributeName;
    _this._columnName = columnName;
    _this._accessor = accessor || _this.defaultAccessor;

    if (join) {
      _this._join = new _join2.default(join);
    }
    return _this;
  }

  SimpleColumn.prototype.valueFrom = function valueFrom(object) {
    return this._accessor(object);
  };

  SimpleColumn.prototype.exportValue = function exportValue(object) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return this._accessor(object, options);
  };

  _createClass(SimpleColumn, [{
    key: 'type',
    get: function get() {
      return this._type;
    }
  }, {
    key: 'id',
    get: function get() {
      return this._columnName;
    }
  }, {
    key: 'name',
    get: function get() {
      return this._name;
    }
  }, {
    key: 'join',
    get: function get() {
      return this._join;
    }
  }, {
    key: 'source',
    get: function get() {
      if (this.join) {
        return this._columnName.split('.')[0];
      }

      return null;
    }
  }, {
    key: 'joinedColumnName',
    get: function get() {
      return this.columnName;
    }
  }, {
    key: 'columnName',
    get: function get() {
      if (this.join) {
        return this._columnName.split('.')[1];
      }

      return this._columnName;
    }
  }, {
    key: 'attributeName',
    get: function get() {
      return this._attributeName;
    }
  }]);

  return SimpleColumn;
}(_column2.default);

exports.default = SimpleColumn;
//# sourceMappingURL=simple-column.js.map