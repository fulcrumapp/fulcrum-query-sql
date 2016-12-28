import Column from './column';

export default class ElementColumn extends Column {
  constructor({element, rawColumn, id, part}) {
    super();

    this._element = element;
    this._rawColumn = rawColumn;
    this._id = id || element.key;
    this._part = part;

    if (part) {
      this._id += '_' + part;
    }
  }

  get type() {
    return 'string';
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
    if (this.rawColumn) {
      return this.rawColumn.name;
    }

    if (this.part) {
      return this.element.dataName + '_' + this.part;
    }

    return this.element.dataName;
  }

  get id() {
    return this._id;
  }

  get part() {
    return this._part;
  }

  valueFrom(feature) {
    if (this.element.isStatusElement) {
      return feature.statusValue;
    }

    return feature.formValues.get(this.element.key);
  }

  exportValue(feature, options) {
    const value = this.valueFrom(feature);

    if (value) {
      return value.format({part: this.part, ...options});
    }

    return null;
  }
}
