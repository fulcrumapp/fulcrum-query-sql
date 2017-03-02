import assert from 'assert';

export default class Join {
  constructor({alias, tableName, sourceColumn, joinColumn}) {
    this._alias = alias;
    this._tableName = tableName;
    this._sourceColumn = sourceColumn;
    this._joinColumn = joinColumn;

    assert(alias && tableName && sourceColumn && joinColumn, 'invalid join');
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

  get joinColumn() {
    return this._joinColumn;
  }
}
