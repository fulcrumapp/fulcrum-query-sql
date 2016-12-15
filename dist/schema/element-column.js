'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _column = require('./column');

var _column2 = _interopRequireDefault(_column);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var ElementColumn = function (_Column) {
  _inherits(ElementColumn, _Column);

  function ElementColumn(element, rawColumn, id) {
    _classCallCheck(this, ElementColumn);

    var _this = _possibleConstructorReturn(this, _Column.call(this));

    _this._element = element;
    _this._rawColumn = rawColumn;
    _this._id = id || element.key;
    return _this;
  }

  ElementColumn.prototype.valueFrom = function valueFrom(row) {
    if (this.element.isStatusElement) {
      return row.statusValue;
    }

    return row.formValues.get(this.element.key);
  };

  _createClass(ElementColumn, [{
    key: 'name',
    get: function get() {
      return this.element.label;
    }
  }, {
    key: 'element',
    get: function get() {
      return this._element;
    }
  }, {
    key: 'rawColumn',
    get: function get() {
      return this._rawColumn;
    }
  }, {
    key: 'columnName',
    get: function get() {
      return this.rawColumn.name;
    }
  }, {
    key: 'id',
    get: function get() {
      return this._id;
    }
  }]);

  return ElementColumn;
}(_column2.default);

exports.default = ElementColumn;
//# sourceMappingURL=element-column.js.map