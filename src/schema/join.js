import assert from 'assert';

export default class Join {
  constructor({alias, tableName, sourceTableName, sourceColumn, joinColumn, inner}) {
    this._alias = alias;
    this._tableName = tableName;
    this._sourceColumn = sourceColumn;
    this._joinColumn = joinColumn;
    this._inner = !!inner;
    this._sourceTableName = sourceTableName || null;

    assert(alias && tableName && sourceColumn && joinColumn, 'invalid join');
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
}
