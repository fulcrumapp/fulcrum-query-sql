import { Condition } from './condition';
import { Expression } from './expression';
import SortExpressions from './sort-expressions';
import Converter from './ast/converter';
import ColumnFilter from './column-filter';
import Deparse from 'pg-query-deparser';
import _ from 'lodash';

import { ResTarget,
         ColumnRef,
         FuncCall,
         AConst,
         StringValue,
         TypeCast,
         TypeName,
         RangeVar,
         Alias,
         JoinExpr,
         AExpr,
         RangeSubselect,
         SelectStmt,
         SortBy,
         IntegerValue } from './ast/helpers';

export default class Query {
  constructor(form, outputs, filter, sort, schema) {
    this._form = form;
    this._outputs = [];
    this._schema = schema;
    this._filter = new Condition(filter, schema);
    this._columnFilters = {};
    this._sorting = new SortExpressions(sort || [], schema);
    this._boundingBox = null;
    this._searchFilter = null;
    this._dateFilter = new Expression({field: '_server_updated_at'}, schema);
  }

  get form() {
    return this._form;
  }

  get outputs() {
    return this._outputs;
  }

  get filter() {
    return this._filter;
  }

  get sorting() {
    return this._sorting;
  }

  get columnFilters() {
    return this._columnFilters;
  }

  get dateFilter() {
    return this._dateFilter;
  }

  columnFilter(column) {
    if (this.columnFilters[column.id] == null) {
      this.columnFilters[column.id] = new ColumnFilter({field: column.id}, this._schema);
    }

    return this.columnFilters[column.id];
  }

  set boundingBox(box) {
    this._boundingBox = box;
  }

  get boundingBox() {
    return this._boundingBox;
  }

  get searchFilter() {
    return this._searchFilter || '';
  }

  set searchFilter(filter) {
    this._searchFilter = filter;
  }

  get runtimeFilters() {
    return {
      boundingBox: this.boundingBox,
      searchFilter: this.searchFilter
    };
  }

  toJSON() {
    return {
      outputs: this.outputs.map(o => o.toJSON()),
      filter: this.filter.toJSON(),
      sorting: this.sorting.toJSON(),
      column_filters: Object.keys(this.columnFilters).map(key => this.columnFilters[key].toJSON())
    };
  }

  toRawAST(options) {
    return new Converter().toAST(this, options);
  }

  toCountAST(options) {
    return new Converter().toCountAST(this, options);
  }

  toTileAST(options) {
    return new Converter().toTileAST(this, options);
  }

  toDistinctValuesAST(options) {
    return new Converter().toDistinctValuesAST(this, options);
  }

  toHistogramAST(options) {
    return new Converter().toHistogramAST(this, options);
  }

  toAST({applySort, pageSize, pageIndex, outerLimit}) {
    const finalLimit = outerLimit ? AConst(IntegerValue(+outerLimit)) : null;

    const sortClause = applySort ? this.outerSortClause : null;

    const fromClause = this.fromClause({applySort, pageSize, pageIndex, ...this.runtimeFilters});

    return SelectStmt({
      targetList: this.targetList(),
      fromClause: fromClause,
      sortClause: sortClause,
      limitCount: finalLimit
    });
  }

  toDistinctValuesSQL(options) {
    return new Deparse().deparse(this.toDistinctValuesAST(options));
  }

  toHistogramSQL(options) {
    return new Deparse().deparse(this.toHistogramAST(options));
  }

  toCountSQL() {
    return new Deparse().deparse(this.toCountAST(this.runtimeFilters));
  }

  toSQL({applySort, pageSize, pageIndex, outerLimit}) {
    const options = {
      applySort,
      pageSize,
      pageIndex,
      outerLimit,
      ...this.runtimeFilters
    };

    return new Deparse().deparse(this.toAST(options));
  }

  toTileSQL() {
    return new Deparse().deparse(this.toTileAST(this.runtimeFilters));
  }

