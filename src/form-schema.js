import RepeatableSchema from './repeatable-schema';
import FormFieldSchema from './form-field-schema';

const SYSTEM_COLUMNS = [
  '_record_id',
  '_project_id',
  '_assigned_to_id',
  '_status',
  '_latitude',
  '_longitude',
  '_created_at',
  '_updated_at',
  '_version',
  '_created_by_id',
  '_updated_by_id',
  '_server_created_at',
  '_server_updated_at',
  '_geometry',
  '_altitude',
  '_speed',
  '_course',
  '_horizontal_accuracy',
  '_vertical_accuracy',
  '_changeset_id',
  '_title',
  '_created_latitude',
  '_created_longitude',
  '_created_geometry',
  '_created_altitude',
  '_created_horizontal_accuracy',
  '_updated_latitude',
  '_updated_longitude',
  '_updated_geometry',
  '_updated_altitude',
  '_updated_horizontal_accuracy',
  '_created_duration',
  '_updated_duration',
  '_edited_duration'
];

export default class FormSchema extends FormFieldSchema {
  constructor(form, rawColumns, repeatableColumns, {fullSchema = false}) {
    super({fullSchema});

    this.form = form;
    this.container = form;

    this._columns = [];
    this._rawColumns = rawColumns;

    this._rawColumnsByKey = {};
    this._columnsByKey = {};

    for (const column of rawColumns) {
      if (SYSTEM_COLUMNS.indexOf(column.name) !== -1) {
        this._rawColumnsByKey[column.name] = column;
      } else if (column.field) {
        const key = column.part ? column.field + '_' + column.part : column.field;
        this._rawColumnsByKey[key] = column;
      }
    }

    this.setupColumns();

    this.repeatableSchemas = [];
    this.repeatableSchemasByKey = {};

    const repeatables = this.form.elementsOfType('Repeatable');

    for (const repeatable of repeatables) {
      const childSchema = new RepeatableSchema(this, repeatable, repeatableColumns[repeatable.key], {fullSchema});

      this.repeatableSchemas.push(childSchema);
      this.repeatableSchemasByKey[repeatable.key] = childSchema;
    }
  }

  setupColumns() {
    if (this.fullSchema) {
      this.addSystemColumn('Record ID', 'id', '_record_id');
    }

    if (this.form.statusField.isEnabled) {
      this.addRawElementColumn(this.form.statusField,
                               this._rawColumnsByKey._status,
                               '_status',
                               'string',
                               null,
                               '_status');
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
  }

  get tableName() {
    return this.form.name.toLowerCase().replace(/ /g, '_');
  }
}
