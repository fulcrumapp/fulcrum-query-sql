"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _elementColumn = _interopRequireDefault(require("./schema/element-column"));

var _simpleColumn = _interopRequireDefault(require("./schema/simple-column"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FormFieldSchema =
/*#__PURE__*/
function () {
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
    for (var _iterator = this.elementsForColumns, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref2 = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref2 = _i.value;
      }

      var element = _ref2;

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

      if (this.fullSchema && (element.isPhotoElement || element.isVideoElement || element.isAudioElement)) {
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

        for (var _iterator2 = elements, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
          var _ref3;

          if (_isArray2) {
            if (_i2 >= _iterator2.length) break;
            _ref3 = _iterator2[_i2++];
          } else {
            _i2 = _iterator2.next();
            if (_i2.done) break;
            _ref3 = _i2.value;
          }

          var element = _ref3;
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