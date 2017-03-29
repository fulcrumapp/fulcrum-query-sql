'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

  function ElementColumn(_ref) {
    var element = _ref.element,
        rawColumn = _ref.rawColumn,
        type = _ref.type,
        id = _ref.id,
        part = _ref.part,
        index = _ref.index;

    _classCallCheck(this, ElementColumn);

    var _this = _possibleConstructorReturn(this, _Column.call(this));

    _this._type = type;
    _this._element = element;
    _this._rawColumn = rawColumn;
    _this._id = id || element.key;
    _this._part = part;
    _this._index = index;

    if (part) {
      _this._id += '_' + part;
    }
    return _this;
  }

  ElementColumn.prototype.valueFrom = function valueFrom(feature) {
    if (this.element.isStatusElement) {
      return feature.statusValue;
    }

    return feature.formValues.get(this.element.key);
  };

  ElementColumn.prototype.exportValue = function exportValue(feature, options) {
    var value = this.valueFrom(feature);

    if (value) {
      return value.format(_extends({ feature: feature, part: this.part }, options));
    }

    return null;
  };

  _createClass(ElementColumn, [{
    key: 'type',
    get: function get() {
      return this._type;
    }
  }, {
    key: 'name',
    get: function get() {
      if (this.part) {
        return this.element.label + ' (' + this.part + ')';
      }

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
      if (this.rawColumn) {
        return this.rawColumn.name;
      }

      if (this.part) {
        return this.element.dataName + '_' + this.part;
      }

      return this.element.dataName;
    }
  }, {
    key: 'id',
    get: function get() {
      return this._id;
    }
  }, {
    key: 'part',
    get: function get() {
      return this._part;
    }
  }, {
    key: 'isSortable',
    get: function get() {
      if (this.element.isPhotoElement || this.element.isVideoElement || this.element.isAudioElement || this.element.isSignatureElement) {
        return false;
      }

      return true;
    }
  }]);

  return ElementColumn;
}(_column2.default);

exports.default = ElementColumn;
//# sourceMappingURL=element-column.js.map