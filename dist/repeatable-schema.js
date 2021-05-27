"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _formFieldSchema = _interopRequireDefault(require("./form-field-schema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var SYSTEM_COLUMNS = ['_child_record_id', '_record_id', '_parent_id', '_record_project_id', '_record_assigned_to_id', '_record_status', '_index', '_latitude', '_longitude', '_created_at', '_updated_at', '_version', '_created_by_id', '_updated_by_id', '_server_created_at', '_server_updated_at', '_geometry', '_changeset_id', '_title', '_created_latitude', '_created_longitude', '_created_geometry', '_created_altitude', '_created_horizontal_accuracy', '_updated_latitude', '_updated_longitude', '_updated_geometry', '_updated_altitude', '_updated_horizontal_accuracy', '_created_duration', '_updated_duration', '_edited_duration'];

var RepeatableSchema =
/*#__PURE__*/
function (_FormFieldSchema) {
  _inheritsLoose(RepeatableSchema, _FormFieldSchema);

  function RepeatableSchema(formSchema, repeatable, rawColumns, _ref) {
    var _this;

    var _ref$fullSchema = _ref.fullSchema,
        fullSchema = _ref$fullSchema === void 0 ? false : _ref$fullSchema;
    _this = _FormFieldSchema.call(this, {
      fullSchema: fullSchema
    }) || this;
    _this.formSchema = formSchema;
    _this.repeatable = repeatable;
    _this.container = repeatable;
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

    _this.setupColumns();

    return _this;
  }

  var _proto = RepeatableSchema.prototype;

  _proto.setupColumns = function setupColumns() {
    if (this.fullSchema) {
      this.addSystemColumn('Child Record ID', 'id', '_child_record_id', 'string');
      this.addSystemColumn('Record ID', null, '_record_id', 'string', function (feature, options) {
        if (feature.recordID) {
          return feature.recordID;
        }

        return options && options.record && options.record.id;
      });
      this.addSystemColumn('Parent ID', null, '_parent_id', 'string', function (feature, options) {
        if (feature.parentID) {
          return feature.parentID;
        }

        return options && options.parent && options.parent.id;
      });
    }

    if (this.formSchema.form.statusField.isEnabled) {
      this.addRawElementColumn(this.formSchema.form.statusField, this._rawColumnsByKey._record_status, '_record_status', 'string', null, '_record_status');
    }

    this.addSystemColumn('Title', 'displayValue', '_title', 'string');
    this.addSystemColumn('Version', 'version', '_version', 'integer');
    this.addSystemColumn('Device Created', 'createdAt', '_created_at', 'timestamp');
    this.addSystemColumn('Device Updated', 'updatedAt', '_updated_at', 'timestamp');

    if (this.formSchema.form.isProjectEnabled) {
      this.projectColumn = this.addSystemColumn('Project', 'recordProjectName', 'record_project.name', 'string', null, {
        tableName: 'projects',
        alias: 'record_project',
        sourceColumn: '_record_project_id',
        joinColumn: 'project_id'
      });
    }

    if (this.formSchema.form.isAssignmentEnabled) {
      this.assignedToColumn = this.addSystemColumn('Assigned', 'recordAssignedToName', 'record_assigned_to.name', 'string', null, {
        tableName: 'memberships',
        alias: 'record_assigned_to',
        sourceColumn: '_record_assigned_to_id',
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
      this.addSystemColumn('Item Index', 'index', '_index', 'integer');
      this.addSystemColumn('Geometry', 'geometryAsGeoJSON', '_geometry', 'geometry');
      this.addSystemColumn('Latitude', 'latitude', '_latitude', 'double');
      this.addSystemColumn('Longitude', 'longitude', '_longitude', 'double');
      this.addSystemColumn('Changeset', 'changesetID', '_changeset_id', 'string');
      this.addSystemColumn('Created Duration', 'createdDuration', '_created_duration', 'integer');
      this.addSystemColumn('Updated Duration', 'updatedDuration', '_updated_duration', 'integer');
      this.addSystemColumn('Edited Duration', 'editedDuration', '_edited_duration', 'integer');
    }

    this.setupElementColumns();
  };

  _createClass(RepeatableSchema, [{
    key: "tableName",
    get: function get() {
      return this.formSchema.tableName + '_' + this.repeatable.dataName;
    }
  }, {
    key: "tableNameWithoutPrefix",
    get: function get() {
      return this.repeatable.dataName;
    }
  }]);

  return RepeatableSchema;
}(_formFieldSchema["default"]);

exports["default"] = RepeatableSchema;
//# sourceMappingURL=repeatable-schema.js.map