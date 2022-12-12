"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
class Join {
    constructor({ alias, tableName, sourceTableName, sourceColumn, joinColumn, inner, ast }) {
        this._alias = alias;
        this._tableName = tableName;
        this._sourceColumn = sourceColumn;
        this._joinColumn = joinColumn;
        this._inner = !!inner;
        this._sourceTableName = sourceTableName || null;
        this._ast = ast;
        (0, assert_1.default)(alias && tableName && ((sourceColumn && joinColumn) || ast), 'invalid join');
    }
    get inner() {
        return this._inner;
    }
    get alias() {
        return this._alias;
    }
    get tableName() {
        return this._tableName;
    }
    get sourceColumn() {
        return this._sourceColumn;
    }
    get sourceTableName() {
        return this._sourceTableName;
    }
    get joinColumn() {
        return this._joinColumn;
    }
    get ast() {
        return this._ast;
    }
}
exports.default = Join;
//# sourceMappingURL=join.js.map