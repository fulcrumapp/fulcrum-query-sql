import arrayMove from 'array-move';
import ColumnSettingsItem from './column-settings-item';

export default class ColumnSettings {
  constructor(schema, settings) {
    this._schema = schema;

    this._columns = [];
    this._columnsByID = {};

    const existingSettingsByID = {};

    if (settings) {
      for (const setting of settings) {
        existingSettingsByID[setting.column.id] = setting;
      }
    }

    const columns = schema.columns.slice();

    for (const column of columns) {
      const existingAttributes = existingSettingsByID[column.id];

      const item = new ColumnSettingsItem({...existingAttributes, column}, this._schema);

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
