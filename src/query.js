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
         Alias,
         RangeSubselect,
         SelectStmt,
         SortBy,
         IntegerValue,
         AStar } from './ast/helpers';

export default class Query {
  constructor(attrs) {
    this._ast = attrs.ast;
    this._form = attrs.form;
    this._repeatableKey = attrs.repeatableKey;
    this._outputs = [];
    this._schema = attrs.schema;
    this._filter = new Condition(attrs.filter, attrs.schema);
    this._sorting = new SortExpressions(attrs.sort, attrs.schema);
    this._boundingBox = attrs.bounding_box || null;
    this._searchFilter = '';
    this._dateFilter = new Expression(attrs.date_filter || {field: '_server_updated_at'}, attrs.schema);
    this._options = new QueryOptions(attrs.options || {});
    this._columnSettings = new ColumnSettings(this._schema, attrs.columns);
    this._statusFilter = new ColumnFilter({...attrs.status_filter, field: attrs.repeatableKey ? '_record_status' : '_status'}, this._schema);
    this._projectFilter = new ColumnFilter({...attrs.project_filter, field: 'project.name'}, this._schema);
    this._assignmentFilter = new ColumnFilter({...attrs.assignment_filter, field: 'assigned_to.name'}, this._schema);

    this.setup();
  }

  get ast() {
    return this._ast;
  }

  get form() {
    return this._form;
  }

