import _ from 'lodash';

import { availableOperatorsForColumn, isValueRequired, isDateOperator } from './operator';

export class Expression {
  constructor(attrs, schema) {
    this._field = attrs.field || null;
    this._operator = attrs.operator || null;
    this._value = attrs.value || null;
    this._schema = schema;
  }

  get isValid() {
    if (!isValueRequired(this.operator)) {
      return this.column && this.operator;
    }

    return this.column && this.operator && this.hasValue;
  }

  get supportsValue() {
    return isValueRequired(this.operator);
  }

  get hasValue() {
    return this.value !== null && this.value.length;
  }

  get value() {
    return this._value;
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

  get value2() {
    return this.value && this.value[1];
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

  get expressions() {
    return this._expressions;
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

    return this.value.find(o => (value == null && o == null) || (o.toString() === value.toString()));
  }

  toJSON() {
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

    this._value = [ date && date.format('YYYY-MM-DD'), this.value[1] ];
  }

  get endDate() {
    return this._value && this._value[1];
  }

  set endDate(date) {
    if (!this._value) {
      this._value = [];
    }

    this._value = [ this.value[0], date && date.format('YYYY-MM-DD') ];
  }

  labelForValue(value) {
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

    return value;
  }
}
