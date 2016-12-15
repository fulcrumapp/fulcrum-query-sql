import Column from './column';

export default class SimpleColumn extends Column {
  constructor(name, attributeName, columnName) {
    super();

    this._name = name;
    this._attributeName = attributeName;
    this._columnName = columnName;
  }

  get id() {
    return this._columnName;
  }

  get name() {
    return this._name;
  }

  get columnName() {
    return this._columnName;
  }

  get attributeName() {
    return this._attributeName;
  }

  valueFrom(row) {
    return row[this.attributeName];
  }
}
