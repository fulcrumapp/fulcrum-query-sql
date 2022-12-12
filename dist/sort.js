"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sort = exports.DIRECTIONS = exports.DIRECTION_DESC = exports.DIRECTION_ASC = void 0;
exports.DIRECTION_ASC = 'asc';
exports.DIRECTION_DESC = 'desc';
exports.DIRECTIONS = {
    Asc: exports.DIRECTION_ASC,
    Desc: exports.DIRECTION_DESC
};
class Sort {
    constructor(attrs, schema) {
        this._field = attrs.field || null;
        this._direction = attrs.direction || null;
        this._schema = schema;
    }
    get isValid() {
        return !!this.column;
    }
    get direction() {
        return this._direction;
    }
    set direction(direction) {
        this._direction = direction;
    }
    get field() {
        return this._field;
    }
    get column() {
        return this._schema.columnForFieldKey(this.field);
    }
    set column(column) {
        this._field = column ? column.id : null;
    }
    get columnName() {
        if (this.column) {
            return this.column.columnName;
        }
        return null;
    }
    toJSON() {
        return {
            field: this._field,
            direction: this._direction
        };
    }
    toHumanDescription() {
        if (!this.isValid) {
            return null;
        }
        return [this.column ? this.column.name : this.columnName, this.direction.toUpperCase()].join(' ');
    }
}
exports.Sort = Sort;
//# sourceMappingURL=sort.js.map