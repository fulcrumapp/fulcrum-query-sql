export default class Column {
  get isArray() {
    return this.type === 'array';
  }

  get isDate() {
    return this.type === 'timestamp';
  }

  get isNumber() {
    return this.isDouble || this.isInteger;
  }

  get isDouble() {
    return this.type === 'double';
  }

  get isInteger() {
    return this.type === 'integer';
  }

  get isGeometry() {
    return this.type === 'geometry';
  }

  get supportsRanges() {
    return this.isNumber || this.isDate;
  }

  get isSortable() {
    return true;
  }

  toJSON() {
    return {
      id: this.id
    };
  }

  get index() {
    return this._index;
  }
}