  targetList() {
    return [
      ResTarget(ColumnRef('_status'), 'status'),
      ResTarget(ColumnRef('_version'), 'version'),
      ResTarget(ColumnRef('_record_id'), 'id'),
      ResTarget(FuncCall('to_char', [ ColumnRef('_server_created_at'), AConst(StringValue('YYYY-MM-DD"T"HH24:MI:SS"Z"')) ]), 'created_at'),
      ResTarget(FuncCall('to_char', [ ColumnRef('_server_updated_at'), AConst(StringValue('YYYY-MM-DD"T"HH24:MI:SS"Z"')) ]), 'updated_at'),
      ResTarget(FuncCall('to_char', [ ColumnRef('_created_at'), AConst(StringValue('YYYY-MM-DD"T"HH24:MI:SS"Z"')) ]), 'client_created_at'),
      ResTarget(FuncCall('to_char', [ ColumnRef('_updated_at'), AConst(StringValue('YYYY-MM-DD"T"HH24:MI:SS"Z"')) ]), 'client_updated_at'),
      ResTarget(ColumnRef('_created_by_id'), 'created_by_id'),
      ResTarget(ColumnRef('name', 'created_by'), 'created_by'),
      ResTarget(ColumnRef('_updated_by_id'), 'updated_by_id'),
      ResTarget(ColumnRef('name', 'updated_by'), 'updated_by'),
      ResTarget(TypeCast(TypeName('text'), AConst(StringValue(this.form.id))), 'form_id'),
      ResTarget(ColumnRef('_project_id'), 'project_id'),
      ResTarget(ColumnRef('_assigned_to_id'), 'assigned_to_id'),
      ResTarget(ColumnRef('name', 'assigned_to'), 'assigned_to'),
      ResTarget(ColumnRef('_form_values'), 'form_values'),
      ResTarget(ColumnRef('_latitude'), 'latitude'),
      ResTarget(ColumnRef('_longitude'), 'longitude'),
      ResTarget(ColumnRef('_altitude'), 'altitude'),
      ResTarget(ColumnRef('_speed'), 'speed'),
      ResTarget(ColumnRef('_course'), 'course'),
      ResTarget(ColumnRef('_horizontal_accuracy'), 'horizontal_accuracy'),
      ResTarget(ColumnRef('_vertical_accuracy'), 'vertical_accuracy'),
      ResTarget(ColumnRef('_edited_duration'), 'edited_duration'),
      ResTarget(ColumnRef('_updated_duration'), 'updated_duration'),
      ResTarget(ColumnRef('_created_duration'), 'created_duration')
    ];
  }

  fromClause({applySort, pageSize, pageIndex, boundingBox, searchFilter}) {
    const ast = applySort ? this.toRawAST({sort: this.sortClause, pageSize, pageIndex, boundingBox, searchFilter})
                          : this.toRawAST({boundingBox, searchFilter});

    const actualQuery = RangeSubselect(ast, Alias('records'));

    const createdByJoin =
      JoinExpr(1,
               actualQuery,
               RangeVar('memberships', Alias('created_by')),
               AExpr(0, '=', ColumnRef('_created_by_id', 'records'), ColumnRef('user_id', 'created_by')));

    const updatedByJoin =
      JoinExpr(1,
               createdByJoin,
               RangeVar('memberships', Alias('updated_by')),
               AExpr(0, '=', ColumnRef('_updated_by_id', 'records'), ColumnRef('user_id', 'updated_by')));

    const assignedToJoin =
      JoinExpr(1,
               updatedByJoin,
               RangeVar('memberships', Alias('assigned_to')),
               AExpr(0, '=', ColumnRef('_assigned_to_id', 'records'), ColumnRef('user_id', 'assigned_to')));

    return [ assignedToJoin ];
  }

  get sortClause() {
    if (this.sorting.isEmpty) {
      return this.systemSortClause;
    }

    // always add the record ID to the sorting so it's stable across executions
    const sorts = this.sorting.expressions.map((sort) => {
      const direction = sort.direction === 'desc' ? 2 : 1;

      return [
        SortBy(ColumnRef(sort.columnName), direction, 0),
        SortBy(ColumnRef('_record_id'), direction, 0)
      ];
    });

    return _.flatten(sorts);
  }

  get systemSortClause() {
    return [ SortBy(ColumnRef('_server_updated_at'), 2, 0) ];
  }

  get outerSortClause() {
    return [ SortBy(ColumnRef('_row_number'), 1, 0) ];
  }
}
