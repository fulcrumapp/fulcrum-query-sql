export class Expression {
    constructor(attrs: any, schema: any);
    _field: any;
    _operator: any;
    _value: any;
    _options: QueryOptions;
    _schema: any;
    get isValid(): boolean;
    get supportsValue(): boolean;
    get hasValue(): boolean;
    get value(): any;
    get arrayValue(): any;
    set scalarValue(value: any);
    get scalarValue(): any;
    set value1(value: any);
    get value1(): any;
    set value2(value: any);
    get value2(): any;
    get isDateOperator(): {
        name: string;
        label: string;
    } | undefined;
    set operator(operator: any);
    get operator(): any;
    set field(field: any);
    get field(): any;
    set column(column: any);
    get column(): any;
    get columnName(): any;
    toggleValue(value: any): void;
    containsValue(value: any): boolean;
    toJSON(): {
        field: any;
        operator: any;
        value: any;
    } | null;
    isEqual(other: any): boolean;
    availableOperators(): any;
    set startDate(date: any);
    get startDate(): any;
    set endDate(date: any);
    get endDate(): any;
    set options(options: QueryOptions);
    get options(): QueryOptions;
    clearRangeValuesIfNull(): void;
    labelForValue(value: any, { separator }?: {}): any;
    toHumanDescription(): string | null;
}
import QueryOptions from './query-options';
