"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _elementColumn = _interopRequireDefault(require("./schema/element-column"));

var _simpleColumn = _interopRequireDefault(require("./schema/simple-column"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FormFieldSchema = /*#__PURE__*/function () {
  function FormFieldSchema(_ref) {
    var _ref$fullSchema = _ref.fullSchema,
        fullSchema = _ref$fullSchema === void 0 ? false : _ref$fullSchema;
    this.fullSchema = fullSchema;
  }

  var _proto = FormFieldSchema.prototype;

  _proto.addSystemColumn = function addSystemColumn(label, attribute, columnName, type, accessor, join, sql) {
    var column = new _simpleColumn["default"]({
      name: label,
      attributeName: attribute,
      columnName: columnName,
      type: type,
      accessor: accessor,
      join: join,
      sql: sql,
      index: this._columns.length
    });

    this._columns.push(column);

    this._columnsByKey[column.id] = column;
    return column;
  };

  _proto.addElementColumn = function addElementColumn(element, part, type) {
    var columnKey = part ? element.key + '_' + part : element.key;
    var rawColumn = this._rawColumnsByKey[columnKey]; // if (column == null) {
    //   if the column is null, that means it's a materialized column
    //   throw new Error('Column not found for element ' + columnKey + Object.keys(this._rawColumnsByKey));
    // }

    return this.addRawElementColumn(element, rawColumn, null, type || rawColumn.type, part, columnKey);
  };

  _proto.addRawElementColumn = function addRawElementColumn(element, rawColumn, id, type, part, columnKey) {
    var columnObject = new _elementColumn["default"]({
      element: element,
      rawColumn: rawColumn,
      type: type,
      id: id,
      part: part,
      index: this._columns.length
    });

    this._columns.push(columnObject);

    this._columnsByKey[columnKey] = columnObject;
    return columnObject;
  };

  _proto.setupElementColumns = function setupElementColumns() {
    for (var _iterator = _createForOfIteratorHelperLoose(this.elementsForColumns), _step; !(_step = _iterator()).done;) {
      var element = _step.value;

      // if (element.isHidden || element.hasHiddenParent) {
      //   continue;
      // }
      // repeatable elements don't have any physical columns, but we want to add a column that has the count of items
      if (element.isRepeatableElement) {
        this.addElementColumn(element, null, 'integer');
      } else {
        this.addElementColumn(element);
      }

      if (this.fullSchema && element.isAddressElement) {
        this.addElementColumn(element, 'sub_thoroughfare');
        this.addElementColumn(element, 'thoroughfare');
        this.addElementColumn(element, 'suite');
        this.addElementColumn(element, 'locality');
        this.addElementColumn(element, 'sub_admin_area');
        this.addElementColumn(element, 'admin_area');
        this.addElementColumn(element, 'postal_code');
        this.addElementColumn(element, 'country');
      }

      if (this.fullSchema && (element.isPhotoElement || element.isVideoElement || element.isAudioElement || element.isAttachmentElement)) {
        this.addElementColumn(element, 'captions', 'array');
        this.addElementColumn(element, 'urls', 'array');
      }

      if (this.fullSchema && element.isSignatureElement) {
        this.addElementColumn(element, 'timestamp');
      }
    }
  };

  _proto.findColumnByID = function findColumnByID(id) {
    return this.columns.find(function (e) {
      return e.id === id;
    });
  };

  _proto.columnForFieldKey = function columnForFieldKey(fieldKey, part) {
    if (part) {
      return this._columnsByKey[fieldKey + '_' + part];
    }

    return this._columnsByKey[fieldKey];
  };

  _createClass(FormFieldSchema, [{
    key: "geometryColumns",
    get: function get() {
      return this._columns.filter(function (c) {
        return c.isGeometry;
      });
    }
  }, {
    key: "columns",
    get: function get() {
      return this._columns;
    }
  }, {
    key: "allElements",
    get: function get() {
      if (!this._allElements) {
        this._allElements = this.container.flattenElements(false);
      }

      return this._allElements;
    }
  }, {
    key: "elementsForColumns",
    get: function get() {
      if (!this._elementsForColumns) {
        this._elementsForColumns = [];
        var elements = this.allElements;

        for (var _iterator2 = _createForOfIteratorHelperLoose(elements), _step2; !(_step2 = _iterator2()).done;) {
          var element = _step2.value;
          var skip = element.isSectionElement || element.isLabelElement;

          if (!skip) {
            this._elementsForColumns.push(element);
          }
        }
      }

      return this._elementsForColumns;
    }
  }]);

  return FormFieldSchema;
}();

exports["default"] = FormFieldSchema;
//# sourceMappingURL=form-field-schema.js.map