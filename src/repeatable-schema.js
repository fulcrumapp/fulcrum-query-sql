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
      this.addSystemColumn('Child Record ID', 'id', '_child_record_id', 'string');

      this.addSystemColumn('Record ID', null, '_record_id', 'string', (feature, options) => {
        if (feature.recordID) {
          return feature.recordID;
        }

        return options && options.record && options.record.id;
      });

      this.addSystemColumn('Parent ID', null, '_parent_id', 'string', (feature, options) => {
        if (feature.parentID) {
          return feature.parentID;
        }

        return options && options.parent && options.parent.id;
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

    this.addSystemColumn('Title', 'displayValue', '_title', 'string');
    this.addSystemColumn('Version', 'version', '_version', 'integer');
    this.addSystemColumn('Device Created', 'createdAt', '_created_at', 'timestamp');
    this.addSystemColumn('Device Updated', 'updatedAt', '_updated_at', 'timestamp');

    if (this.formSchema.form.isProjectEnabled) {
      this.projectColumn = this.addSystemColumn('Project',
                                                'recordProjectName',
                                                'record_project.name',
                                                'string',
                                                null,
                                                {tableName: 'projects',
                                                 alias: 'record_project',
                                                 sourceColumn: '_record_project_id',
                                                 joinColumn: 'project_id'});
    }

    if (this.formSchema.form.isAssignmentEnabled) {
      this.assignedToColumn = this.addSystemColumn('Assigned',
                                                   'recordAssignedToName',
                                                   'record_assigned_to.name',
                                                   'string',
                                                   null,
                                                   {tableName: 'memberships',
                                                    alias: 'record_assigned_to',
                                                    sourceColumn: '_record_assigned_to_id',
                                                    joinColumn: 'user_id'});
    }

    this.createdByColumn = this.addSystemColumn('Created By',
                                                'createdByName',
                                                'created_by.name',
                                                'string',
                                                null,
                                                {tableName: 'memberships',
                                                 alias: 'created_by',
                                                 sourceColumn: '_created_by_id',
                                                 joinColumn: 'user_id'});

    this.updatedByColumn = this.addSystemColumn('Updated By',
                                                'updatedByName',
                                                'updated_by.name',
                                                'string',
                                                null,
                                                {tableName: 'memberships',
                                                 alias: 'updated_by',
                                                 sourceColumn: '_updated_by_id',
                                                 joinColumn: 'user_id'});

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
  }

  get tableName() {
    return this.formSchema.tableName + '_' + this.repeatable.dataName;
  }
}
