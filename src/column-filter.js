import _ from 'lodash';

export default class ColumnFilter {
  constructor(attrs, schema) {
    this._field = attrs.field;
    this._value = attrs.value || null;
    this._schema = schema;
  }

  get value() {
    return this._value;
  }

  // when the filter is fully blank (default state) all rows are returned
  get isNull() {
    return this.value == null;
  }

  get hasValues() {
    return this.value != null && this.value.length > 0;
  }

  // when the set is empty, it should always return no results
  get isEmptySet() {
    return this.value != null && this.value.length === 0;
  }

  get field() {
    return this._field;
  }

  get column() {
    return this._schema.columnForFieldKey(this.field);
  }

  get columnName() {
    if (this.column) {
      return this.column.columnName;
    }
    return null;
  }

  reset() {
    this._value = null;
  }

  resetIfEmpty() {
    if (this.isEmptySet) {
      this.reset();
    }
  }

  clearValues() {
    this._value = [];
  }

  ensureValue(value) {
    if (!this._value) {
      this._value = [];
    }

    if (!this.containsValue(value)) {
      this._value.push(value);
    }
  }

  toggleValue(value) {
    if (!this._value) {
      this._value = [];
    }

    if (this.containsValue(value)) {
      this._value = _.without(this.value, value);
    } else {
      this._value.push(value);
    }
  }

  containsValue(value) {
    if (this.value == null) {
      return false;
    }

    return this.value.indexOf(value) > -1;
  }

  toJSON() {
    return {
      field: this._field,
      value: this._value
    };
  }
}
