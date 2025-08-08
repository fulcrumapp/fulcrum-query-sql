"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const column_1 = __importDefault(require("./column"));
const join_1 = __importDefault(require("./join"));
class SimpleColumn extends column_1.default {
    constructor({ name, attributeName, columnName, type = null, accessor = null, join = null, sql = null, index }) {
        super();
        this.defaultAccessor = (object) => {
            return object[this.attributeName];
        };
        this._type = type || 'string';
        this._name = name;
        this._attributeName = attributeName;
        this._columnName = columnName;
        this._accessor = accessor || this.defaultAccessor;
        this._sql = !!sql;
        this._index = index;
        if (join) {
            this._join = new join_1.default(join);
        }
    }
    get type() {
        return this._type;
    }
    get id() {
        if (this._sql) {
            // The double underscore is the marker for an internal column id
            return `__${this._index}:${this._columnName}`;
        }
        return this._columnName;
    }
    get name() {
        return this._name;
    }
    get join() {
        return this._join;
    }
    get source() {
        if (this.join) {
            return this._columnName.split('.')[0];
        }
        return null;
    }
    get joinedColumnName() {
        return this.columnName;
    }
    get columnName() {
        if (this.join) {
            return this._columnName.split('.')[1];
        }
        return this._columnName;
    }
    get attributeName() {
        return this._attributeName;
    }
    valueFrom(object) {
        if (this.attributeName === 'recordKey') {
            console.log('valueFrom called on SimpleColumn', this.attributeName, this._accessor, object);
            console.log("Get the value:", object[this.attributeName], object.recordKey, object._recordKey);
        }
        return this._accessor(object);
    }
    exportValue(object, options = {}) {
        return this._accessor(object, options);
    }
    get isSQL() {
        return this._sql;
    }
}
exports.default = SimpleColumn;
//# sourceMappingURL=simple-column.js.map