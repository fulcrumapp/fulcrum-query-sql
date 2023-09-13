export default class ColumnSummary {
    constructor(attrs: any, schema: any);
    _field: any;
    _aggregate: any;
    _schema: any;
    get field(): any;
    get column(): any;
    get columnName(): any;
    set aggregate(arg: any);
    get aggregate(): any;
    availableAggregates(): any[];
}
