import { Expression } from './expression';
import ColumnFilter from './column-filter';

export default class ColumnSettingsItem {
  constructor(attrs, schema) {
    this._schema = schema;
    this._hidden = !!attrs.hidden;
    this._column = attrs.column;
    this._search = attrs.search || '';
    this._filter = new ColumnFilter({...attrs.filter, field: attrs.column.id}, this._schema);
    this._expression = new Expression(attrs.expression, schema);
    this._range = new Expression(attrs.range, schema);
  }

  clear() {
    this._hidden = false;
    this._search = '';
    this._filter = new ColumnFilter({field: this.column.id}, this._schema);
    this._expression = new Expression(null, this._schema);
    this._range = new Expression(null, this._schema);
  }

  toJSON() {
    return {
      hidden: this.isHidden,
      column: this.column.field,
      search: this.search,
      filter: this.filter.toJSON(),
      expression: this.expression.toJSON(),
      range: this.range.toJSON()
    };
  }

  get hasFilter() {
    return (
      this._search || this._filter.hasFilter || this._expression.isValid || this._range.isValid
    );
  }

  get search() {
    return this._search;
  }

  set search(search) {
    this._search = search || '';
  }

  get column() {
    return this._column;
  }

  get filter() {
    return this._filter;
  }

  get isVisible() {
    return !this._hidden;
  }

  get isHidden() {
    return this._hidden;
  }

  set hidden(hidden) {
    this._hidden = !!hidden;
  }

  get expression() {
    return this._expression;
  }

  get range() {
    return this._range;
  }
}
