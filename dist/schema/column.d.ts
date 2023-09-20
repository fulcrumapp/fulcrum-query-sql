export default class Column {
    get isArray(): boolean;
    get isDate(): boolean;
    get isDateOnly(): boolean;
    get isTime(): boolean;
    get isDateTime(): boolean;
    get isNumber(): boolean;
    get isDouble(): boolean;
    get isInteger(): boolean;
    get isGeometry(): boolean;
    get supportsRanges(): boolean;
    get canSearch(): boolean;
    get isSortable(): boolean;
    toJSON(): {
        id: any;
    };
    get index(): any;
}
