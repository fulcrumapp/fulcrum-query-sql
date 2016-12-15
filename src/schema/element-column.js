import Column from './column';

export default class ElementColumn extends Column {
  constructor(element, rawColumn, id) {
    super();

    this._element = element;
    this._rawColumn = rawColumn;
    this._id = id || element.key;
  }

  get name() {
    return this.element.label;
  }

  get element() {
    return this._element;
  }

  get rawColumn() {
    return this._rawColumn;
  }

  get columnName() {
    return this.rawColumn.name;
  }

  get id() {
    return this._id;
  }

  valueFrom(row) {
    if (this.element.isStatusElement) {
      return row.statusValue;
    }

    return row.formValues.get(this.element.key);
  }
}
