"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const condition_1 = require("./condition");
const expression_1 = require("./expression");
const sort_expressions_1 = __importDefault(require("./sort-expressions"));
const converter_1 = __importDefault(require("./ast/converter"));
const column_filter_1 = __importDefault(require("./column-filter"));
const pg_query_deparser_1 = __importDefault(require("pg-query-deparser"));
const query_options_1 = __importDefault(require("./query-options"));
const lodash_1 = __importDefault(require("lodash"));
const column_settings_1 = __importDefault(require("./column-settings"));
const helpers_1 = require("./ast/helpers");
class Query {
    constructor(attrs) {
        this._ast = attrs.ast;
        this._form = attrs.form;
        this._repeatableKey = attrs.repeatableKey;
        this._schema = attrs.schema;
        this._filter = new condition_1.Condition(attrs.filter, attrs.schema);
        this._sorting = new sort_expressions_1.default(attrs.sorting, attrs.schema);
        this._boundingBox = attrs.bounding_box || null;
        this._searchFilter = attrs.search_filter;
        this._dateFilter = new expression_1.Expression(attrs.date_filter || { field: this.defaultDateField }, attrs.schema);
        this._options = new query_options_1.default(attrs.options || {});
        this._columnSettings = new column_settings_1.default(this._schema, attrs.columns);
        this._statusFilter = new column_filter_1.default(Object.assign(Object.assign({}, attrs.status_filter), { field: attrs.repeatableKey ? '_record_status' : '_status' }), this._schema);
        this._projectFilter = new column_filter_1.default(Object.assign(Object.assign({}, attrs.project_filter), { field: attrs.repeatableKey ? 'record_project.name' : 'project.name' }), this._schema);
        this._assignmentFilter = new column_filter_1.default(Object.assign(Object.assign({}, attrs.assignment_filter), { field: attrs.repeatableKey ? 'record_assigned_to.name' : 'assigned_to.name' }), this._schema);
        this._changesetFilter = new column_filter_1.default(Object.assign(Object.assign({}, attrs.changeset_filter), { field: '_changeset_id' }), this._schema);
        this._full = attrs.full != null ? !!attrs.full : true;
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
    get changesetFilter() {
        return this._changesetFilter;
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
    get full() {
        return this._full;
    }
    get hasFilter() {
        return this.statusFilter.hasFilter ||
            this.projectFilter.hasFilter ||
            this.assignmentFilter.hasFilter ||
            this.changesetFilter.hasFilter ||
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
    get defaultDateField() {
        return this.repeatableKey ? '_updated_at' : '_server_updated_at';
    }
    clearAllFilters() {
        this.statusFilter.reset();
        this.changesetFilter.reset();
        this.projectFilter.reset();
        this.assignmentFilter.reset();
        this.columnSettings.reset();
        this._filter = new condition_1.Condition(null, this._schema);
        this._sorting = new sort_expressions_1.default(null, this._schema);
        // this._boundingBox = null;
        this._searchFilter = '';
        this._dateFilter = new expression_1.Expression({ field: this.defaultDateField }, this._schema);
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
    toJSON({ boundingBox = false } = {}) {
        return {
            filter: this.filter.toJSON(),
            sorting: this.sorting.toJSON(),
            options: this.options.toJSON(),
            bounding_box: boundingBox ? this.boundingBox : null,
            search_filter: this.searchFilter,
            date_filter: this.dateFilter.toJSON(),
            columns: this.columnSettings.toJSON(),
            status_filter: this.statusFilter.toJSON(),
            changeset_filter: this.changesetFilter.toJSON(),
            project_filter: this.projectFilter.toJSON(),
            assignment_filter: this.assignmentFilter.toJSON()
        };
    }
    toRawAST(options) {
        return new converter_1.default().toAST(this, options);
    }
    toCountAST(options) {
        return new converter_1.default().toCountAST(this, options);
    }
    toTileAST(options) {
        return new converter_1.default().toTileAST(this, options);
    }
    toDistinctValuesAST(options) {
        return new converter_1.default().toDistinctValuesAST(this, options);
    }
    toHistogramAST(options) {
        return new converter_1.default().toHistogramAST(this, options);
    }
    toAST({ applySort, pageSize, pageIndex, outerLimit }) {
        const finalLimit = outerLimit ? (0, helpers_1.AConst)((0, helpers_1.IntegerValue)(+outerLimit)) : null;
        const sortClause = applySort ? this.outerSortClause : null;
        const fromClause = this.fromClause(Object.assign({ applySort, pageSize, pageIndex }, this.runtimeFilters));
        return (0, helpers_1.SelectStmt)({
            targetList: this.targetList(),
            fromClause: fromClause,
            sortClause: sortClause,
            limitCount: finalLimit,
        });
    }
    deparse(ast) {
        return new pg_query_deparser_1.default().deparse(ast);
    }
    toSchemaAST(ast, options) {
        return new converter_1.default().toSchemaAST(ast, options);
    }
    toDistinctValuesSQL(options) {
        return this.deparse(this.toDistinctValuesAST(options));
    }
    toHistogramSQL(options) {
        return this.deparse(this.toHistogramAST(options));
    }
    toCountSQL() {
        return this.deparse(this.toCountAST(this.runtimeFilters));
    }
    toSQL({ applySort, pageSize, pageIndex, outerLimit }) {
        const options = Object.assign({ applySort,
            pageSize,
            pageIndex,
            outerLimit }, this.runtimeFilters);
        return this.deparse(this.toAST(options));
    }
    toTileSQL() {
        return this.deparse(this.toTileAST(this.runtimeFilters));
    }
    toSummarySQL(columnSetting) {
        const ast = new converter_1.default().toSummaryAST(this, columnSetting, this.runtimeFilters);
        return this.deparse(ast);
    }
    targetList() {
        if (this.ast) {
            return [(0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)((0, helpers_1.AStar)()))];
        }
        if (!this.full) {
            return lodash_1.default.compact(this.columnSettings.enabledColumns.map(column => {
                if (column.element && !column.rawColumn) {
                    return null;
                }
                let columnAlias = column.columnName;
                if (column.join) {
                    columnAlias = [column.join.alias, column.columnName].join('_');
                }
                return (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)(column.columnName, column.source || 'records'), columnAlias);
            }));
        }
        const timeZoneCast = (columnRef) => {
            return (0, helpers_1.FuncCall)([(0, helpers_1.StringValue)('pg_catalog'), (0, helpers_1.StringValue)('timezone')], [(0, helpers_1.AConst)((0, helpers_1.StringValue)('UTC')), columnRef]);
        };
        const timeZoneFormat = (0, helpers_1.AConst)((0, helpers_1.StringValue)('YYYY-MM-DD"T"HH24:MI:SS"Z"'));
        const recordKeyColumns = [];
        const joinedColumns = [];
        // The "subJoinColumns" are joins that need to happen in the inner sub-select from Converter.
        // We don't need to join them in the outer part.
        const subJoinColumns = this.joinColumnsWithSorting;
        for (const column of this.schema._rawColumns) {
            if (column.name === '_record_key') {
                recordKeyColumns.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_record_key'), 'record_key'));
                recordKeyColumns.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_record_sequence'), 'record_sequence'));
                break;
            }
        }
        if (this.schema.createdByColumn) {
            if (subJoinColumns.indexOf(this.schema.createdByColumn) === -1) {
                joinedColumns.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('name', 'created_by'), 'created_by'));
            }
            else {
                joinedColumns.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('created_by.name'), 'created_by'));
            }
        }
        if (this.schema.updatedByColumn) {
            if (subJoinColumns.indexOf(this.schema.updatedByColumn) === -1) {
                joinedColumns.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('name', 'updated_by'), 'updated_by'));
            }
            else {
                joinedColumns.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('updated_by.name'), 'updated_by'));
            }
        }
        if (this.schema.assignedToColumn) {
            const alias = this.schema.assignedToColumn.join.alias;
            if (subJoinColumns.indexOf(this.schema.assignedToColumn) === -1) {
                joinedColumns.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('name', alias), alias));
            }
            else {
                joinedColumns.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)(alias + '.name'), alias));
            }
        }
        if (this.schema.projectColumn) {
            const alias = this.schema.projectColumn.join.alias;
            if (subJoinColumns.indexOf(this.schema.projectColumn) === -1) {
                joinedColumns.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('name', alias), alias));
            }
            else {
                joinedColumns.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)(alias + '.name'), alias));
            }
        }
        if (this.schema.recordSeriesColumn) {
            const alias = this.schema.recordSeriesColumn.join.alias;
            if (subJoinColumns.indexOf(this.schema.recordSeriesColumn) === -1) {
                joinedColumns.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('record_series_id', alias), 'record_series_id'));
                joinedColumns.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('rrule', alias), 'rrule'));
            }
            else {
                joinedColumns.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)(alias + '.record_series_id'), 'record_series_id'));
                joinedColumns.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)(alias + '.rrule'), 'rrule'));
            }
        }
        if (this.repeatableKey) {
            return [
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_record_status'), 'record_status'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_version'), 'version'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_child_record_id'), 'id'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_record_id'), 'record_id'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_parent_id'), 'parent_id'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_index'), 'index'),
                (0, helpers_1.ResTarget)((0, helpers_1.FuncCall)([(0, helpers_1.StringValue)('pg_catalog'), (0, helpers_1.StringValue)('date_part')], [(0, helpers_1.AConst)((0, helpers_1.StringValue)('epoch')), timeZoneCast((0, helpers_1.ColumnRef)('_server_created_at'))]), 'created_at'),
                (0, helpers_1.ResTarget)((0, helpers_1.FuncCall)([(0, helpers_1.StringValue)('pg_catalog'), (0, helpers_1.StringValue)('date_part')], [(0, helpers_1.AConst)((0, helpers_1.StringValue)('epoch')), timeZoneCast((0, helpers_1.ColumnRef)('_server_updated_at'))]), 'updated_at'),
                (0, helpers_1.ResTarget)((0, helpers_1.FuncCall)([(0, helpers_1.StringValue)('pg_catalog'), (0, helpers_1.StringValue)('date_part')], [(0, helpers_1.AConst)((0, helpers_1.StringValue)('epoch')), timeZoneCast((0, helpers_1.ColumnRef)('_created_at'))]), 'client_created_at'),
                (0, helpers_1.ResTarget)((0, helpers_1.FuncCall)([(0, helpers_1.StringValue)('pg_catalog'), (0, helpers_1.StringValue)('date_part')], [(0, helpers_1.AConst)((0, helpers_1.StringValue)('epoch')), timeZoneCast((0, helpers_1.ColumnRef)('_updated_at'))]), 'client_updated_at'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_created_by_id'), 'created_by_id'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_updated_by_id'), 'updated_by_id'),
                (0, helpers_1.ResTarget)((0, helpers_1.TypeCast)((0, helpers_1.TypeName)('text'), (0, helpers_1.AConst)((0, helpers_1.StringValue)(this.form.id))), 'form_id'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_record_project_id'), 'record_project_id'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_record_assigned_to_id'), 'record_assigned_to_id'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_form_values'), 'form_values'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_latitude'), 'latitude'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_longitude'), 'longitude'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_edited_duration'), 'edited_duration'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_updated_duration'), 'updated_duration'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_created_duration'), 'created_duration'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_changeset_id'), 'changeset_id'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_created_latitude'), 'created_latitude'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_created_longitude'), 'created_longitude'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_created_altitude'), 'created_altitude'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_created_horizontal_accuracy'), 'created_horizontal_accuracy'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_updated_latitude'), 'updated_latitude'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_updated_longitude'), 'updated_longitude'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_updated_altitude'), 'updated_altitude'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_updated_horizontal_accuracy'), 'updated_horizontal_accuracy'),
                ...joinedColumns
            ];
        }
        return [
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_status'), 'status'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_version'), 'version'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_record_id'), 'id'),
            (0, helpers_1.ResTarget)((0, helpers_1.FuncCall)('to_char', [timeZoneCast((0, helpers_1.ColumnRef)('_server_created_at')),
                timeZoneFormat]), 'created_at'),
            (0, helpers_1.ResTarget)((0, helpers_1.FuncCall)('to_char', [timeZoneCast((0, helpers_1.ColumnRef)('_server_updated_at')),
                timeZoneFormat]), 'updated_at'),
            (0, helpers_1.ResTarget)((0, helpers_1.FuncCall)('to_char', [timeZoneCast((0, helpers_1.ColumnRef)('_created_at')),
                timeZoneFormat]), 'client_created_at'),
            (0, helpers_1.ResTarget)((0, helpers_1.FuncCall)('to_char', [timeZoneCast((0, helpers_1.ColumnRef)('_updated_at')),
                timeZoneFormat]), 'client_updated_at'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_created_by_id'), 'created_by_id'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_updated_by_id'), 'updated_by_id'),
            (0, helpers_1.ResTarget)((0, helpers_1.TypeCast)((0, helpers_1.TypeName)('text'), (0, helpers_1.AConst)((0, helpers_1.StringValue)(this.form.id))), 'form_id'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_project_id'), 'project_id'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_assigned_to_id'), 'assigned_to_id'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_form_values'), 'form_values'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_latitude'), 'latitude'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_longitude'), 'longitude'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_altitude'), 'altitude'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_speed'), 'speed'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_course'), 'course'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_horizontal_accuracy'), 'horizontal_accuracy'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_vertical_accuracy'), 'vertical_accuracy'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_edited_duration'), 'edited_duration'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_updated_duration'), 'updated_duration'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_created_duration'), 'created_duration'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_changeset_id'), 'changeset_id'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_created_latitude'), 'created_latitude'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_created_longitude'), 'created_longitude'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_created_altitude'), 'created_altitude'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_created_horizontal_accuracy'), 'created_horizontal_accuracy'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_updated_latitude'), 'updated_latitude'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_updated_longitude'), 'updated_longitude'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_updated_altitude'), 'updated_altitude'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_updated_horizontal_accuracy'), 'updated_horizontal_accuracy'),
            ...recordKeyColumns,
            ...joinedColumns
        ];
    }
    fromClause({ applySort, pageSize, pageIndex, boundingBox, searchFilter }) {
        const ast = applySort ? this.toRawAST({ sort: this.sortClause, pageSize, pageIndex, boundingBox, searchFilter })
            : this.toRawAST({ boundingBox, searchFilter });
        let baseQuery = (0, helpers_1.RangeSubselect)(ast, (0, helpers_1.Alias)('records'));
        if (this.ast) {
            return [baseQuery];
        }
        // The "subJoinColumns" are joins that need to happen in the inner sub-select from Converter.
        // We don't need to join them in the outer part.
        if (this.schema.createdByColumn) {
            baseQuery = converter_1.default.joinClause(baseQuery, this.schema.createdByColumn.join);
        }
        if (this.schema.updatedByColumn) {
            baseQuery = converter_1.default.joinClause(baseQuery, this.schema.updatedByColumn.join);
        }
        if (this.schema.assignedToColumn) {
            baseQuery = converter_1.default.joinClause(baseQuery, this.schema.assignedToColumn.join);
        }
        if (this.schema.projectColumn) {
            baseQuery = converter_1.default.joinClause(baseQuery, this.schema.projectColumn.join);
        }
        if (this.schema.recordSeriesColumn) {
            baseQuery = converter_1.default.joinClause(baseQuery, this.schema.recordSeriesColumn.join);
        }
        return [baseQuery];
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
                    (0, helpers_1.SortBy)((0, helpers_1.ColumnRef)(sort.column.id, sort.column.source), direction, 0)
                ];
            }
            return [
                (0, helpers_1.SortBy)((0, helpers_1.ColumnRef)(sort.column.columnName, sort.column.source || 'records'), direction, 0),
                (0, helpers_1.SortBy)((0, helpers_1.ColumnRef)('_record_id', 'records'), direction, 0)
            ];
        });
        return lodash_1.default.flatten(sorts);
    }
    get systemSortClause() {
        if (this.ast) {
            return [(0, helpers_1.SortBy)((0, helpers_1.AConst)((0, helpers_1.IntegerValue)(1)), 2, 0)];
        }
        if (this.repeatableKey) {
            return [(0, helpers_1.SortBy)((0, helpers_1.ColumnRef)('_updated_at'), 2, 0)];
        }
        return [(0, helpers_1.SortBy)((0, helpers_1.ColumnRef)('_server_updated_at'), 2, 0)];
    }
    get outerSortClause() {
        return [(0, helpers_1.SortBy)((0, helpers_1.ColumnRef)('__row_number'), 1, 0)];
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
        // if ((description = this.filter.toHumanDescription())) {
        //   parts.push(description);
        // }
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
            converter_1.default.duplicateResTargetWithExactName(this, this.ast.SelectStmt.targetList, geometryColumn, '__geometry');
        }
    }
}
exports.default = Query;
//# sourceMappingURL=query.js.map