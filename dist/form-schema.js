"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _repeatableSchema = _interopRequireDefault(require("./repeatable-schema"));

var _formFieldSchema = _interopRequireDefault(require("./form-field-schema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var SYSTEM_COLUMNS = ['_record_id', '_project_id', '_assigned_to_id', '_status', '_latitude', '_longitude', '_created_at', '_updated_at', '_version', '_created_by_id', '_updated_by_id', '_server_created_at', '_server_updated_at', '_geometry', '_altitude', '_speed', '_course', '_horizontal_accuracy', '_vertical_accuracy', '_changeset_id', '_title', '_created_latitude', '_created_longitude', '_created_geometry', '_created_altitude', '_created_horizontal_accuracy', '_updated_latitude', '_updated_longitude', '_updated_geometry', '_updated_altitude', '_updated_horizontal_accuracy', '_created_duration', '_updated_duration', '_edited_duration'];

var FormSchema =
/*#__PURE__*/
function (_FormFieldSchema) {
  _inheritsLoose(FormSchema, _FormFieldSchema);

  function FormSchema(form, rawColumns, repeatableColumns, _ref) {
    var _this;

    var _ref$fullSchema = _ref.fullSchema,
        fullSchema = _ref$fullSchema === void 0 ? false : _ref$fullSchema;
    _this = _FormFieldSchema.call(this, {
      fullSchema: fullSchema
    }) || this;
    _this.form = form;
    _this.container = form;
    _this._columns = [];
    _this._rawColumns = rawColumns;
    _this._rawColumnsByKey = {};
    _this._columnsByKey = {};

    for (var _iterator = rawColumns, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref2 = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref2 = _i.value;
      }

      var column = _ref2;

      if (SYSTEM_COLUMNS.indexOf(column.name) !== -1) {
        _this._rawColumnsByKey[column.name] = column;
      } else if (column.field) {
        var key = column.part ? column.field + '_' + column.part : column.field;
        _this._rawColumnsByKey[key] = column;
      }
    }

    _this.repeatableSchemas = [];
    _this.repeatableSchemasByKey = {};

    var repeatables = _this.form.elementsOfType('Repeatable');

    for (var _iterator2 = repeatables, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref3 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref3 = _i2.value;
      }

      var repeatable = _ref3;
      var childSchema = new _repeatableSchema["default"](_assertThisInitialized(_this), repeatable, repeatableColumns[repeatable.key], {
        fullSchema: fullSchema
      });

      _this.repeatableSchemas.push(childSchema);

      _this.repeatableSchemasByKey[repeatable.key] = childSchema;
    }

    _this.setupColumns();

    return _this;
  }

  var _proto = FormSchema.prototype;

  _proto.hasRecordKey = function hasRecordKey() {
    var hasColumn = false;

    for (var _iterator3 = this._rawColumns, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref4;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref4 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref4 = _i3.value;
      }

      var column = _ref4;

      if (column.name == 'record_key') {
        hasColumn = true;
        break;
      }
    }

    return hasColumn;
  };

  _proto.setupColumns = function setupColumns() {
    if (this.fullSchema) {
      this.addSystemColumn('Record ID', 'id', '_record_id');
    }

    if (this.form.statusField.isEnabled) {
      this.addRawElementColumn(this.form.statusField, this._rawColumnsByKey._status, '_status', 'string', null, '_status');
    }

    this.addSystemColumn('Title', 'displayValue', '_title', 'string');
    this.addSystemColumn('Version', 'version', '_version', 'integer');
    this.addSystemColumn('Created', 'createdAt', '_server_created_at', 'timestamp');
    this.addSystemColumn('Updated', 'updatedAt', '_server_updated_at', 'timestamp');
    this.addSystemColumn('Device Created', 'clientCreatedAt', '_created_at', 'timestamp');
    this.addSystemColumn('Device Updated', 'clientUpdatedAt', '_updated_at', 'timestamp');

    if (this.form.isProjectEnabled) {
      this.projectColumn = this.addSystemColumn('Project', 'projectName', 'project.name', 'string', null, {
        tableName: 'projects',
        alias: 'project',
        sourceColumn: '_project_id',
        joinColumn: 'project_id'
      });
    }

    if (this.form.isAssignmentEnabled) {
      this.assignedToColumn = this.addSystemColumn('Assigned', 'assignedToName', 'assigned_to.name', 'string', null, {
        tableName: 'memberships',
        alias: 'assigned_to',
        sourceColumn: '_assigned_to_id',
        joinColumn: 'user_id'
      });
    }

    this.createdByColumn = this.addSystemColumn('Created By', 'createdByName', 'created_by.name', 'string', null, {
      tableName: 'memberships',
      alias: 'created_by',
      sourceColumn: '_created_by_id',
      joinColumn: 'user_id'
    });
    this.updatedByColumn = this.addSystemColumn('Updated By', 'updatedByName', 'updated_by.name', 'string', null, {
      tableName: 'memberships',
      alias: 'updated_by',
      sourceColumn: '_updated_by_id',
      joinColumn: 'user_id'
    });

    if (this.fullSchema) {
      this.addSystemColumn('Geometry', 'geometryAsGeoJSON', '_geometry', 'geometry');
      this.addSystemColumn('Latitude', 'latitude', '_latitude', 'double');
      this.addSystemColumn('Longitude', 'longitude', '_longitude', 'double');
      this.addSystemColumn('Altitude', 'altitude', '_altitude', 'double');
      this.addSystemColumn('Accuracy', 'horizontalAccuracy', '_horizontal_accuracy', 'double');
      this.addSystemColumn('Changeset', 'changesetID', '_changeset_id', 'string');
      this.addSystemColumn('Created Duration', 'createdDuration', '_created_duration', 'integer');
      this.addSystemColumn('Updated Duration', 'updatedDuration', '_updated_duration', 'integer');
      this.addSystemColumn('Edited Duration', 'editedDuration', '_edited_duration', 'integer');
    }

    if (hasRecordKey()) {
      this.addSystemColumn('Record Key', 'recordKey', '_record_key', 'string');
      this.addSystemColumn('Record Sequence', 'recordSequence', '_record_sequence', 'integer');
    }

    this.setupElementColumns();
  };

  _createClass(FormSchema, [{
    key: "tableName",
    get: function get() {
      return this.form.name.toLowerCase().replace(/ /g, '_');
    }
  }, {
    key: "tableNameWithoutPrefix",
    get: function get() {
      return this.tableName;
    }
  }]);

  return FormSchema;
}(_formFieldSchema["default"]);

exports["default"] = FormSchema;
//# sourceMappingURL=form-schema.js.map