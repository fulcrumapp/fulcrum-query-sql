"use strict";

exports.__esModule = true;
exports["default"] = void 0;
var _column = _interopRequireDefault(require("./column"));
var _fulcrumCore = require("fulcrum-core");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var ElementColumn = /*#__PURE__*/function (_Column) {
  _inheritsLoose(ElementColumn, _Column);
  function ElementColumn(_ref) {
    var _this;
    var element = _ref.element,
      rawColumn = _ref.rawColumn,
      type = _ref.type,
      id = _ref.id,
      part = _ref.part,
      index = _ref.index;
    _this = _Column.call(this) || this;
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
  var _proto = ElementColumn.prototype;
  _proto.valueFrom = function valueFrom(feature) {
    if (this.element.isStatusElement) {
      if (feature instanceof _fulcrumCore.Record) {
        return feature.statusValue;
      }
      return new _fulcrumCore.StatusValue(this.element, feature.recordStatus);
    }
    return feature.formValues.get(this.element.key);
  };
  _proto.exportValue = function exportValue(feature, options) {
    var value = this.valueFrom(feature);
    if (value) {
      return value.format(_extends({
        feature: feature,
        part: this.part
      }, options));
    }
    return null;
  };
  _createClass(ElementColumn, [{
    key: "type",
    get: function get() {
      return this._type;
    }
  }, {
    key: "name",
    get: function get() {
      if (this.part) {
        return this.element.label + ' (' + this.part + ')';
      }
      return this.element.label;
    }
  }, {
    key: "element",
    get: function get() {
      return this._element;
    }
  }, {
    key: "rawColumn",
    get: function get() {
      return this._rawColumn;
    }
  }, {
    key: "columnName",
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
    key: "id",
    get: function get() {
      return this._id;
    }
  }, {
    key: "part",
    get: function get() {
      return this._part;
    }
  }, {
    key: "canSearch",
    get: function get() {
      if (this.element.isPhotoElement || this.element.isVideoElement || this.element.isAudioElement || this.element.isSignatureElement || this.element.isAttachmentElement || this.element.isRepeatableElement) {
        return false;
      }
      return true;
    }
  }, {
    key: "supportsRanges",
    get: function get() {
      // Repeatable columns are an exception, they don't support ranges yet because we don't
      // have a physical column to query.
      if (this.element.isRepeatableElement) {
        return false;
      }
      return this.isNumber || this.isDate;
    }
  }, {
    key: "isSortable",
    get: function get() {
      if (this.element.isPhotoElement || this.element.isVideoElement || this.element.isAudioElement || this.element.isSignatureElement || this.element.isAttachmentElement || this.element.isRepeatableElement) {
        return false;
      }
      return true;
    }
  }]);
  return ElementColumn;
}(_column["default"]);
exports["default"] = ElementColumn;
//# sourceMappingURL=element-column.js.map