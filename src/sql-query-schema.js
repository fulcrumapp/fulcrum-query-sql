import FormFieldSchema from './form-field-schema';

export default class SQLQuerySchema extends FormFieldSchema {
  constructor(rawColumns, tableName) {
    super({});

    this._tableName = tableName || 'query';

    this._columns = [];
    this._rawColumns = rawColumns;

    this._rawColumnsByKey = {};
    this._columnsByKey = {};

    for (const column of rawColumns) {
      this._rawColumnsByKey[column.name] = column;
    }

    this.setupColumns();
  }

  setupColumns() {
    for (const column of this._rawColumns) {
      this.addSystemColumn(column.name, column.name, column.name, column.type, null, null, true);
    }
  }

  get tableName() {
    return this._tableName;
  }

  get isSQL() {
    return true;
  }
}
