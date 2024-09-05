export default class RepeatableSchema extends FormFieldSchema {
    constructor(formSchema: any, repeatable: any, rawColumns: any, { fullSchema }: {
        fullSchema?: boolean | undefined;
    });
    formSchema: any;
    repeatable: any;
    container: any;
    _columns: any[];
    _rawColumns: any;
    _rawColumnsByKey: {};
    _columnsByKey: {};
    setupColumns(): void;
    projectColumn: import(".").SimpleColumn | undefined;
    assignedToColumn: import(".").SimpleColumn | undefined;
    createdByColumn: import(".").SimpleColumn | undefined;
    updatedByColumn: import(".").SimpleColumn | undefined;
    recordSeriesColumn: import(".").SimpleColumn | undefined;
    get tableName(): string;
    get tableNameWithoutPrefix(): any;
}
import FormFieldSchema from './form-field-schema';
