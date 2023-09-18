export namespace ConditionType {
    const And: string;
    const Or: string;
    const Not: string;
}
export class Condition {
    constructor(attrs: any, schema: any);
    _type: any;
    _schema: any;
    _expressions: any;
    set type(arg: any);
    get type(): any;
    get expressions(): any;
    addEmptyCondition(): void;
    removeCondition(condition: any): void;
    ensureEmptyExpression(): void;
    addEmptyExpression(): void;
    removeExpression(expression: any): void;
    toJSON(): {
        type: any;
        expressions: any;
    } | null;
    get allExpressions(): any[];
    toHumanDescription(topLevel?: boolean): string | null;
}
