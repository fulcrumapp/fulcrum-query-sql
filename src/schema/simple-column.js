import Column from './column';

export default class SimpleColumn extends Column {
  constructor({name, attributeName, columnName, type = null, accessor = null}) {
    super();

    this._type = type || 'string';
    this._name = name;
    this._attributeName = attributeName;
    this._columnName = columnName;
    this._accessor = accessor || this.defaultAccessor;
  }

  get type() {
    return this._type;
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

  defaultAccessor = (object) => {
    return object[this.attributeName];
  }

  valueFrom(object) {
    return this._accessor(object);
  }

  exportValue(object, options = {}) {
    return this._accessor(object, options);
  }
}
