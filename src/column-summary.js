import { availableAggregatesForColumn } from './aggregate';

export default class ColumnSummary {
  constructor(attrs, schema) {
    this._field = attrs.field;
    this._aggregate = attrs.aggregate;
    this._schema = schema;
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

  set aggregate(aggregate) {
    this._aggregate = aggregate;
  }

  get aggregate() {
    return this._aggregate;
  }

  availableAggregates() {
    return availableAggregatesForColumn(this.column);
  }
}
