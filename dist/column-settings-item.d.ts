export default class ColumnSettingsItem {
    constructor(attrs: any, schema: any);
    _schema: any;
    _hidden: boolean;
    _column: any;
    _search: any;
    _filter: ColumnFilter;
    _expression: Expression;
    _range: Expression;
    _summary: ColumnSummary;
    clear(): void;
    toJSON(): {
        hidden: boolean;
        column: any;
    };
    get hasFilter(): any;
    set search(arg: any);
    get search(): any;
    get column(): any;
    get filter(): ColumnFilter;
    get summary(): ColumnSummary;
    get isVisible(): boolean;
    get isHidden(): boolean;
    set hidden(arg: any);
    get expression(): Expression;
    get range(): Expression;
}
import ColumnFilter from './column-filter';
import { Expression } from './expression';
import ColumnSummary from './column-summary';
