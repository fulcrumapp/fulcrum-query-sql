'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _repeatableSchema = require('./repeatable-schema');

var _repeatableSchema2 = _interopRequireDefault(_repeatableSchema);

var _formFieldSchema = require('./form-field-schema');

var _formFieldSchema2 = _interopRequireDefault(_formFieldSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var SYSTEM_COLUMNS = ['_record_id', '_project_id', '_assigned_to_id', '_status', '_latitude', '_longitude', '_created_at', '_updated_at', '_version', '_created_by_id', '_updated_by_id', '_server_created_at', '_server_updated_at', '_geometry', '_altitude', '_speed', '_course', '_horizontal_accuracy', '_vertical_accuracy', '_changeset_id', '_title', '_created_latitude', '_created_longitude', '_created_geometry', '_created_altitude', '_created_horizontal_accuracy', '_updated_latitude', '_updated_longitude', '_updated_geometry', '_updated_altitude', '_updated_horizontal_accuracy', '_created_duration', '_updated_duration', '_edited_duration'];

var FormSchema = function (_FormFieldSchema) {
  _inherits(FormSchema, _FormFieldSchema);

  function FormSchema(form, rawColumns, repeatableColumns, _ref) {
    var _ref$fullSchema = _ref.fullSchema,
        fullSchema = _ref$fullSchema === undefined ? false : _ref$fullSchema;

    _classCallCheck(this, FormSchema);

    var _this = _possibleConstructorReturn(this, _FormFieldSchema.call(this, { fullSchema: fullSchema }));

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

    _this.setupColumns();

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

      var childSchema = new _repeatableSchema2.default(_this, repeatable, repeatableColumns[repeatable.key], { fullSchema: fullSchema });

      _this.repeatableSchemas.push(childSchema);
      _this.repeatableSchemasByKey[repeatable.key] = childSchema;
    }
    return _this;
  }

  FormSchema.prototype.setupColumns = function setupColumns() {
    if (this.fullSchema) {
      this.addSystemColumn('Record ID', 'id', '_record_id');
    }

    if (this.form.statusField.isEnabled) {
      this.addRawElementColumn(this.form.statusField, this._rawColumnsByKey._status, '_status', 'string', null, '_status');
    }

    this.addSystemColumn('Version', 'version', '_version', 'integer');
    this.addSystemColumn('Created', 'createdAt', '_server_created_at', 'timestamp');
    this.addSystemColumn('Updated', 'updatedAt', '_server_updated_at', 'timestamp');
    this.addSystemColumn('Device Created', 'clientCreatedAt', '_created_at', 'timestamp');
    this.addSystemColumn('Device Updated', 'clientUpdatedAt', '_updated_at', 'timestamp');

    if (this.form.isProjectEnabled) {
      this.addSystemColumn('Project', 'project', '_project_id', 'string');
    }

    if (this.form.isAssignmentEnabled) {
      this.addSystemColumn('Assigned', 'assignedTo', '_assigned_to_id', 'string');
    }

    this.addSystemColumn('Created By', 'createdByName', '_created_by', 'string');
    this.addSystemColumn('Updated By', 'updatedByName', '_updated_by', 'string');

    if (this.fullSchema) {
      this.addSystemColumn('Geometry', 'geometryAsGeoJSON', '_geometry', 'geometry');
      this.addSystemColumn('Latitude', 'latitude', '_latitude', 'double');
      this.addSystemColumn('Longitude', 'longitude', '_longitude', 'double');

      this.addSystemColumn('Altitude', 'altitude', '_altitude', 'double');
      this.addSystemColumn('Accuracy', 'horizontalAccuracy', '_horizontal_accuracy', 'double');
      this.addSystemColumn('Changeset', 'changesetID', '_changeset_id', 'integer');

      this.addSystemColumn('Created Duration', 'createdDuration', '_created_duration', 'integer');
      this.addSystemColumn('Updated Duration', 'updatedDuration', '_updated_duration', 'integer');
      this.addSystemColumn('Edited Duration', 'editedDuration', '_edited_duration', 'integer');
    }

    this.setupElementColumns();
  };

  _createClass(FormSchema, [{
    key: 'tableName',
    get: function get() {
      return this.form.name.toLowerCase().replace(/ /g, '_');
    }
  }]);

  return FormSchema;
}(_formFieldSchema2.default);

exports.default = FormSchema;
//# sourceMappingURL=form-schema.js.map