import { Condition } from './condition';
import { Expression } from './expression';
import SortExpressions from './sort-expressions';
import Converter from './ast/converter';
import ColumnFilter from './column-filter';
import Deparse from 'pg-query-deparser';
import QueryOptions from './query-options';
import _ from 'lodash';
import ColumnSettings from './column-settings';

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
         IntegerValue,
         AStar } from './ast/helpers';

export default class Query {
  constructor(attrs) {
    this._form = attrs.form;
    this._outputs = [];
    this._schema = attrs.schema;
    this._filter = new Condition(attrs.filter, attrs.schema);
    this._sorting = new SortExpressions(attrs.sort, attrs.schema);
    this._boundingBox = attrs.bounding_box || null;
    this._searchFilter = '';
    this._dateFilter = new Expression(attrs.date_filter || {field: '_server_updated_at'}, attrs.schema);
    this._statusFilter = new ColumnFilter({...attrs.status_filter, field: '_status'}, this._schema);
    this._projectFilter = new ColumnFilter({...attrs.project_filter, field: '_project_id'}, this._schema);
    this._assignmentFilter = new ColumnFilter({...attrs.assignment_filter, field: '_assigned_to_id'}, this._schema);
    this._options = new QueryOptions(attrs.options || {});
    this._columnSettings = new ColumnSettings(this._schema, attrs.columns);
  }

  get form() {
    return this._form;
  }

  get schema() {
    return this._schema;
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

  get columnSettings() {
    return this._columnSettings;
  }

  get dateFilter() {
    return this._dateFilter;
  }

  get statusFilter() {
    return this._statusFilter;
  }

  get projectFilter() {
    return this._projectFilter;
  }

  get assignmentFilter() {
    return this._assignmentFilter;
  }

  get options() {
    return this._options;
  }

  get hasFilter() {
    return this.statusFilter.hasFilter ||
           this.projectFilter.hasFilter ||
           this.assignmentFilter.hasFilter ||
           this.columnSettings.columns.find(o => o.hasFilter) ||
           this.searchFilter ||
           this.dateFilter.isValid ||
           this.filter.expressions.find(o => o.isValid) ||
           this.sorting.hasSort;
  }

  clearAllFilters() {
    this.statusFilter.reset();
    this.projectFilter.reset();
    this.assignmentFilter.reset();

    this.columnSettings.reset();

    this._filter = new Condition(null, this._schema);
    this._sorting = new SortExpressions(null, this._schema);
    // this._boundingBox = null;
    this._searchFilter = '';
    this._dateFilter = new Expression({field: '_server_updated_at'}, this._schema);
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
      searchFilter: this.searchFilter,
      dateFilter: this.dateFilter
    };
  }

  toJSON({boundingBox = false} = {}) {
    return {
      outputs: this.outputs.map(o => o.toJSON()),
      filter: this.filter.toJSON(),
      sorting: this.sorting.toJSON(),
      options: this.options.toJSON(),
      bounding_box: boundingBox ? this.boundingBox : null,
      search_filter: this.searchFilter,
      date_filter: this.dateFilter.toJSON(),
      columns: this.columnSettings.toJSON(),
      status_filter: this.statusFilter.toJSON(),
      project_filter: this.projectFilter.toJSON(),
      assignment_filter: this.assignmentFilter.toJSON(),
      column_settings: this.columnSettings.toJSON()
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
    if (this.schema.isSQL) {
      return [ ResTarget(ColumnRef(AStar())) ];
    }

    const timeZoneCast = (columnRef) => {
      return FuncCall([ StringValue('pg_catalog'), StringValue('timezone') ], [ AConst(StringValue('UTC')), columnRef ]);
    };

    const timeZoneFormat = AConst(StringValue('YYYY-MM-DD"T"HH24:MI:SS"Z"'));

    return [
      ResTarget(ColumnRef('_status'), 'status'),
      ResTarget(ColumnRef('_version'), 'version'),
      ResTarget(ColumnRef('_record_id'), 'id'),
      ResTarget(FuncCall('to_char', [ timeZoneCast(ColumnRef('_server_created_at')),
                                      timeZoneFormat ]), 'created_at'),
      ResTarget(FuncCall('to_char', [ timeZoneCast(ColumnRef('_server_updated_at')),
                                      timeZoneFormat ]), 'updated_at'),
      ResTarget(FuncCall('to_char', [ timeZoneCast(ColumnRef('_created_at')),
                                      timeZoneFormat ]), 'client_created_at'),
      ResTarget(FuncCall('to_char', [ timeZoneCast(ColumnRef('_updated_at')),
                                      timeZoneFormat ]), 'client_updated_at'),
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

  toHumanDescription() {
    const parts = [];

    let description = null;

    if ((description = this.statusFilter.toHumanDescription())) {
      parts.push(description);
    }

    if ((description = this.projectFilter.toHumanDescription())) {
      parts.push(description);
    }

    if ((description = this.assignmentFilter.toHumanDescription())) {
      parts.push(description);
    }

    if ((description = this.columnSettings.columns.map(o => o.filter).map(o => o.toHumanDescription()))) {
      for (const desc of description) {
        if (desc) {
          parts.push(desc);
        }
      }
    }

    if (this.searchFilter) {
      parts.push('Search by ' + this.searchFilter);
    }

    if ((description = this.dateFilter.toHumanDescription())) {
      parts.push(description);
    }

    if ((description = this.filter.toHumanDescription())) {
      parts.push(description);
    }

    if ((description = this.sorting.toHumanDescription())) {
      parts.push(description);
    }

    return parts.join(', ');
  }
}
