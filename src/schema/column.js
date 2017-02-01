export default class Column {
  get isArray() {
    return this.type === 'array';
  }

  get isDate() {
    return this.type === 'timestamp';
  }

  get isNumber() {
    return this.type === 'double' || this.type === 'integer';
  }

  get supportsRanges() {
    return this.isNumber || this.isDate;
  }
}
