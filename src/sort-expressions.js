import { Sort } from './sort';

export default class SortExpressions {
  constructor(sorts, schema) {
    sorts = sorts || [];

    this._expressions = sorts.map(o => new Sort(o, schema));
    this._schema = schema;
  }

  sortByAsc(column) {
    this._expressions = [ new Sort({field: column.id, direction: 'asc'}, this._schema) ];
  }

  sortByDesc(column) {
    this._expressions = [ new Sort({field: column.id, direction: 'desc'}, this._schema) ];
  }

  get isEmpty() {
    return this._expressions.find(e => e.isValid).length !== 0;
  }

  get hasSort() {
    return !this.isEmpty;
  }

  get expressions() {
    return this._expressions;
  }

  toJSON() {
    return this.expressions.map(o => o.toJSON());
  }

  toHumanDescription() {
    if (!this.hasSort) {
      return null;
    }

    return this.expressions.map(o => o.toHumanDescription()).join(', ');
  }
}
