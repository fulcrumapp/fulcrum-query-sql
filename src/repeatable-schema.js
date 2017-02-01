import FormFieldSchema from './form-field-schema';

const SYSTEM_COLUMNS = [
  '_child_record_id',
  '_record_id',
  '_parent_id',
  '_record_project_id',
  '_record_assigned_to_id',
  '_record_status',
  '_index',
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

export default class RepeatableSchema extends FormFieldSchema {
  constructor(formSchema, repeatable, rawColumns, {fullSchema = false}) {
    super({fullSchema});

    this.formSchema = formSchema;
    this.repeatable = repeatable;
    this.container = repeatable;

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
  }

  setupColumns() {
    if (this.fullSchema) {
      this.addSystemColumn('Child ID', 'id', '_child_record_id', 'string');

      this.addSystemColumn('Record ID', null, '_record_id', 'string', (feature, options) => {
        return options.record.id;
      });

      this.addSystemColumn('Parent ID', null, '_parent_id', 'string', (feature, options) => {
        return options.parent.id;
      });
    }

    if (this.formSchema.form.statusField.isEnabled) {
      this.addRawElementColumn(this.formSchema.form.statusField,
                               this._rawColumnsByKey._record_status,
                               '_record_status',
                               'string',
                               null,
                               '_record_status');
    }

    if (this.fullSchema) {
      this.addSystemColumn('Geometry', 'geometryAsGeoJSON', '_geometry', 'geometry');
      this.addSystemColumn('Latitude', 'latitude', '_latitude', 'double');
      this.addSystemColumn('Longitude', 'longitude', '_longitude', 'double');

      this.addSystemColumn('Changeset', 'changesetID', '_changeset_id', 'string');

      this.addSystemColumn('Created Duration', 'createdDuration', '_created_duration', 'integer');
      this.addSystemColumn('Updated Duration', 'updatedDuration', '_updated_duration', 'integer');
      this.addSystemColumn('Edited Duration', 'editedDuration', '_edited_duration', 'integer');
    }

    this.addSystemColumn('Version', 'version', '_version', 'integer');
    this.addSystemColumn('Created', 'createdAt', '_server_created_at', 'timestamp');
    this.addSystemColumn('Updated', 'updatedAt', '_server_updated_at', 'timestamp');
    this.addSystemColumn('Created By', 'createdBy', '_created_by_id', 'string');
    this.addSystemColumn('Updated By', 'updatedBy', '_updated_by_id', 'string');

    // if (this.form.isAssignmentEnabled) {
    //   this.addSystemColumn('Assigned', 'assignedTo', '_assigned_to_id');
    // }

    // if (this.form.isProjectEnabled) {
    //   this.addSystemColumn('Project', 'project', '_project_id');
    // }

    this.setupElementColumns();
  }

  get tableName() {
    return this.formSchema.tableName + '_' + this.repeatable.dataName;
  }
}
