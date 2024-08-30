export default class SimpleColumn extends Column {
    constructor({ name, attributeName, columnName, type, accessor, join, sql, index }: {
        name: any;
        attributeName: any;
        columnName: any;
        type?: any;
        accessor?: any;
        join?: any;
        sql?: any;
        index: any;
    });
    _type: any;
    _name: any;
    _attributeName: any;
    _columnName: any;
    _accessor: any;
    _sql: boolean;
    _index: any;
    _join: Join | undefined;
    get type(): any;
    get id(): any;
    get name(): any;
    get join(): Join | undefined;
    get source(): any;
    get joinedColumnName(): any;
    get columnName(): any;
    get attributeName(): any;
    defaultAccessor: (object: any) => any;
    valueFrom(object: any): any;
    exportValue(object: any, options?: {}): any;
    get isSQL(): boolean;
}
import Column from "./column";
import Join from "./join";
