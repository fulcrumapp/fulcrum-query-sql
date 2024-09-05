"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const array_move_1 = __importDefault(require("array-move"));
const column_settings_item_1 = __importDefault(require("./column-settings-item"));
class ColumnSettings {
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
            const item = new column_settings_item_1.default(Object.assign(Object.assign({}, existingAttributes), { column }), this._schema);
            if (existingAttributes == null) {
                item.hidden = true;
                newColumns.push({ column: item, index });
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
        this._columns = array_move_1.default(this._columns, from, to);
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
exports.default = ColumnSettings;
//# sourceMappingURL=column-settings.js.map