"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _repeatableSchema = _interopRequireDefault(require("./repeatable-schema"));

var _formFieldSchema = _interopRequireDefault(require("./form-field-schema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SYSTEM_COLUMNS = ['_record_id', '_project_id', '_assigned_to_id', '_status', '_latitude', '_longitude', '_created_at', '_updated_at', '_version', '_created_by_id', '_updated_by_id', '_server_created_at', '_server_updated_at', '_geometry', '_altitude', '_speed', '_course', '_horizontal_accuracy', '_vertical_accuracy', '_changeset_id', '_title', '_created_latitude', '_created_longitude', '_created_geometry', '_created_altitude', '_created_horizontal_accuracy', '_updated_latitude', '_updated_longitude', '_updated_geometry', '_updated_altitude', '_updated_horizontal_accuracy', '_created_duration', '_updated_duration', '_edited_duration'];

var FormSchema = /*#__PURE__*/function (_FormFieldSchema) {
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

    for (var _iterator = _createForOfIteratorHelperLoose(rawColumns), _step; !(_step = _iterator()).done;) {
      var column = _step.value;

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

    for (var _iterator2 = _createForOfIteratorHelperLoose(repeatables), _step2; !(_step2 = _iterator2()).done;) {
      var repeatable = _step2.value;
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