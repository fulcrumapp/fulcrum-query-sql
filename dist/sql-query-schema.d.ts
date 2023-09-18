export default class SQLQuerySchema extends FormFieldSchema {
    constructor(rawColumns: any, tableName: any);
    _tableName: any;
    _columns: any[];
    _rawColumns: any;
    _rawColumnsByKey: {};
    _columnsByKey: {};
    setupColumns(): void;
    get tableName(): any;
    get isSQL(): boolean;
}
import FormFieldSchema from './form-field-schema';
