import ElementColumn from './schema/element-column';
import SimpleColumn from './schema/simple-column';

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

export default class RepeatableSchema {
  constructor(form, repeatable, rawColumns) {
    this.form = this.form;
    this.repeatable = repeatable;

    this._columns = [];
    this._rawColumns = rawColumns;

    this._rawColumnsByKey = {};
    this._columnsByKey = {};

    for (const column of rawColumns) {
      if (SYSTEM_COLUMNS.indexOf(column.name) !== -1) {
        this._rawColumnsByKey[column.name] = column;
      } else if (column.field) {
        this._rawColumnsByKey[column.field] = column;
      }
    }

    this.setupColumns();
  }

  addSystemColumn(label, attribute, columnName) {
    const column = new SimpleColumn(label, attribute, columnName);
    this._columns.push(column);
    this._columnsByKey[columnName] = column;
  }

  setupColumns() {
    if (this.form.statusField.isEnabled) {
      const columnObject = new ElementColumn(this.form.statusField,
                                             this._rawColumnsByKey._status,
                                             '_status');

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

    for (const element of this.elementsForColumns) {
      if (element.isHidden || element.hasHiddenParent) {
        continue;
      }

      const column = this._rawColumnsByKey[element.key];

      if (column == null) {
        throw new Error('Column not found for element ' + element.key);
      }

      const columnObject = new ElementColumn(element, column);

      this._columns.push(columnObject);

      this._columnsByKey[element.key] = columnObject;
    }
  }

  findColumnByID(id) {
    return this.columns.find(e => e.id === id);
  }

  columnForFieldKey(fieldKey) {
    return this._columnsByKey[fieldKey];
  }

  get columns() {
    return this._columns;
  }

  get allElements() {
    if (!this._allElements) {
      this._allElements = this.form.flattenElements(false);
    }
    return this._allElements;
  }

  get elementsForColumns() {
    if (!this._elementsForColumns) {
      this._elementsForColumns = [];

      const elements = this.allElements;

      for (const element of elements) {
        const skip = element.isSectionElement ||
                     element.isRepeatableElement ||
                     element.isLabelElement ||
                     element.isHidden;

        if (!skip) {
          this._elementsForColumns.push(element);
        }
      }
    }

    return this._elementsForColumns;
  }
}
