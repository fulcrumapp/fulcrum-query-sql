import arrayMove from 'array-move';
import ColumnSettingsItem from './column-settings-item';

export default class ColumnSettings {
  constructor(schema) {
    this._schema = schema;

    this._columns = [];
    this._columnsByID = {};

    const columns = schema.columns.slice();

    for (const column of columns) {
      const item = new ColumnSettingsItem({column}, this._schema);

      this._columns.push(item);
      this._columnsByID[column.id] = item;
    }
  }

  reset() {
    this._columns.map(o => o.clear());
  }

  toJSON() {
    return this.columns.map(o => o.toJSON());
  }

  move(from, to) {
    this._columns = arrayMove(this._columns, from, to);
  }

  get enabledColumns() {
    return this.columns.filter(c => c.isVisible).map(c => c.column);
  }

  get columns() {
    return this._columns;
  }

  get columnsByID() {
    return this._columnsByID;
  }

  byColumn(column) {
    return this._columnsByID[column.id];
  }
}
