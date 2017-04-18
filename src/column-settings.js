import arrayMove from 'array-move';
import ColumnSettingsItem from './column-settings-item';

export default class ColumnSettings {
  constructor(schema, settings) {
    this._schema = schema;

    this._columns = [];
    this._columnsByID = {};

    this._allColumns = [];

    const newColumns = [];

    const existingSettingsByID = {};

    if (settings) {
      for (const setting of settings) {
        existingSettingsByID[setting.column.id] = setting;
      }
    }

    const columns = schema.columns.slice();

    for (let index = 0; index < columns.length; ++index) {
      const column = columns[index];

      const existingAttributes = existingSettingsByID[column.id];

      const item = new ColumnSettingsItem({...existingAttributes, column}, this._schema);

      if (existingAttributes == null) {
        newColumns.push({column: item, index});
      }

      this._allColumns.push(item);
      this._columnsByID[column.id] = item;
    }

    if (settings) {
      for (const setting of settings) {
        const item = this._columnsByID[setting.column.id];

        if (item) {
          this._columns.push(item);
        }
      }
    }

    for (const newColumn of newColumns) {
      this._columns.splice(newColumn.index, 0, newColumn.column);
    }
  }

  reset() {
    this._columns = this._allColumns.slice();
    this._columns.map(o => o.clear());
  }

  toJSON() {
    return this.columns.map(o => o.toJSON());
  }

  move(from, to) {
    this._columns = arrayMove(this._columns, from, to);
  }

  get enabledColumns() {
    return this.enabledColumnSettings.map(c => c.column);
  }

  get enabledColumnSettings() {
    return this.columns.filter(c => c.isVisible);
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
