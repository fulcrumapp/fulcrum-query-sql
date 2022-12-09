"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sort_1 = require("./sort");
class SortExpressions {
    constructor(sorts, schema) {
        sorts = sorts || [];
        this._expressions = sorts.map(o => new sort_1.Sort(o, schema));
        this._schema = schema;
    }
    sortByAsc(column) {
        this._expressions = [new sort_1.Sort({ field: column.id, direction: 'asc' }, this._schema)];
    }
    sortByDesc(column) {
        this._expressions = [new sort_1.Sort({ field: column.id, direction: 'desc' }, this._schema)];
    }
    get isEmpty() {
        return this._expressions.find(e => e.isValid) == null;
    }
    get hasSort() {
        return !this.isEmpty;
    }
    get expressions() {
        return this._expressions;
    }
    toJSON() {
        return this.expressions.map(o => o.toJSON());
    }
    toHumanDescription() {
        if (!this.hasSort) {
            return null;
        }
        return this.expressions.map(o => o.toHumanDescription()).join(', ');
    }
}
exports.default = SortExpressions;
//# sourceMappingURL=sort-expressions.js.map