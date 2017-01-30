export const DIRECTION_ASC = 'asc';

export const DIRECTION_DESC = 'desc';

export const DIRECTIONS = {
  Asc: DIRECTION_ASC,
  Desc: DIRECTION_DESC
};

export class Sort {
  constructor(attrs, schema) {
    this._field = attrs.field || null;
    this._direction = attrs.direction || null;
    this._schema = schema;
  }

  get isValid() {
    return !this.column;
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

    return [ this.columnName, this.direction.toUpperCase() ].join(' ');
  }
}
