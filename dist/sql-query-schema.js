"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const form_field_schema_1 = __importDefault(require("./form-field-schema"));
class SQLQuerySchema extends form_field_schema_1.default {
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
exports.default = SQLQuerySchema;
//# sourceMappingURL=sql-query-schema.js.map