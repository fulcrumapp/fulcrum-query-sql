'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _elementColumn = require('./schema/element-column');

var _elementColumn2 = _interopRequireDefault(_elementColumn);

var _simpleColumn = require('./schema/simple-column');

var _simpleColumn2 = _interopRequireDefault(_simpleColumn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormFieldSchema = function () {
  function FormFieldSchema(_ref) {
    var _ref$fullSchema = _ref.fullSchema,
        fullSchema = _ref$fullSchema === undefined ? false : _ref$fullSchema;

    _classCallCheck(this, FormFieldSchema);

    this.fullSchema = fullSchema;
  }

  FormFieldSchema.prototype.addSystemColumn = function addSystemColumn(label, attribute, columnName, accessor) {
    var column = new _simpleColumn2.default({ name: label,
      attributeName: attribute,
      columnName: columnName,
      accessor: accessor });
    this._columns.push(column);
    this._columnsByKey[columnName] = column;
  };

  FormFieldSchema.prototype.addElementColumn = function addElementColumn(element, part) {
    var columnKey = part ? element.key + '_' + part : element.key;

    var rawColumn = this._rawColumnsByKey[columnKey];

    // if (column == null) {
    //   if the column is null, that means it's a materialized column
    //   throw new Error('Column not found for element ' + columnKey + Object.keys(this._rawColumnsByKey));
    // }

    this.addRawElementColumn(element, rawColumn, null, part, columnKey);
  };

  FormFieldSchema.prototype.addRawElementColumn = function addRawElementColumn(element, rawColumn, id, part, columnKey) {
    var columnObject = new _elementColumn2.default({ element: element, rawColumn: rawColumn, id: id, part: part });

    this._columns.push(columnObject);
    this._columnsByKey[columnKey] = columnObject;
  };

  FormFieldSchema.prototype.setupElementColumns = function setupElementColumns() {
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

      if (element.isHidden || element.hasHiddenParent) {
        continue;
      }

      this.addElementColumn(element);

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
        this.addElementColumn(element, 'captions');
        this.addElementColumn(element, 'urls');
      }

      if (this.fullSchema && element.isSignatureElement) {
        this.addElementColumn(element, 'timestamp');
      }
    }
  };

  FormFieldSchema.prototype.findColumnByID = function findColumnByID(id) {
    return this.columns.find(function (e) {
      return e.id === id;
    });
  };

  FormFieldSchema.prototype.columnForFieldKey = function columnForFieldKey(fieldKey, part) {
    if (part) {
      return this._columnsByKey[fieldKey + '_' + part];
    }

    return this._columnsByKey[fieldKey];
  };

  _createClass(FormFieldSchema, [{
    key: 'columns',
    get: function get() {
      return this._columns;
    }
  }, {
    key: 'allElements',
    get: function get() {
      if (!this._allElements) {
        this._allElements = this.container.flattenElements(false);
      }
      return this._allElements;
    }
  }, {
    key: 'elementsForColumns',
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

          var skip = element.isSectionElement || element.isRepeatableElement || element.isLabelElement || element.isHidden;

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

exports.default = FormFieldSchema;
//# sourceMappingURL=form-field-schema.js.map