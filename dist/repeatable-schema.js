'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _elementColumn = require('./schema/element-column');

var _elementColumn2 = _interopRequireDefault(_elementColumn);

var _simpleColumn = require('./schema/simple-column');

var _simpleColumn2 = _interopRequireDefault(_simpleColumn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SYSTEM_COLUMNS = ['_child_record_id', '_record_id', '_parent_id', '_record_project_id', '_record_assigned_to_id', '_record_status', '_index', '_latitude', '_longitude', '_created_at', '_updated_at', '_version', '_created_by_id', '_updated_by_id', '_server_created_at', '_server_updated_at', '_geometry', '_changeset_id', '_title', '_created_latitude', '_created_longitude', '_created_geometry', '_created_altitude', '_created_horizontal_accuracy', '_updated_latitude', '_updated_longitude', '_updated_geometry', '_updated_altitude', '_updated_horizontal_accuracy', '_created_duration', '_updated_duration', '_edited_duration'];

var RepeatableSchema = function () {
  function RepeatableSchema(form, repeatable, rawColumns) {
    _classCallCheck(this, RepeatableSchema);

    this.form = this.form;
    this.repeatable = repeatable;

    this._columns = [];
    this._rawColumns = rawColumns;

    this._rawColumnsByKey = {};
    this._columnsByKey = {};

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

      if (SYSTEM_COLUMNS.indexOf(column.name) !== -1) {
        this._rawColumnsByKey[column.name] = column;
      } else if (column.field) {
        this._rawColumnsByKey[column.field] = column;
      }
    }

    this.setupColumns();
  }

  RepeatableSchema.prototype.addSystemColumn = function addSystemColumn(label, attribute, columnName) {
    var column = new _simpleColumn2.default(label, attribute, columnName);
    this._columns.push(column);
    this._columnsByKey[columnName] = column;
  };

  RepeatableSchema.prototype.setupColumns = function setupColumns() {
    if (this.form.statusField.isEnabled) {
      var columnObject = new _elementColumn2.default(this.form.statusField, this._rawColumnsByKey._status, '_status');

      this._columns.push(columnObject);

      this._columnsByKey._status = columnObject;
    }

    this.addSystemColumn('Version', 'version', '_version');
    this.addSystemColumn('Created', 'createdAt', '_server_created_at');
    this.addSystemColumn('Updated', 'updatedAt', '_server_updated_at');
    this.addSystemColumn('Created By', 'createdBy', '_created_by_id');
    this.addSystemColumn('Updated By', 'updatedBy', '_updated_by_id');

    // if (this.form.isAssignmentEnabled) {
    //   this.addSystemColumn('Assigned', 'assignedTo', '_assigned_to_id');
    // }

    // if (this.form.isProjectEnabled) {
    //   this.addSystemColumn('Project', 'project', '_project_id');
    // }

    for (var _iterator2 = this.elementsForColumns, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var element = _ref2;

      if (element.isHidden || element.hasHiddenParent) {
        continue;
      }

      var column = this._rawColumnsByKey[element.key];

      if (column == null) {
        throw new Error('Column not found for element ' + element.key);
      }

      var _columnObject = new _elementColumn2.default(element, column);

      this._columns.push(_columnObject);

      this._columnsByKey[element.key] = _columnObject;
    }
  };

  RepeatableSchema.prototype.findColumnByID = function findColumnByID(id) {
    return this.columns.find(function (e) {
      return e.id === id;
    });
  };

  RepeatableSchema.prototype.columnForFieldKey = function columnForFieldKey(fieldKey) {
    return this._columnsByKey[fieldKey];
  };

  _createClass(RepeatableSchema, [{
    key: 'columns',
    get: function get() {
      return this._columns;
    }
  }, {
    key: 'allElements',
    get: function get() {
      if (!this._allElements) {
        this._allElements = this.form.flattenElements(false);
      }
      return this._allElements;
    }
  }, {
    key: 'elementsForColumns',
    get: function get() {
      if (!this._elementsForColumns) {
        this._elementsForColumns = [];

        var elements = this.allElements;

        for (var _iterator3 = elements, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
          var _ref3;

          if (_isArray3) {
            if (_i3 >= _iterator3.length) break;
            _ref3 = _iterator3[_i3++];
          } else {
            _i3 = _iterator3.next();
            if (_i3.done) break;
            _ref3 = _i3.value;
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

  return RepeatableSchema;
}();

exports.default = RepeatableSchema;
//# sourceMappingURL=repeatable-schema.js.map