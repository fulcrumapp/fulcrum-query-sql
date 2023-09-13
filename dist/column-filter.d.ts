export default class ColumnFilter {
    constructor(attrs: any, schema: any);
    _field: any;
    _value: any;
    _schema: any;
    get value(): any;
    get isNull(): boolean;
    get hasFilter(): boolean;
    get hasValues(): boolean;
    get isEmptySet(): boolean;
    get field(): any;
    get column(): any;
    get columnName(): any;
    reset(): void;
    resetIfEmpty(): void;
    clearValues(): void;
    ensureValue(value: any): void;
    toggleValue(value: any): void;
    containsValue(value: any): boolean;
    toJSON(): {
        field: any;
        value: any;
    } | null;
    toHumanDescription(): string | null;
}
