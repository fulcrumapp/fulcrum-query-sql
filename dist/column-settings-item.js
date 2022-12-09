"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression");
const operator_1 = require("./operator");
const column_filter_1 = __importDefault(require("./column-filter"));
const column_summary_1 = __importDefault(require("./column-summary"));
class ColumnSettingsItem {
    constructor(attrs, schema) {
        this._schema = schema;
        this._hidden = !!attrs.hidden;
        this._column = attrs.column;
        this._search = attrs.search || '';
        this._filter = new column_filter_1.default(Object.assign(Object.assign({}, attrs.filter), { field: attrs.column.id }), this._schema);
        this._expression = new expression_1.Expression(Object.assign(Object.assign({}, attrs.expression), { field: attrs.column.id }), schema);
        this._range = new expression_1.Expression(Object.assign(Object.assign({}, attrs.range), { operator: attrs.column.isDate ? operator_1.OperatorType.DateBetween.name
                : operator_1.OperatorType.Between.name, field: attrs.column.id }), schema);
        this._summary = new column_summary_1.default(Object.assign(Object.assign({}, attrs.summary), { field: attrs.column.id }), this._schema);
    }
    clear() {
        this._search = '';
        this._filter = new column_filter_1.default({ field: this.column.id }, this._schema);
        this._expression = new expression_1.Expression({ field: this.column.id }, this._schema);
        this._range = new expression_1.Expression({ operator: this.column.isDate ? operator_1.OperatorType.DateBetween.name
                : operator_1.OperatorType.Between.name,
            field: this.column.id }, this._schema);
    }
    toJSON() {
        const json = {
            hidden: this.isHidden,
            column: this.column.toJSON()
        };
        if (this.search) {
            json.search = this.search;
        }
        if (this.filter.hasFilter) {
            json.filter = this.filter.toJSON();
        }
        if (this.expression.isValid) {
            json.expression = this.expression.toJSON();
        }
        if (this.range.isValid) {
            json.range = this.range.toJSON();
        }
        return json;
    }
    get hasFilter() {
        return (this._search || this._filter.hasFilter || this._expression.isValid || this._range.isValid);
    }
    get search() {
        return this._search;
    }
    set search(search) {
        this._search = search || '';
    }
    get column() {
        return this._column;
    }
    get filter() {
        return this._filter;
    }
    get summary() {
        return this._summary;
    }
    get isVisible() {
        return !this._hidden;
    }
    get isHidden() {
        return this._hidden;
    }
    set hidden(hidden) {
        this._hidden = !!hidden;
    }
    get expression() {
        return this._expression;
    }
    get range() {
        return this._range;
    }
}
exports.default = ColumnSettingsItem;
//# sourceMappingURL=column-settings-item.js.map