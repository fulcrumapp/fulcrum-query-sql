import ElementColumn from './schema/element-column';
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
      const columnObject = new ElementColumn(this.form.statusField,
                                             this._rawColumnsByKey._status,
                                             '_status');

      this._columns.push(columnObject);

      this._columnsByKey._status = columnObject;
    }

    if (this.fullSchema) {
      this.addSystemColumn('Latitude', 'latitude', '_latitude');
      this.addSystemColumn('Longitude', 'longitude', '_longitude');

      this.addSystemColumn('Client Created', 'clientCreatedAt', '_created_at');
      this.addSystemColumn('Client Updated', 'clientUpdatedAt', '_updated_at');

      this.addSystemColumn('Altitude', 'altitude', '_altitude');
      this.addSystemColumn('Accuracy', 'horizontalAccuracy', '_accuracy');
      this.addSystemColumn('Changeset', 'changesetID', '_changeset_id');

      this.addSystemColumn('Created Duration', 'createdDuration', '_created_duration');
      this.addSystemColumn('Updated Duration', 'updatedDuration', '_updated_duration');
      this.addSystemColumn('Edited Duration', 'editedDuration', '_edited_duration');
    }

    this.addSystemColumn('Version', 'version', '_version');
    this.addSystemColumn('Created', 'createdAt', '_server_created_at');
    this.addSystemColumn('Updated', 'updatedAt', '_server_updated_at');
    this.addSystemColumn('Created By', 'createdByName', '_created_by');
    this.addSystemColumn('Updated By', 'updatedByName', '_updated_by');

    if (this.form.isAssignmentEnabled) {
      this.addSystemColumn('Assigned', 'assignedTo', '_assigned_to_id');
    }

    if (this.form.isProjectEnabled) {
      this.addSystemColumn('Project', 'project', '_project_id');
    }

    this.setupElementColumns();
  }

  get tableName() {
    return this.form.name.toLowerCase().replace(/ /g, '_');
  }
}
