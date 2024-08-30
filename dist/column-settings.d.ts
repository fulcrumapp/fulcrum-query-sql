export default class ColumnSettings {
    constructor(schema: any, settings: any);
    _schema: any;
    _columns: any[];
    _columnsByID: {};
    _allColumns: ColumnSettingsItem[];
    reset(): void;
    toJSON(): any[];
    move(from: any, to: any): void;
    get enabledColumns(): any[];
    get enabledColumnSettings(): any[];
    get columns(): any[];
    get columnsByID(): {};
    byColumn(column: any): any;
}
import ColumnSettingsItem from "./column-settings-item";
