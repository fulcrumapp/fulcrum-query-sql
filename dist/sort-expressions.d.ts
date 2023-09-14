export default class SortExpressions {
    constructor(sorts: any, schema: any);
    _expressions: any;
    _schema: any;
    sortByAsc(column: any): void;
    sortByDesc(column: any): void;
    get isEmpty(): boolean;
    get hasSort(): boolean;
    get expressions(): any;
    toJSON(): any;
    toHumanDescription(): any;
}