  get repeatableKey() {
    return this._repeatableKey;
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

  get joinColumns() {
    const joins = [];

    if (this.projectFilter.hasFilter) {
      joins.push(this.projectFilter.column);
    }

    if (this.assignmentFilter.hasFilter) {
      joins.push(this.assignmentFilter.column);
    }

    joins.push.apply(joins, this.columnSettings.columns.filter((o) => {
      return o.hasFilter && o.column.join;
    }).map(o => o.column));

    joins.push.apply(joins, this.filter.allExpressions.filter((o) => {
      return o.isValid && o.column.join;
    }).map(o => o.column));

    return joins;
  }

  get referencedColumns() {
    const columns = [];

    if (this.projectFilter.hasFilter) {
      columns.push(this.projectFilter.column);
    }

    if (this.assignmentFilter.hasFilter) {
      columns.push(this.assignmentFilter.column);
    }

    columns.push.apply(columns, this.columnSettings.columns.filter((o) => {
      return o.hasFilter;
    }).map(o => o.column));

    columns.push.apply(columns, this.filter.allExpressions.filter((o) => {
      return o.isValid;
    }).map(o => o.column));

    if (this.sorting.hasSort) {
      columns.push.apply(columns, this.sorting.expressions.filter((o) => {
        return o.isValid;
      }).map(o => o.column));
    }

    return columns;
  }

  get joinColumnsWithSorting() {
    const joins = this.joinColumns;

    if (this.sorting.hasSort) {
      joins.push.apply(joins, this.sorting.expressions.filter((o) => {
        return o.isValid && o.column.join;
      }).map(o => o.column));
    }

    return joins;
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

  deparse(ast) {
    return new Deparse().deparse(ast);
  }

  toSchemaAST(ast, options) {
    return new Converter().toSchemaAST(ast, options);
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
    if (this.ast) {
      return [ ResTarget(ColumnRef(AStar())) ];
    }

    const timeZoneCast = (columnRef) => {
      return FuncCall([ StringValue('pg_catalog'), StringValue('timezone') ], [ AConst(StringValue('UTC')), columnRef ]);
    };

    const timeZoneFormat = AConst(StringValue('YYYY-MM-DD"T"HH24:MI:SS"Z"'));

    const joinedColumns = [];

    // The "subJoinColumns" are joins that need to happen in the inner sub-select from Converter.
    // We don't need to join them in the outer part.
    const subJoinColumns = this.joinColumnsWithSorting;

    if (this.schema.createdByColumn) {
      if (subJoinColumns.indexOf(this.schema.createdByColumn) === -1) {
        joinedColumns.push(ResTarget(ColumnRef('name', 'created_by'), 'created_by'));
      } else {
        joinedColumns.push(ResTarget(ColumnRef('created_by.name'), 'created_by'));
      }
    }

    if (this.schema.updatedByColumn) {
      if (subJoinColumns.indexOf(this.schema.updatedByColumn) === -1) {
        joinedColumns.push(ResTarget(ColumnRef('name', 'updated_by'), 'updated_by'));
      } else {
        joinedColumns.push(ResTarget(ColumnRef('updated_by.name'), 'updated_by'));
      }
    }

    if (this.schema.assignedToColumn) {
      const alias = this.repeatableKey ? 'record_assigned_to' : 'assigned_to';

      if (subJoinColumns.indexOf(this.schema.assignedToColumn) === -1) {
        joinedColumns.push(ResTarget(ColumnRef('name', 'assigned_to'), alias));
      } else {
        joinedColumns.push(ResTarget(ColumnRef('assigned_to.name'), alias));
      }
    }

    if (this.schema.projectColumn) {
      const alias = this.repeatableKey ? 'record_project' : 'project';

      if (subJoinColumns.indexOf(this.schema.projectColumn) === -1) {
        joinedColumns.push(ResTarget(ColumnRef('name', 'project'), alias));
      } else {
        joinedColumns.push(ResTarget(ColumnRef('project.name'), alias));
      }
    }

    if (this.repeatableKey) {
      return [
        ResTarget(ColumnRef('_record_status'), 'record_status'),
        ResTarget(ColumnRef('_version'), 'version'),
        ResTarget(ColumnRef('_child_record_id'), 'id'),
        ResTarget(ColumnRef('_record_id'), 'record_id'),
        ResTarget(ColumnRef('_parent_id'), 'parent_id'),
        ResTarget(ColumnRef('_index'), 'index'),
        ResTarget(FuncCall([ StringValue('pg_catalog'), StringValue('date_part') ],
                           [ AConst(StringValue('epoch')), timeZoneCast(ColumnRef('_server_created_at')) ]),
                  'created_at'),
        ResTarget(FuncCall([ StringValue('pg_catalog'), StringValue('date_part') ],
                           [ AConst(StringValue('epoch')), timeZoneCast(ColumnRef('_server_updated_at')) ]),
                  'updated_at'),
        ResTarget(FuncCall([ StringValue('pg_catalog'), StringValue('date_part') ],
                           [ AConst(StringValue('epoch')), timeZoneCast(ColumnRef('_created_at')) ]),
                  'client_created_at'),
        ResTarget(FuncCall([ StringValue('pg_catalog'), StringValue('date_part') ],
                           [ AConst(StringValue('epoch')), timeZoneCast(ColumnRef('_updated_at')) ]),
                  'client_updated_at'),
        ResTarget(ColumnRef('_created_by_id'), 'created_by_id'),
        ResTarget(ColumnRef('_updated_by_id'), 'updated_by_id'),
        ResTarget(TypeCast(TypeName('text'), AConst(StringValue(this.form.id))), 'form_id'),
        ResTarget(ColumnRef('_record_project_id'), 'record_project_id'),
        ResTarget(ColumnRef('_record_assigned_to_id'), 'record_assigned_to_id'),
        ResTarget(ColumnRef('_form_values'), 'form_values'),
        ResTarget(ColumnRef('_latitude'), 'latitude'),
        ResTarget(ColumnRef('_longitude'), 'longitude'),
        ResTarget(ColumnRef('_edited_duration'), 'edited_duration'),
        ResTarget(ColumnRef('_updated_duration'), 'updated_duration'),
        ResTarget(ColumnRef('_created_duration'), 'created_duration'),
        ...joinedColumns
      ];
    }

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
      ResTarget(ColumnRef('_updated_by_id'), 'updated_by_id'),
      ResTarget(TypeCast(TypeName('text'), AConst(StringValue(this.form.id))), 'form_id'),
      ResTarget(ColumnRef('_project_id'), 'project_id'),
      ResTarget(ColumnRef('_assigned_to_id'), 'assigned_to_id'),
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
      ResTarget(ColumnRef('_created_duration'), 'created_duration'),
      ...joinedColumns
    ];
  }

  fromClause({applySort, pageSize, pageIndex, boundingBox, searchFilter}) {
    const ast = applySort ? this.toRawAST({sort: this.sortClause, pageSize, pageIndex, boundingBox, searchFilter})
                          : this.toRawAST({boundingBox, searchFilter});

    let baseQuery = RangeSubselect(ast, Alias('records'));

    if (this.ast) {
      return [ baseQuery ];
    }

    // The "subJoinColumns" are joins that need to happen in the inner sub-select from Converter.
    // We don't need to join them in the outer part.
    const subJoinColumns = this.joinColumnsWithSorting;

    if (this.schema.createdByColumn && subJoinColumns.indexOf(this.schema.createdByColumn) === -1) {
      const join = this.schema.createdByColumn.join;
      baseQuery = Converter.leftJoinClause(baseQuery, join.tableName, join.alias, join.sourceColumn, join.joinColumn);
    }

    if (this.schema.updatedByColumn && subJoinColumns.indexOf(this.schema.updatedByColumn) === -1) {
      const join = this.schema.updatedByColumn.join;
      baseQuery = Converter.leftJoinClause(baseQuery, join.tableName, join.alias, join.sourceColumn, join.joinColumn);
    }

    if (this.schema.assignedToColumn && subJoinColumns.indexOf(this.schema.assignedToColumn) === -1) {
      const join = this.schema.assignedToColumn.join;
      baseQuery = Converter.leftJoinClause(baseQuery, join.tableName, join.alias, join.sourceColumn, join.joinColumn);
    }

    if (this.schema.projectColumn && subJoinColumns.indexOf(this.schema.projectColumn) === -1) {
      const join = this.schema.projectColumn.join;
      baseQuery = Converter.leftJoinClause(baseQuery, join.tableName, join.alias, join.sourceColumn, join.joinColumn);
    }

    return [ baseQuery ];
  }

  get sortClause() {
    if (this.sorting.isEmpty) {
      return this.systemSortClause;
    }

    // always add the record ID to the sorting so it's stable across executions
    const sorts = this.sorting.expressions.map((sort) => {
      const direction = sort.direction === 'desc' ? 2 : 1;

      if (this.ast) {
        return [
          SortBy(ColumnRef(sort.column.id, sort.column.source), direction, 0)
        ];
      }

      return [
        SortBy(ColumnRef(sort.column.columnName, sort.column.source), direction, 0),
        SortBy(ColumnRef('_record_id'), direction, 0)
      ];
    });

    return _.flatten(sorts);
  }

  get systemSortClause() {
    if (this.ast) {
      return [ SortBy(AConst(IntegerValue(1)), 2, 0) ];
    }

    return [ SortBy(ColumnRef('_server_updated_at'), 2, 0) ];
  }

  get outerSortClause() {
    return [ SortBy(ColumnRef('__row_number'), 1, 0) ];
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

  setup() {
    if (!this.ast) {
      return;
    }

    const geometryColumns = this.schema.geometryColumns;

    if (geometryColumns.length) {
      // For custom SQL, we need to add a column called __geometry at the end that evaluates to the
      // exact same expression as the first geometry column. This is needed so that queries like
      // SELECT geom, * FROM table will work when we need to reference the geom column from an outer
      // query.
      const geometryColumn = geometryColumns[0];

      Converter.duplicateResTargetWithExactName(this, this.ast.SelectStmt.targetList,
                                                geometryColumn, '__geometry');
    }
  }
}
