import Column from './column';
import Join from './join';

export default class SimpleColumn extends Column {
  constructor({name, attributeName, columnName, type = null, accessor = null, join = null, sql = null, index}) {
    super();

    this._type = type || 'string';
    this._name = name;
    this._attributeName = attributeName;
    this._columnName = columnName;
    this._accessor = accessor || this.defaultAccessor;
    this._sql = !!sql;
    this._index = index;

    if (join) {
      this._join = new Join(join);
    }
  }

  get alias() {
    return this._columnName.subtring(1);
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

  defaultAccessor = (object) => {
    return object[this.attributeName];
  }

  valueFrom(object) {
    return this._accessor(object);
  }

  exportValue(object, options = {}) {
    return this._accessor(object, options);
  }

  get isSQL() {
    return this._sql;
  }
}
