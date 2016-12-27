import ElementColumn from './schema/element-column';
// import SimpleColumn from './schema/simple-column';
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
      this.addSystemColumn('Child ID', 'id', '_child_record_id');
      this.addSystemColumn('Record ID', 'id', '_record_id');
      this.addSystemColumn('Parent ID', 'id', '_parent_id');
    }

    if (this.form.statusField.isEnabled) {
      const columnObject = new ElementColumn(this.form.statusField,
                                             this._rawColumnsByKey._record_status,
                                             '_record_status');

      this._columns.push(columnObject);

      this._columnsByKey._record_status = columnObject;
    }

    if (this.fullSchema) {
      this.addSystemColumn('Latitude', 'latitude', '_latitude');
      this.addSystemColumn('Longitude', 'longitude', '_longitude');

      this.addSystemColumn('Changeset', 'changesetID', '_changeset_id');

      this.addSystemColumn('Created Duration', 'createdDuration', '_created_duration');
      this.addSystemColumn('Updated Duration', 'updatedDuration', '_updated_duration');
      this.addSystemColumn('Edited Duration', 'editedDuration', '_edited_duration');
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

    this.setupElementColumns();
  }

  get tableName() {
    return this.formSchema.tableName + '_' + this.repeatable.dataName;
  }
}
