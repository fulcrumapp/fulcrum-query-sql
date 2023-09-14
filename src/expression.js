import _ from 'lodash';

import { availableOperatorsForColumn, isValueRequired, isDateOperator, OperatorsByValue } from './operator';
import QueryOptions from './query-options';

export class Expression {
  constructor(attrs, schema) {
    attrs = attrs || {};

    this._field = attrs.field || null;
    this._operator = attrs.operator || null;
    this._value = attrs.value || null;
    this._options = new QueryOptions(attrs.options || {});
    this._schema = schema;
  }

  get isValid() {
    if (!isValueRequired(this.operator)) {
      return this.column != null && this.operator != null;
    }

    return this.column != null && this.operator != null && this.hasValue;
  }

  get supportsValue() {
    return isValueRequired(this.operator);
  }

  get hasValue() {
    return this.value !== null && this.value.length !== 0;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }

  get arrayValue() {
    if (this.hasValue) {
      return Array.isArray(this.value[0]) ? this.value[0] : this.value;
    }

    return null;
  }

  get scalarValue() {
    if (this.hasValue) {
      return this.value[0];
    }

    return null;
  }

  set scalarValue(value) {
    this._value = value ? [ value ] : null;
  }

  get value1() {
    return this.value && this.value[0];
  }

  set value1(value) {
    if (!this._value) {
      this._value = [];
    }

    this._value = [ value, this.value[1] ];

    this.clearRangeValuesIfNull();
  }

  get value2() {
    return this.value && this.value[1];
  }

  set value2(value) {
    if (!this._value) {
      this._value = [];
    }

    this._value = [ this.value[0], value ];

    this.clearRangeValuesIfNull();
  }

  get isDateOperator() {
    return isDateOperator(this.operator);
  }

  get operator() {
    return this._operator;
  }

  set operator(operator) {
    this._operator = operator;
  }

  get field() {
    return this._field;
  }

  set field(field) {
    this._field = field;
  }

  get column() {
    return this._schema.columnForFieldKey(this.field);
  }

  set column(column) {
    this._field = column ? column.id : null;

    // if the change in the field results in the operator not being valid, clear the operator
    if (this._operator && this.availableOperators().find(o => o.name === this._operator) === -1) {
      this._operator = null;
    }
  }

  get columnName() {
    if (this.column) {
      return this.column.columnName;
    }
    return null;
  }

  toggleValue(value) {
    if (!this._value) {
      this._value = [];
    }

    if (this.containsValue(value)) {
      const newValues = [];

      for (const selectedValue of this.value) {
        if (JSON.stringify(selectedValue) !== JSON.stringify(value)) {
          newValues.push(selectedValue);
        }
      }

      this._value = newValues;
    } else {
      this._value.push(value);
    }
  }

  containsValue(value) {
    if (this.value == null) {
      return false;
    }

    return this.value.map(JSON.stringify).indexOf(JSON.stringify(value)) > -1;
  }

  toJSON() {
    if (!this.isValid) {
      return null;
    }

    return {
      field: this._field,
      operator: this._operator,
      value: this._value
    };
  }

  isEqual(other) {
    if (other == null || !(other instanceof Expression)) {
      return false;
    }

    return this.field === other.field &&
           this.operator === other.operator &&
           JSON.stringify(this.value) === JSON.stringify(other.value);
  }

  availableOperators() {
    return availableOperatorsForColumn(this.column);
  }

  get startDate() {
    return this._value && this._value[0];
  }

  set startDate(date) {
    if (!this._value) {
      this._value = [];
    }

    this._value = [ date && date.startOf('day').format('YYYY-MM-DD HH:mm:ss'), this.value[1] ];

    this.clearRangeValuesIfNull();
  }

  get endDate() {
    return this._value && this._value[1];
  }

  set endDate(date) {
    if (!this._value) {
      this._value = [];
    }

    this._value = [ this.value[0], date && date.endOf('day').format('YYYY-MM-DD HH:mm:ss') ];

    this.clearRangeValuesIfNull();
  }

  get options() {
    return this._options;
  }

  set options(options) {
    this._options = options;
  }

  clearRangeValuesIfNull() {
    // if both values are null, clear it, don't allow [ null, null ]
    if (this._value[0] == null && this._value[1] == null) {
      this._value = null;
    }
  }

  labelForValue(value, {separator} = {}) {
    const column = this.column;

    if (!column) {
      return value;
    }

    const element = this.column.element;

    if (element) {
      if (element.isStatusElement) {
        const choice = element.statusForValue(value);

        if (choice) {
          return choice.label;
        }
      } else if (element.isChoiceElement) {
        const choice = element.choiceByValue(value);

        if (choice) {
          return choice.label;
        }
      }
    }

    return Array.isArray(value) ? value.join(separator != null ? separator : ', ')
                                : value && value.toString();
  }

  toHumanDescription() {
    if (!this.isValid) {
      return null;
    }

    const parts = [
      this.column ? this.column.name : this.columnName,
      OperatorsByValue[this.operator].label
    ];

    if (this.supportsValue) {
      if (this.value.length === 1) {
        parts.push(this.value.join(', '));
      } else {
        parts.push('[' + this.value.join(', ') + ']');
      }
    }

    return parts.join(' ');
  }
}
