export default class FormSchema extends FormFieldSchema {
    constructor(form: any, rawColumns: any, repeatableColumns: any, { fullSchema }: {
        fullSchema?: boolean | undefined;
    });
    form: any;
    container: any;
    _columns: any[];
    _rawColumns: any;
    _rawColumnsByKey: {};
    _columnsByKey: {};
    repeatableSchemas: RepeatableSchema[];
    repeatableSchemasByKey: {};
    hasRecordKey(): boolean;
    get hasRecordSeriesID(): boolean;
    setupColumns(): void;
    projectColumn: import(".").SimpleColumn | undefined;
    assignedToColumn: import(".").SimpleColumn | undefined;
    createdByColumn: import(".").SimpleColumn | undefined;
    updatedByColumn: import(".").SimpleColumn | undefined;
    recordSeriesColumn: import(".").SimpleColumn | undefined;
    get tableName(): any;
    get tableNameWithoutPrefix(): any;
}
import FormFieldSchema from './form-field-schema';
import RepeatableSchema from './repeatable-schema';
