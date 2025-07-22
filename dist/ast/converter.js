"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const lodash_1 = __importDefault(require("lodash"));
const helpers_1 = require("./helpers");
const condition_1 = require("../condition");
const operator_1 = require("../operator");
const aggregate_1 = require("../aggregate");
const MAX_DISTINCT_VALUES = 1000;
const MAX_TILE_RECORDS = 1000;
const columnRef = (column) => {
    return column.isSQL ? (0, helpers_1.ColumnRef)(column.id, column.source)
        : (0, helpers_1.ColumnRef)(column.columnName, column.source);
};
class Converter {
    constructor() {
        this.BooleanConverter = (type, condition, options) => {
            const args = this.nodeForExpressions(condition.expressions, options);
            if (args && args.length) {
                return (0, helpers_1.BoolExpr)(type, args);
            }
            return null;
        };
        this.AndConverter = (condition, options) => {
            return this.BooleanConverter(0, condition, options);
        };
        this.OrConverter = (condition, options) => {
            return this.BooleanConverter(1, condition, options);
        };
        this.NotConverter = (condition, options) => {
            if (condition.expressions.length > 1) {
                return (0, helpers_1.BoolExpr)(2, [this.BooleanConverter(0, condition, options)]);
            }
            return this.BooleanConverter(2, condition, options);
        };
        this.NotEmptyConverter = (expression) => {
            if (expression.column.isArray && expression.column.part === 'captions') {
                const nullTest = (0, helpers_1.NullTest)(1, columnRef(expression.column));
                const arrayLen = (0, helpers_1.FuncCall)('length', [(0, helpers_1.FuncCall)('array_to_string', [columnRef(expression.column), (0, helpers_1.AConst)((0, helpers_1.StringValue)(''))])]);
                const lenTest = (0, helpers_1.AExpr)(0, '>', arrayLen, (0, helpers_1.AConst)((0, helpers_1.IntegerValue)(0)));
                return (0, helpers_1.BoolExpr)(0, [nullTest, lenTest]);
            }
            return (0, helpers_1.NullTest)(1, columnRef(expression.column));
        };
        this.EmptyConverter = (expression) => {
            if (expression.column.isArray && expression.column.part === 'captions') {
                const nullTest = (0, helpers_1.NullTest)(0, columnRef(expression.column));
                const arrayPos = (0, helpers_1.CoalesceExpr)([(0, helpers_1.FuncCall)('array_position', [columnRef(expression.column), (0, helpers_1.StringValue)('NULL')]), (0, helpers_1.AConst)((0, helpers_1.IntegerValue)(0))]);
                const lenTest = (0, helpers_1.AExpr)(0, '>', arrayPos, (0, helpers_1.AConst)((0, helpers_1.IntegerValue)(0)));
                return (0, helpers_1.BoolExpr)(1, [nullTest, lenTest]);
            }
            return (0, helpers_1.NullTest)(0, columnRef(expression.column));
        };
        this.EqualConverter = (expression) => {
            return this.BinaryConverter(0, '=', expression);
        };
        this.NotEqualConverter = (expression) => {
            return this.BinaryConverter(0, '<>', expression);
        };
        this.GreaterThanConverter = (expression) => {
            return this.BinaryConverter(0, '>', expression);
        };
        this.GreaterThanOrEqualConverter = (expression) => {
            return this.BinaryConverter(0, '>=', expression);
        };
        this.LessThanConverter = (expression) => {
            return this.BinaryConverter(0, '<', expression);
        };
        this.LessThanOrEqualConverter = (expression) => {
            return this.BinaryConverter(0, '<=', expression);
        };
        this.BetweenConverter = (expression, options) => {
            let value1 = expression.value1;
            let value2 = expression.value2;
            if (expression.isDateOperator) {
                value1 = value1 && this.ConvertDateValue(expression, this.GetDate(value1, options).startOf('day'));
                value2 = value2 && this.ConvertDateValue(expression, this.GetDate(value2, options).endOf('day'));
            }
            return this.Between(expression.column, value1, value2);
        };
        this.NotBetweenConverter = (expression, options) => {
            let value1 = expression.value1;
            let value2 = expression.value2;
            if (expression.isDateOperator) {
                value1 = value1 && this.ConvertDateValue(expression, this.GetDate(value1, options).startOf('day'));
                value2 = value2 && this.ConvertDateValue(expression, this.GetDate(value2, options).endOf('day'));
            }
            return this.NotBetween(expression.column, value1, value2);
        };
        this.InConverter = (expression) => {
            return this.In(expression.column, expression.arrayValue);
        };
        this.NotInConverter = (expression) => {
            return this.NotIn(expression.column, expression.arrayValue);
        };
        this.BinaryConverter = (kind, operator, expression) => {
            return (0, helpers_1.AExpr)(kind, operator, columnRef(expression.column), this.ConstValue(expression.column, expression.scalarValue));
        };
        this.FieldConverter = (expression) => {
            return (0, helpers_1.ColumnRef)(expression.name);
        };
        this.ConstantConverter = (expression) => {
            return this.ConstValue(expression.column, expression.scalarValue);
        };
        this.TextEqualConverter = (expression) => {
            return (0, helpers_1.AExpr)(8, '~~*', this.ConvertToText(expression.column), this.ConstValue(expression.column, expression.scalarValue));
        };
        this.TextNotEqualConverter = (expression) => {
            return (0, helpers_1.AExpr)(8, '!~~*', this.ConvertToText(expression.column), this.ConstValue(expression.column, expression.scalarValue));
        };
        this.TextContainConverter = (expression) => {
            return (0, helpers_1.AExpr)(8, '~~*', this.ConvertToText(expression.column), (0, helpers_1.AConst)((0, helpers_1.StringValue)('%' + this.escapeLikePercent(expression.scalarValue) + '%')));
        };
        this.TextNotContainConverter = (expression) => {
            return (0, helpers_1.AExpr)(8, '!~~*', this.ConvertToText(expression.column), (0, helpers_1.AConst)((0, helpers_1.StringValue)('%' + this.escapeLikePercent(expression.scalarValue) + '%')));
        };
        this.TextStartsWithConverter = (expression) => {
            return (0, helpers_1.AExpr)(8, '~~*', this.ConvertToText(expression.column), (0, helpers_1.AConst)((0, helpers_1.StringValue)(this.escapeLikePercent(expression.scalarValue) + '%')));
        };
        this.TextEndsWithConverter = (expression) => {
            return (0, helpers_1.AExpr)(8, '~~*', this.ConvertToText(expression.column), (0, helpers_1.AConst)((0, helpers_1.StringValue)('%' + this.escapeLikePercent(expression.scalarValue))));
        };
        this.TextMatchConverter = (expression) => {
            if (this.IsValidRegExp(expression.scalarValue)) {
                return (0, helpers_1.AExpr)(0, '~*', this.ConvertToText(expression.column), (0, helpers_1.AConst)((0, helpers_1.StringValue)(expression.scalarValue)));
            }
            return null;
        };
        this.TextNotMatchConverter = (expression) => {
            if (this.IsValidRegExp(expression.scalarValue)) {
                return (0, helpers_1.AExpr)(0, '!~*', this.ConvertToText(expression.column), (0, helpers_1.AConst)((0, helpers_1.StringValue)(expression.scalarValue)));
            }
            return null;
        };
        this.ArrayAnyOfConverter = (expression) => {
            return this.AnyOf(expression.column, expression.arrayValue);
        };
        this.ArrayAllOfConverter = (expression) => {
            const values = (0, helpers_1.AArrayExpr)(expression.arrayValue.map(v => this.ConstValue(expression.column, v)));
            return (0, helpers_1.AExpr)(0, '@>', columnRef(expression.column), values);
        };
        this.ArrayIsContainedIn = (expression) => {
            const values = (0, helpers_1.AArrayExpr)(expression.arrayValue.map(v => this.ConstValue(expression.column, v)));
            return (0, helpers_1.AExpr)(0, '<@', columnRef(expression.column), values);
        };
        this.ArrayEqualConverter = (expression) => {
            const values = (0, helpers_1.AArrayExpr)(expression.arrayValue.map(v => this.ConstValue(expression.column, v)));
            const a = (0, helpers_1.AExpr)(0, '<@', columnRef(expression.column), values);
            const b = (0, helpers_1.AExpr)(0, '@>', columnRef(expression.column), values);
            return (0, helpers_1.BoolExpr)(0, [a, b]);
        };
        this.SearchConverter = (expression) => {
            const rhs = (0, helpers_1.FuncCall)('to_tsquery', [this.ConstValue(expression.column, expression.scalarValue)]);
            return (0, helpers_1.AExpr)(0, '@@', columnRef(expression.column), rhs);
        };
        this.DynamicDateConverter = (expression, options) => {
            // Let the caller specify the timezone to be used for dynamic date calculations. This
            // makes sure when the browser calculates a dynamic range, the server would calculate
            // the same range. So 'Today' is midnight to midnight in the user's local time. It would
            // be much less useful and confusing if we forced "Today" to always be London's today.
            const now = this.GetDate(null, options);
            const range = (0, operator_1.calculateDateRange)(expression.column, expression.operator, expression.value, now);
            const value1 = this.ConvertDateValue(expression, range[0]);
            const value2 = this.ConvertDateValue(expression, range[1]);
            return this.Between(expression.column, value1, value2);
        };
        this.NotBetween = (column, value1, value2) => {
            if (value1 != null && value2 != null) {
                return (0, helpers_1.AExpr)(11, 'NOT BETWEEN', columnRef(column), [this.ConstValue(column, value1), this.ConstValue(column, value2)]);
            }
            else if (value1 != null) {
                return (0, helpers_1.AExpr)(0, '<', columnRef(column), this.ConstValue(column, value1));
            }
            else if (value2 != null) {
                return (0, helpers_1.AExpr)(0, '>', columnRef(column), this.ConstValue(column, value2));
            }
            return null;
        };
        this.AnyOf = (column, values) => {
            const arrayValues = (0, helpers_1.AArrayExpr)(values.map(v => this.ConstValue(column, v)));
            return (0, helpers_1.AExpr)(0, '&&', columnRef(column), arrayValues);
        };
        this.In = (column, values) => {
            let hasNull = false;
            const inValues = [];
            values.forEach(v => {
                if (v != null) {
                    inValues.push(v);
                }
                else {
                    hasNull = true;
                }
            });
            let expression = null;
            if (inValues.length) {
                expression = (0, helpers_1.AExpr)(6, '=', columnRef(column), inValues.map(v => this.ConstValue(column, v)));
                if (hasNull) {
                    expression = (0, helpers_1.BoolExpr)(1, [(0, helpers_1.NullTest)(0, columnRef(column)), expression]);
                }
            }
            else if (hasNull) {
                expression = (0, helpers_1.NullTest)(0, columnRef(column));
            }
            return expression;
        };
        this.NotIn = (column, values) => {
            let hasNull = false;
            const inValues = [];
            values.forEach(v => {
                if (v != null) {
                    inValues.push(v);
                }
                else {
                    hasNull = true;
                }
            });
            let expression = null;
            if (inValues.length) {
                expression = (0, helpers_1.AExpr)(6, '<>', columnRef(column), inValues.map(v => this.ConstValue(column, v)));
                if (hasNull) {
                    expression = (0, helpers_1.BoolExpr)(1, [(0, helpers_1.NullTest)(1, columnRef(column)), expression]);
                }
            }
            else if (hasNull) {
                expression = (0, helpers_1.NullTest)(1, columnRef(column));
            }
            return expression;
        };
        this.Between = (column, value1, value2) => {
            if (value1 != null && value2 != null) {
                return (0, helpers_1.AExpr)(10, 'BETWEEN', columnRef(column), [this.ConstValue(column, value1), this.ConstValue(column, value2)]);
            }
            else if (value1 != null) {
                return (0, helpers_1.AExpr)(0, '>=', columnRef(column), this.ConstValue(column, value1));
            }
            else if (value2 != null) {
                return (0, helpers_1.AExpr)(0, '<=', columnRef(column), this.ConstValue(column, value2));
            }
            return null;
        };
        this.ConstValue = (column, value) => {
            if (value == null) {
                return null;
            }
            if (column.isInteger) {
                return (0, helpers_1.AConst)((0, helpers_1.IntegerValue)(value));
            }
            if (column.isNumber) {
                console.log('ConstValue, column isNumber');
                return (0, helpers_1.AConst)((0, helpers_1.FloatValue)(value));
            }
            console.log('ConstValue, value being converted to string');
            return (0, helpers_1.AConst)((0, helpers_1.StringValue)(value));
        };
        this.GetDate = (dateString, options) => {
            const timeZone = (options && options.timeZone) || moment_timezone_1.default.tz.guess();
            return moment_timezone_1.default.tz(dateString !== null && dateString !== void 0 ? dateString : new Date().toISOString(), timeZone);
        };
        this.ConvertDateValue = (expression, date) => {
            if (date && expression.column.element.isCalculatedElement) {
                console.log('ConvertDateValue with this date', date);
                console.log('Converting to number i hope', date.getTime() / 1000);
                return date;
            }
            else if (date) {
                return expression.column.isDateTime ? date.toISOString() : date.format('YYYY-MM-DD');
            }
            return null;
        };
        this.ConvertToText = (column) => {
            if (column.isDate || column.isTime || column.isArray) {
                return (0, helpers_1.TypeCast)((0, helpers_1.TypeName)('text'), columnRef(column));
            }
            return columnRef(column);
        };
        this.IsValidRegExp = (string) => {
            try {
                return !!(new RegExp(string));
            }
            catch (ex) {
                return false;
            }
        };
    }
    toAST(query, { sort, pageSize, pageIndex, boundingBox, searchFilter }) {
        const targetList = this.targetList(query, sort, boundingBox);
        const joins = query.joinColumnsWithSorting.map(o => o.join);
        const fromClause = this.fromClause(query, joins);
        const whereClause = this.whereClause(query, boundingBox, searchFilter);
        const sortClause = sort;
        const limitOffset = this.limitOffset(pageSize, pageIndex);
        const limitCount = this.limitCount(pageSize);
        return (0, helpers_1.SelectStmt)({ targetList, fromClause, whereClause, sortClause, limitOffset, limitCount });
    }
    toCountAST(query, { boundingBox, searchFilter }) {
        const targetList = [(0, helpers_1.ResTarget)((0, helpers_1.FuncCall)('count', [(0, helpers_1.AConst)((0, helpers_1.IntegerValue)(1))]), 'total_count')];
        const joins = query.joinColumns.map(o => o.join);
        const fromClause = this.fromClause(query, joins);
        const whereClause = this.whereClause(query, boundingBox, searchFilter);
        return (0, helpers_1.SelectStmt)({ targetList, fromClause, whereClause });
    }
    toTileAST(query, { searchFilter }, maxTileRecords, sorting = {}) {
        let sortClause = null;
        let targetList = null;
        if (query.ast) {
            const sort = [(0, helpers_1.SortBy)((0, helpers_1.AConst)((0, helpers_1.IntegerValue)(1)), 0, 0)];
            targetList = [
                (0, helpers_1.ResTarget)((0, helpers_1.FuncCall)('row_number', null, { over: (0, helpers_1.WindowDef)(sort, 530) }), '__id'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('__geometry'))
            ];
        }
        else {
            const statusColumn = query.schema.repeatable ? '_record_status' : '_status';
            targetList = [
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)(query.schema.repeatable ? '_child_record_id' : '_record_id'), 'id'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_geometry'), 'geometry'),
                (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)(statusColumn), 'status'),
                (0, helpers_1.ResTarget)((0, helpers_1.TypeCast)((0, helpers_1.TypeName)('text'), (0, helpers_1.AConst)((0, helpers_1.StringValue)(query.form.id))), 'form_id')
            ];
            if (query.schema.repeatable) {
                targetList.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_record_id'), 'record_id'));
                targetList.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_parent_id'), 'parent_id'));
            }
        }
        if (sorting && sorting.field && sorting.direction) {
            if (sorting.field.startsWith('_')) {
                targetList.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)(sorting.field), 'sorting_field'));
            }
            else {
                targetList.push((0, helpers_1.ResTarget)((0, helpers_1.TypeCast)((0, helpers_1.TypeName)('text'), (0, helpers_1.AConst)((0, helpers_1.StringValue)(sorting.field))), 'sorting_field'));
            }
            sortClause = [((0, helpers_1.SortBy)((0, helpers_1.ColumnRef)('sorting_field'), sorting.direction, 0))];
        }
        const joins = query.joinColumns.map(o => o.join);
        const fromClause = this.fromClause(query, joins);
        const whereClause = this.whereClause(query, null, searchFilter);
        const maxTileLimit = (maxTileRecords > 0) ? maxTileRecords : MAX_TILE_RECORDS;
        const limitCount = this.limitCount(maxTileLimit);
        return (0, helpers_1.SelectStmt)({ targetList, fromClause, whereClause, sortClause, limitCount });
    }
    toHistogramAST(query, { column, bucketSize, type, sort, pageSize, pageIndex, boundingBox, searchFilter }) {
        const subLinkColumn = (col, table) => {
            return (0, helpers_1.SubLink)(4, (0, helpers_1.SelectStmt)({
                targetList: [(0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)(col))],
                fromClause: [(0, helpers_1.RangeVar)(table)]
            }));
        };
        const expr = (lhs, op, rhs) => {
            return (0, helpers_1.AExpr)(0, op, lhs, rhs);
        };
        const targetList = [
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('series', 'series'), 'bucket'),
            (0, helpers_1.ResTarget)((0, helpers_1.CoalesceExpr)([(0, helpers_1.ColumnRef)('count', 'sub'), (0, helpers_1.AConst)((0, helpers_1.IntegerValue)(0))]), 'count'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('min_value', 'sub'), 'min_value'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('max_value', 'sub'), 'max_value'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('avg_value', 'sub'), 'avg_value'),
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('sum_value', 'sub'), 'sum_value'),
            (0, helpers_1.ResTarget)(expr(subLinkColumn('min_value', '__stats'), '+', expr(expr((0, helpers_1.ColumnRef)('series', 'series'), '-', (0, helpers_1.AConst)((0, helpers_1.IntegerValue)(1))), '*', subLinkColumn('bucket_width', '__stats'))), 'bucket_min'),
            (0, helpers_1.ResTarget)(expr(subLinkColumn('min_value', '__stats'), '+', expr((0, helpers_1.ColumnRef)('series', 'series'), '*', subLinkColumn('bucket_width', '__stats'))), 'bucket_max'),
            (0, helpers_1.ResTarget)(subLinkColumn('range', '__stats'), 'range'),
            (0, helpers_1.ResTarget)(subLinkColumn('bucket_width', '__stats'), 'bucket_width')
        ];
        const withClause = this.histogramWithClause(column, bucketSize, type, query, boundingBox, searchFilter);
        const seriesFunctionSublinkSelect = (0, helpers_1.SelectStmt)({
            targetList: [(0, helpers_1.ResTarget)((0, helpers_1.AExpr)(0, '+', (0, helpers_1.ColumnRef)('buckets'), (0, helpers_1.AConst)((0, helpers_1.IntegerValue)(1))))],
            fromClause: [(0, helpers_1.RangeVar)('__stats')]
        });
        const seriesFunctionArgs = [
            (0, helpers_1.AConst)((0, helpers_1.IntegerValue)(1)),
            (0, helpers_1.SubLink)(4, seriesFunctionSublinkSelect)
        ];
        const seriesFunctionCall = (0, helpers_1.FuncCall)('generate_series', seriesFunctionArgs);
        const seriesFunction = (0, helpers_1.RangeFunction)([[seriesFunctionCall]], (0, helpers_1.Alias)('series'));
        const bucketWidthFunctionCallArgs = [
            (0, helpers_1.TypeCast)((0, helpers_1.TypeName)([(0, helpers_1.StringValue)('pg_catalog'), (0, helpers_1.StringValue)('float8')]), (0, helpers_1.ColumnRef)('value')),
            (0, helpers_1.SubLink)(4, (0, helpers_1.SelectStmt)({ targetList: [(0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('min_value'))], fromClause: [(0, helpers_1.RangeVar)('__stats')] })),
            (0, helpers_1.SubLink)(4, (0, helpers_1.SelectStmt)({ targetList: [(0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('max_value'))], fromClause: [(0, helpers_1.RangeVar)('__stats')] })),
            (0, helpers_1.SubLink)(4, (0, helpers_1.SelectStmt)({ targetList: [(0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('buckets'))], fromClause: [(0, helpers_1.RangeVar)('__stats')] }))
        ];
        const bucketsSubqueryTargetList = [
            (0, helpers_1.ResTarget)((0, helpers_1.FuncCall)('width_bucket', bucketWidthFunctionCallArgs), 'bucket'),
            (0, helpers_1.ResTarget)((0, helpers_1.FuncCall)('count', [(0, helpers_1.AConst)((0, helpers_1.IntegerValue)(1))]), 'count'),
            (0, helpers_1.ResTarget)((0, helpers_1.FuncCall)('min', [(0, helpers_1.ColumnRef)('value')]), 'min_value'),
            (0, helpers_1.ResTarget)((0, helpers_1.FuncCall)('max', [(0, helpers_1.ColumnRef)('value')]), 'max_value'),
            (0, helpers_1.ResTarget)((0, helpers_1.FuncCall)('avg', [(0, helpers_1.ColumnRef)('value')]), 'avg_value'),
            (0, helpers_1.ResTarget)((0, helpers_1.FuncCall)('sum', [(0, helpers_1.ColumnRef)('value')]), 'sum_value')
        ];
        const bucketsSubqueryFromClause = [(0, helpers_1.RangeVar)('__records')];
        const bucketsSubqueryGroupClause = [(0, helpers_1.AConst)((0, helpers_1.IntegerValue)(1))];
        const bucketsSubquerySortClause = [(0, helpers_1.SortBy)((0, helpers_1.AConst)((0, helpers_1.IntegerValue)(1)), 0, 0)];
        const bucketsSubquery = (0, helpers_1.SelectStmt)({
            targetList: bucketsSubqueryTargetList,
            fromClause: bucketsSubqueryFromClause,
            groupClause: bucketsSubqueryGroupClause,
            sortClause: bucketsSubquerySortClause
        });
        const bucketsSubselect = (0, helpers_1.RangeSubselect)(bucketsSubquery, (0, helpers_1.Alias)('sub'));
        const joinExpr = (0, helpers_1.JoinExpr)(1, seriesFunction, bucketsSubselect, (0, helpers_1.AExpr)(0, '=', (0, helpers_1.ColumnRef)('series', 'series'), (0, helpers_1.ColumnRef)('bucket', 'sub')));
        return (0, helpers_1.SelectStmt)({ targetList, fromClause: [joinExpr], withClause });
    }
    toDistinctValuesAST(query, options = {}) {
        const valueColumn = query.ast ? (0, helpers_1.ColumnRef)(options.column.id) : columnRef(options.column);
        let targetList = null;
        const isLinkedRecord = options.column.element && options.column.element.isRecordLinkElement;
        if (isLinkedRecord) {
            targetList = [(0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('linked_record_id', '__linked_join'), 'value')];
        }
        else if (options.column.isArray && options.unnestArrays !== false) {
            targetList = [(0, helpers_1.ResTarget)((0, helpers_1.FuncCall)('unnest', [valueColumn]), 'value')];
        }
        else if (options.column.element && options.column.element.isCalculatedElement && options.column.element.display.isDate) {
            // SELECT pg_catalog.timezone('UTC', to_timestamp(column_name))::date
            const timeZoneCast = (param) => {
                return (0, helpers_1.FuncCall)([(0, helpers_1.StringValue)('pg_catalog'), (0, helpers_1.StringValue)('timezone')], [(0, helpers_1.AConst)((0, helpers_1.StringValue)('UTC')), param]);
            };
            const toTimestamp = (param) => {
                return (0, helpers_1.FuncCall)([(0, helpers_1.StringValue)('pg_catalog'), (0, helpers_1.StringValue)('to_timestamp')], [param]);
            };
            targetList = [(0, helpers_1.ResTarget)((0, helpers_1.TypeCast)((0, helpers_1.TypeName)('date'), timeZoneCast(toTimestamp(valueColumn))), 'value')];
        }
        else {
            targetList = [(0, helpers_1.ResTarget)(valueColumn, 'value')];
        }
        targetList.push((0, helpers_1.ResTarget)((0, helpers_1.FuncCall)('count', [(0, helpers_1.AConst)((0, helpers_1.IntegerValue)(1))]), 'count'));
        if (isLinkedRecord) {
            targetList.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('__title', '__linked'), 'label'));
        }
        const joins = query.joinColumns.map(o => o.join);
        if (options.column.join) {
            joins.push(options.column.join);
        }
        if (isLinkedRecord) {
            joins.push({ inner: false,
                tableName: `${query.form.id}/${options.column.element.key}`,
                alias: '__linked_join',
                sourceColumn: '_record_id',
                joinColumn: 'source_record_id' });
            const subQuery = (0, helpers_1.SelectStmt)({
                targetList: [(0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_title'), '__title'),
                    (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('_record_id'), '__record_id')],
                fromClause: [(0, helpers_1.RangeVar)(`${options.column.element.form.id}`)]
            });
            const linkedSubselect = (0, helpers_1.RangeSubselect)(subQuery, (0, helpers_1.Alias)('__linked'));
            joins.push({ inner: false,
                rarg: linkedSubselect,
                alias: '__linked',
                sourceTableName: '__linked_join',
                sourceColumn: 'linked_record_id',
                joinColumn: '__record_id' });
        }
        const fromClause = this.fromClause(query, joins, [options.column]);
        // const whereClause = null; // options.all ? null : this.whereClause(query);
        // TODO(zhm) need to pass the bbox and search here?
        const whereClause = this.whereClause(query, null, null, options);
        const groupClause = [(0, helpers_1.AConst)((0, helpers_1.IntegerValue)(1))];
        if (isLinkedRecord) {
            groupClause.push((0, helpers_1.AConst)((0, helpers_1.IntegerValue)(3)));
        }
        const sortClause = [];
        if (options.by === 'frequency') {
            sortClause.push((0, helpers_1.SortBy)((0, helpers_1.AConst)((0, helpers_1.IntegerValue)(2)), 2, 0));
        }
        if (isLinkedRecord) {
            sortClause.push((0, helpers_1.SortBy)((0, helpers_1.AConst)((0, helpers_1.IntegerValue)(3)), 1, 0));
        }
        sortClause.push((0, helpers_1.SortBy)((0, helpers_1.AConst)((0, helpers_1.IntegerValue)(1)), 1, 0));
        const limitCount = this.limitCount(MAX_DISTINCT_VALUES);
        return (0, helpers_1.SelectStmt)({ targetList, fromClause, whereClause, groupClause, sortClause, limitCount });
    }
    toSummaryAST(query, columnSetting, { boundingBox, searchFilter }) {
        if (columnSetting.summary.aggregate === aggregate_1.AggregateType.Histogram.name) {
            const histogramAttributes = {
                column: columnSetting.column,
                bucketSize: 12,
                type: columnSetting.column.isDate ? 'date' : 'number',
                sort: null,
                boundingBox,
                searchFilter
            };
            return this.toHistogramAST(query, histogramAttributes);
        }
        const targetList = this.summaryTargetList(query, columnSetting);
        const joins = query.joinColumns.map(o => o.join);
        if (columnSetting.column.join) {
            joins.push(columnSetting.column.join);
        }
        const fromClause = this.fromClause(query, joins, [columnSetting.column]);
        const whereClause = this.summaryWhereClause(query, columnSetting, { boundingBox, searchFilter });
        return (0, helpers_1.SelectStmt)({ targetList, fromClause, whereClause });
    }
    histogramWithClause(column, bucketSize, type, query, boundingBox, searchFilter) {
        let recordsTargetList = null;
        if (type === 'date') {
            const datePartArgs = [
                (0, helpers_1.AConst)((0, helpers_1.StringValue)('epoch')),
                (0, helpers_1.TypeCast)((0, helpers_1.TypeName)('date'), columnRef(column))
            ];
            recordsTargetList = [(0, helpers_1.ResTarget)((0, helpers_1.FuncCall)('date_part', datePartArgs), 'value')];
        }
        else {
            recordsTargetList = [(0, helpers_1.ResTarget)((0, helpers_1.TypeCast)((0, helpers_1.TypeName)([(0, helpers_1.StringValue)('pg_catalog'), (0, helpers_1.StringValue)('float8')]), columnRef(column)), 'value')];
        }
        const joins = query.joinColumnsWithSorting.map(o => o.join);
        const recordsFromClause = this.fromClause(query, joins, [column]);
        const recordsWhere = this.whereClause(query, boundingBox, searchFilter);
        const recordsSelect = (0, helpers_1.SelectStmt)({ targetList: recordsTargetList, fromClause: recordsFromClause, whereClause: recordsWhere });
        const recordsExpr = (0, helpers_1.CommonTableExpr)('__records', recordsSelect);
        const statsTargetList = [
            (0, helpers_1.ResTarget)((0, helpers_1.AConst)((0, helpers_1.IntegerValue)(bucketSize)), 'buckets'),
            (0, helpers_1.ResTarget)((0, helpers_1.FuncCall)('count', [(0, helpers_1.AConst)((0, helpers_1.IntegerValue)(1))]), 'count'),
            (0, helpers_1.ResTarget)((0, helpers_1.FuncCall)('min', [(0, helpers_1.ColumnRef)('value')]), 'min_value'),
            (0, helpers_1.ResTarget)((0, helpers_1.FuncCall)('max', [(0, helpers_1.ColumnRef)('value')]), 'max_value'),
            (0, helpers_1.ResTarget)((0, helpers_1.AExpr)(0, '-', (0, helpers_1.FuncCall)('max', [(0, helpers_1.ColumnRef)('value')]), (0, helpers_1.FuncCall)('min', [(0, helpers_1.ColumnRef)('value')])), 'range'),
            (0, helpers_1.ResTarget)((0, helpers_1.AExpr)(0, '/', (0, helpers_1.AExpr)(0, '-', (0, helpers_1.TypeCast)((0, helpers_1.TypeName)([(0, helpers_1.StringValue)('pg_catalog'), (0, helpers_1.StringValue)('float8')]), (0, helpers_1.FuncCall)('max', [(0, helpers_1.ColumnRef)('value')])), (0, helpers_1.TypeCast)((0, helpers_1.TypeName)([(0, helpers_1.StringValue)('pg_catalog'), (0, helpers_1.StringValue)('float8')]), (0, helpers_1.FuncCall)('min', [(0, helpers_1.ColumnRef)('value')]))), (0, helpers_1.AConst)((0, helpers_1.FloatValue)(bucketSize))), 'bucket_width')
        ];
        const statsFromClause = [(0, helpers_1.RangeVar)('__records')];
        const statsSelect = (0, helpers_1.SelectStmt)({ targetList: statsTargetList, fromClause: statsFromClause });
        const statsExpr = (0, helpers_1.CommonTableExpr)('__stats', statsSelect);
        return (0, helpers_1.WithClause)([recordsExpr, statsExpr]);
    }
    toSchemaAST(query, { schemaOnly } = {}) {
        // wrap the query in a subquery with 1=0
        const targetList = [(0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)((0, helpers_1.AStar)()))];
        const fromClause = [(0, helpers_1.RangeSubselect)(query, (0, helpers_1.Alias)('wrapped'))];
        const whereClause = schemaOnly ? (0, helpers_1.AExpr)(0, '=', (0, helpers_1.AConst)((0, helpers_1.IntegerValue)(0)), (0, helpers_1.AConst)((0, helpers_1.IntegerValue)(1))) : null;
        return (0, helpers_1.SelectStmt)({ targetList, fromClause, whereClause });
    }
    limitOffset(pageSize, pageIndex) {
        if (pageSize != null && pageIndex != null) {
            return (0, helpers_1.AConst)((0, helpers_1.IntegerValue)(+pageIndex * +pageSize));
        }
        return null;
    }
    limitCount(pageSize) {
        if (pageSize != null) {
            return (0, helpers_1.AConst)((0, helpers_1.IntegerValue)(+pageSize));
        }
        return null;
    }
    targetList(query, sort, boundingBox) {
        const list = [
            (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)((0, helpers_1.AStar)(), 'records'))
        ];
        const subJoinColumns = query.joinColumnsWithSorting;
        if (subJoinColumns.indexOf(query.schema.createdByColumn) !== -1) {
            list.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('name', query.schema.createdByColumn.join.alias), query.schema.createdByColumn.id));
        }
        if (subJoinColumns.indexOf(query.schema.updatedByColumn) !== -1) {
            list.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('name', query.schema.updatedByColumn.join.alias), query.schema.updatedByColumn.id));
        }
        if (subJoinColumns.indexOf(query.schema.assignedToColumn) !== -1) {
            list.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('name', query.schema.assignedToColumn.join.alias), query.schema.assignedToColumn.id));
        }
        if (subJoinColumns.indexOf(query.schema.projectColumn) !== -1) {
            list.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('name', query.schema.projectColumn.join.alias), query.schema.projectColumn.id));
        }
        if (subJoinColumns.indexOf(query.schema.recordSeriesColumn) !== -1) {
            list.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('rrule', query.schema.recordSeriesColumn.join.alias), query.schema.recordSeriesColumn.id));
            list.push((0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)('enabled', query.schema.recordSeriesColumn.join.alias), query.schema.recordSeriesColumn.id));
        }
        list.push((0, helpers_1.ResTarget)((0, helpers_1.FuncCall)('row_number', null, { over: (0, helpers_1.WindowDef)(sort, 530) }), '__row_number'));
        return list;
    }
    fromClause(query, leftJoins = [], exactColumns) {
        let baseQuery = null;
        if (query.ast) {
            let queryAST = query.ast;
            const referencedColumns = query.referencedColumns.concat(exactColumns || []);
            // If there's an `exactColumn`, pick it out specifically with a guaranteed unique alias so it can be
            // referenced with certainty in outer queries. The following is an oversimplified example of the problem:
            //
            // if `id` is part of the table and needs to be references in the outer query, it must be called out specifically:
            //
            // INVALID:
            //   SELECT * FROM(SELECT *, *, * FROM table) WHERE id = ...
            //
            // VALID:
            //   SELECT * FROM(SELECT *, *, *, id AS __value FROM table) WHERE __value = ...
            //
            // Given arbitrary subqueries, we must be able to reference columns in them exactly even when there are duplicates.
            // We can't assume they're all simple ColumnRef's either. Some ResTarget's might be entire graphs of expressions which
            // needs to be duplicated to ensure uniqueness.
            if (referencedColumns.length) {
                queryAST = JSON.parse(JSON.stringify(queryAST));
                for (const column of referencedColumns) {
                    Converter.duplicateResTargetWithExactName(query, queryAST.SelectStmt.targetList, column, column.id);
                }
            }
            return [(0, helpers_1.RangeSubselect)(queryAST, (0, helpers_1.Alias)('records'))];
        }
        baseQuery = this.formQueryRangeVar(query);
        const visitedTables = {};
        if (leftJoins) {
            for (const join of leftJoins) {
                if (!visitedTables[join.alias]) {
                    visitedTables[join.alias] = join;
                    baseQuery = Converter.joinClause(baseQuery, join);
                }
            }
        }
        return [baseQuery];
    }
    whereClause(query, boundingBox, search, options = {}) {
        var _a, _b, _c;
        console.log("we are in the whereClause");
        const systemParts = [];
        options = Object.assign(Object.assign({}, query.options || {}), options);
        const filterNode = this.nodeForCondition(query.filter, options);
        if (boundingBox) {
            systemParts.push(this.boundingBoxFilter(query, boundingBox));
        }
        if (search && search.trim().length) {
            systemParts.push(this.searchFilter(query, search));
        }
        systemParts.push(this.nodeForExpression(query.dateFilter, options));
        systemParts.push(this.createExpressionForColumnFilter(query.statusFilter, options));
        systemParts.push(this.createExpressionForColumnFilter(query.projectFilter, options));
        systemParts.push(this.createExpressionForColumnFilter(query.assignmentFilter, options));
        systemParts.push(this.createExpressionForColumnFilter(query.changesetFilter, options));
        for (const item of query.columnSettings.columns) {
            if (item.hasFilter) {
                console.log('item hasFilter, calling createExpressionForColumnFilter');
                const expression = this.createExpressionForColumnFilter(item.filter, options);
                if (expression) {
                    systemParts.push(expression);
                }
            }
            if (item.search) {
                if ((_b = (_a = item.column) === null || _a === void 0 ? void 0 : _a.element) === null || _b === void 0 ? void 0 : _b.isRecordLinkElement) {
                    const { element } = item.column;
                    const { _attributes } = element;
                    const formId = ((_c = element === null || element === void 0 ? void 0 : element.form) === null || _c === void 0 ? void 0 : _c.id) || _attributes.form_id;
                    systemParts.push((0, helpers_1.SubLink)(0, (0, helpers_1.SelectStmt)({
                        targetList: [(0, helpers_1.ResTarget)((0, helpers_1.AConst)((0, helpers_1.IntegerValue)(1)))],
                        fromClause: [(0, helpers_1.RangeVar)(formId)],
                        whereClause: (0, helpers_1.BoolExpr)(0, [
                            (0, helpers_1.AExpr)(1, '=', (0, helpers_1.ColumnRef)('_record_id', formId), (0, helpers_1.AArrayExpr)([(0, helpers_1.ColumnRef)(columnRef(item.column), 'records')])),
                            (0, helpers_1.AExpr)(8, '~~*', (0, helpers_1.ColumnRef)('_title', formId), (0, helpers_1.AConst)((0, helpers_1.StringValue)('%' + this.escapeLikePercent(item.search) + '%'))),
                        ]),
                    })));
                }
                else if (item.column.isArray || item.column.isDate || item.column.isTime || item.column.isNumber) {
                    systemParts.push((0, helpers_1.AExpr)(8, '~~*', (0, helpers_1.TypeCast)((0, helpers_1.TypeName)('text'), columnRef(item.column)), (0, helpers_1.AConst)((0, helpers_1.StringValue)('%' + this.escapeLikePercent(item.search) + '%'))));
                }
                else {
                    systemParts.push((0, helpers_1.AExpr)(8, '~~*', columnRef(item.column), (0, helpers_1.AConst)((0, helpers_1.StringValue)('%' + this.escapeLikePercent(item.search) + '%'))));
                }
            }
            if (item.expression.isValid) {
                console.log("item expression isValid, calling nodeForExpression");
                systemParts.push(this.nodeForExpression(item.expression, options));
            }
            if (item.range.isValid) {
                systemParts.push(this.nodeForExpression(item.range, options));
            }
        }
        if (options.expressions) {
            systemParts.push.apply(systemParts, options.expressions);
        }
        const expressions = systemParts.filter(o => o != null);
        if (filterNode && expressions.length) {
            return (0, helpers_1.BoolExpr)(0, [filterNode, ...expressions]);
        }
        else if (expressions.length) {
            return (0, helpers_1.BoolExpr)(0, [...expressions]);
        }
        return filterNode;
    }
    static joinClause(baseQuery, { inner, tableName, alias, sourceColumn, joinColumn, sourceTableName, rarg, ast }) {
        return (0, helpers_1.JoinExpr)(inner ? 0 : 1, baseQuery, rarg || (0, helpers_1.RangeVar)(tableName, (0, helpers_1.Alias)(alias)), ast ? ast : (0, helpers_1.AExpr)(0, '=', (0, helpers_1.ColumnRef)(sourceColumn, sourceTableName || 'records'), (0, helpers_1.ColumnRef)(joinColumn, alias)));
    }
    static duplicateResTargetWithExactName(query, targetList, column, exactName) {
        let resTarget = Converter.findResTarget(query, column);
        // If a column is referenced more than once don't add it again
        for (const existing of targetList) {
            if (existing.ResTarget.name === exactName) {
                return;
            }
        }
        // If we found a matching restarget, copy the entire node and give it a new name
        if (resTarget) {
            resTarget = JSON.parse(JSON.stringify(resTarget));
            resTarget.ResTarget.name = exactName;
        }
        else {
            resTarget = (0, helpers_1.ResTarget)((0, helpers_1.ColumnRef)(column.columnName, column.source), exactName);
        }
        targetList.push(resTarget);
    }
    static findResTarget(query, column) {
        // UNION's don't have targetList's
        if (!query.ast.SelectStmt.targetList) {
            return null;
        }
        // look for any A_Star nodes, a SELECT * modifies how we process the res targets. If there's
        // an A_Star node in the targetList, it means that we can't just get the column by index because
        // the * might expand to columns that cause the indexes to be different.
        const hasStar = query.ast.SelectStmt.targetList.find((target) => {
            return target.ResTarget &&
                target.ResTarget.val &&
                target.ResTarget.val.ColumnRef &&
                target.ResTarget.val.ColumnRef.fields &&
                target.ResTarget.val.ColumnRef.fields[0] &&
                target.ResTarget.val.ColumnRef.fields[0].A_Star;
        });
        // the simple case is when there is no * in the query
        if (!hasStar && query.ast.SelectStmt.targetList.length === query.schema.columns.length) {
            return query.ast.SelectStmt.targetList[column.index];
        }
        // Find the ResTarget node by name, or else return null, which means the column
        // must be coming from a * node and we can just use a simple ResTarget + ColumnRef
        return query.ast.SelectStmt.targetList.find((target) => {
            return target.ResTarget.name === column.name;
        });
    }
    formQueryRangeVar(query) {
        const full = query.full ? '/_full' : '';
        if (query.repeatableKey) {
            return (0, helpers_1.RangeVar)(query.form.id + '/' + query.repeatableKey + full, (0, helpers_1.Alias)('records'));
        }
        return (0, helpers_1.RangeVar)(query.form.id + full, (0, helpers_1.Alias)('records'));
    }
    createExpressionForColumnFilter(filter, options) {
        let expression = null;
        if (filter === options.except) {
            return null;
        }
        if (filter.hasValues) {
            let hasNull = false;
            const values = [];
            filter.value.forEach(v => {
                if (v != null) {
                    values.push(v);
                }
                else {
                    hasNull = true;
                }
            });
            if (values.length) {
                if (filter.column.isArray) {
                    expression = this.AnyOf(filter.column, values);
                }
                else if (filter.column.element && filter.column.element.isCalculatedElement && filter.column.element.display.isDate) {
                    console.log("createExpressionForColumnFilter with values", values);
                    expression = this.In(filter.column, values.map((value) => {
                        return new Date(value).getTime() / 1000;
                    }));
                }
                else {
                    expression = this.In(filter.column, values);
                }
                if (hasNull) {
                    expression = (0, helpers_1.BoolExpr)(1, [(0, helpers_1.NullTest)(0, columnRef(filter.column)), expression]);
                }
            }
            else if (hasNull) {
                expression = (0, helpers_1.NullTest)(0, columnRef(filter.column));
            }
        }
        else if (filter.isEmptySet) {
            // add 1 = 0 clause to return 0 rows
            expression = (0, helpers_1.AExpr)(0, '=', (0, helpers_1.AConst)((0, helpers_1.IntegerValue)(1)), (0, helpers_1.AConst)((0, helpers_1.IntegerValue)(0)));
        }
        return expression;
    }
    boundingBoxFilter(query, boundingBox) {
        const [xmin, ymin, xmax, ymax] = boundingBox;
        const columnName = query.ast ? '__geometry' : '_geometry';
        // if the east value is less than the west value, the bbox spans the 180 meridian.
        // Split the box into 2 separate boxes on either side of the meridian and use
        // an OR statement in the where clause so records on either side of the meridian
        // will be returned.
        if (xmax < xmin) {
            const box1 = [xmin, ymin, 180, ymax];
            const box2 = [-180, ymin, xmax, ymax];
            const boxes = [this.geometryQuery(columnName, box1),
                this.geometryQuery(columnName, box2)];
            return (0, helpers_1.BoolExpr)(1, boxes);
        }
        return this.geometryQuery(columnName, boundingBox);
    }
    geometryQuery(columnName, boundingBox) {
        const args = [
            (0, helpers_1.AConst)((0, helpers_1.FloatValue)(boundingBox[0])),
            (0, helpers_1.AConst)((0, helpers_1.FloatValue)(boundingBox[1])),
            (0, helpers_1.AConst)((0, helpers_1.FloatValue)(boundingBox[2])),
            (0, helpers_1.AConst)((0, helpers_1.FloatValue)(boundingBox[3])),
            (0, helpers_1.AConst)((0, helpers_1.IntegerValue)(4326))
        ];
        const rhs = (0, helpers_1.FuncCall)('st_makeenvelope', args);
        return (0, helpers_1.AExpr)(0, '&&', (0, helpers_1.ColumnRef)(columnName), rhs);
    }
    escapeLikePercent(value) {
        return value.replace(/\\/g, '\\\\').replace(/\%/g, '\\%').replace(/_/g, '\\_%');
    }
    searchFilter(query, search) {
        /*
           Search takes the general form:
    
           SELECT ...
           FROM ...
           WHERE
             _record_index @@ to_tsquery('english', '''bacon'':*'::tsquery::text) AND
             _record_index_text ILIKE '%bacon%'
    
           NB: The awkward cast through a text type is to properly escape raw user input as a tsquery.
    
           For example:
             to_tsquery('Nor:*') vs 'Nor:*'::tsquery
    
           Also, the ILIKE handles further reduces the resultset to exact matches which is what Fulcrum
           users more often expect. The general idea is to use the FTS index to massively reduce the result
           set before applying the much slower ILIKE operation. So, we can reduce the result very quickly
           with the tsvector index first, and then only run the ILIKE on what's left.
        */
        search = search.trim();
        // if it's a fully custom SQL statement, use a simpler form with no index
        if (query.ast) {
            return (0, helpers_1.AExpr)(8, '~~*', (0, helpers_1.TypeCast)((0, helpers_1.TypeName)('text'), (0, helpers_1.ColumnRef)('records')), (0, helpers_1.AConst)((0, helpers_1.StringValue)('%' + this.escapeLikePercent(search) + '%')));
        }
        const toTsQuery = (dictionary, term) => {
            const args = [(0, helpers_1.AConst)((0, helpers_1.StringValue)(dictionary)), (0, helpers_1.AConst)((0, helpers_1.StringValue)("'" + term + "':*"))];
            return (0, helpers_1.FuncCall)('to_tsquery', args);
        };
        const makeTsQueryCall = (term) => {
            return toTsQuery('english', term.toLowerCase().replace(/'/g, "''"));
        };
        const terms = search.split(' ').filter(s => s.trim().length);
        let term = terms.shift();
        let tsQueries = makeTsQueryCall(term);
        while (terms.length) {
            term = terms.shift();
            tsQueries = (0, helpers_1.AExpr)(0, '&&', tsQueries, makeTsQueryCall(term));
        }
        const ftsExpression = (0, helpers_1.AExpr)(0, '@@', (0, helpers_1.ColumnRef)('_record_index'), tsQueries);
        const ilikeExpression = (0, helpers_1.AExpr)(8, '~~*', (0, helpers_1.ColumnRef)('_record_index_text'), (0, helpers_1.AConst)((0, helpers_1.StringValue)('%' + this.escapeLikePercent(search) + '%')));
        const andArgs = [
            ftsExpression,
            ilikeExpression
        ];
        return (0, helpers_1.BoolExpr)(0, andArgs);
    }
    summaryWhereClause(query, columnSetting, { boundingBox, searchFilter }) {
        const expressions = [];
        const converters = {
            [aggregate_1.AggregateType.Empty.name]: () => {
                return (0, helpers_1.NullTest)(0, columnRef(columnSetting.column));
            },
            [aggregate_1.AggregateType.NotEmpty.name]: () => {
                return (0, helpers_1.NullTest)(1, columnRef(columnSetting.column));
            },
            [aggregate_1.AggregateType.PercentEmpty.name]: () => {
                return (0, helpers_1.NullTest)(0, columnRef(columnSetting.column));
            },
            [aggregate_1.AggregateType.PercentNotEmpty.name]: () => {
                return (0, helpers_1.NullTest)(1, columnRef(columnSetting.column));
            }
        };
        const expressionConverter = converters[columnSetting.summary.aggregate];
        if (expressionConverter) {
            expressions.push(expressionConverter());
        }
        return this.whereClause(query, boundingBox, searchFilter, { expressions });
    }
    summaryTargetList(query, columnSetting) {
        const simpleFunctionResTarget = (funcName, param) => {
            return () => {
                return [(0, helpers_1.ResTarget)((0, helpers_1.FuncCall)(funcName, [param || columnRef(columnSetting.column)]), 'value')];
            };
        };
        const converter = {
            [aggregate_1.AggregateType.Sum.name]: simpleFunctionResTarget('sum'),
            [aggregate_1.AggregateType.Average.name]: simpleFunctionResTarget('avg'),
            [aggregate_1.AggregateType.Min.name]: simpleFunctionResTarget('min'),
            [aggregate_1.AggregateType.Max.name]: simpleFunctionResTarget('max'),
            [aggregate_1.AggregateType.StdDev.name]: simpleFunctionResTarget('stddev'),
            [aggregate_1.AggregateType.Histogram.name]: simpleFunctionResTarget('count'),
            [aggregate_1.AggregateType.Empty.name]: simpleFunctionResTarget('count', (0, helpers_1.AConst)((0, helpers_1.IntegerValue)(1))),
            [aggregate_1.AggregateType.NotEmpty.name]: simpleFunctionResTarget('count', (0, helpers_1.AConst)((0, helpers_1.IntegerValue)(1))),
            [aggregate_1.AggregateType.Unique.name]: () => {
                return [(0, helpers_1.ResTarget)((0, helpers_1.FuncCall)('count', [columnRef(columnSetting.column)], { agg_distinct: true }), 'value')];
            },
            [aggregate_1.AggregateType.PercentEmpty.name]: simpleFunctionResTarget('count'),
            [aggregate_1.AggregateType.PercentNotEmpty.name]: simpleFunctionResTarget('count'),
            [aggregate_1.AggregateType.PercentUnique.name]: simpleFunctionResTarget('count')
        };
        return converter[columnSetting.summary.aggregate]();
    }
    nodeForExpressions(expressions, options) {
        return expressions.map(e => this.nodeForExpression(e, options))
            .filter(e => e);
    }
    nodeForCondition(condition, options) {
        const converter = {
            [condition_1.ConditionType.And]: this.AndConverter,
            [condition_1.ConditionType.Or]: this.OrConverter,
            [condition_1.ConditionType.Not]: this.NotConverter
        };
        return converter[condition.type](condition, options);
    }
    nodeForExpression(expression, options) {
        if (expression.expressions) {
            return this.nodeForCondition(expression, options);
        }
        if (expression === options.except) {
            return null;
        }
        const converter = {
            [operator_1.OperatorType.Empty.name]: this.EmptyConverter,
            [operator_1.OperatorType.NotEmpty.name]: this.NotEmptyConverter,
            [operator_1.OperatorType.Equal.name]: this.EqualConverter,
            [operator_1.OperatorType.NotEqual.name]: this.NotEqualConverter,
            [operator_1.OperatorType.GreaterThan.name]: this.GreaterThanConverter,
            [operator_1.OperatorType.GreaterThanOrEqual.name]: this.GreaterThanOrEqualConverter,
            [operator_1.OperatorType.LessThan.name]: this.LessThanConverter,
            [operator_1.OperatorType.LessThanOrEqual.name]: this.LessThanOrEqualConverter,
            [operator_1.OperatorType.Between.name]: this.BetweenConverter,
            [operator_1.OperatorType.NotBetween.name]: this.NotBetweenConverter,
            [operator_1.OperatorType.In.name]: this.InConverter,
            [operator_1.OperatorType.NotIn.name]: this.NotInConverter,
            [operator_1.OperatorType.TextContain.name]: this.TextContainConverter,
            [operator_1.OperatorType.TextNotContain.name]: this.TextNotContainConverter,
            [operator_1.OperatorType.TextStartsWith.name]: this.TextStartsWithConverter,
            [operator_1.OperatorType.TextEndsWith.name]: this.TextEndsWithConverter,
            [operator_1.OperatorType.TextEqual.name]: this.TextEqualConverter,
            [operator_1.OperatorType.TextNotEqual.name]: this.TextNotEqualConverter,
            [operator_1.OperatorType.TextMatch.name]: this.TextMatchConverter,
            [operator_1.OperatorType.TextNotMatch.name]: this.TextNotMatchConverter,
            [operator_1.OperatorType.DateEqual.name]: this.EqualConverter,
            [operator_1.OperatorType.DateNotEqual.name]: this.NotEqualConverter,
            [operator_1.OperatorType.DateAfter.name]: this.GreaterThanConverter,
            [operator_1.OperatorType.DateOnOrAfter.name]: this.GreaterThanOrEqualConverter,
            [operator_1.OperatorType.DateBefore.name]: this.LessThanConverter,
            [operator_1.OperatorType.DateOnOrBefore.name]: this.LessThanOrEqualConverter,
            [operator_1.OperatorType.DateBetween.name]: this.BetweenConverter,
            [operator_1.OperatorType.DateNotBetween.name]: this.NotBetweenConverter,
            [operator_1.OperatorType.ArrayAnyOf.name]: this.ArrayAnyOfConverter,
            [operator_1.OperatorType.ArrayAllOf.name]: this.ArrayAllOfConverter,
            [operator_1.OperatorType.ArrayIsContainedIn.name]: this.ArrayIsContainedIn,
            [operator_1.OperatorType.ArrayEqual.name]: this.ArrayEqualConverter,
            [operator_1.OperatorType.Search.name]: this.SearchConverter,
            [operator_1.OperatorType.DateToday.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateYesterday.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateTomorrow.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateLast7Days.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateLast30Days.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateLast90Days.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateLastMonth.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateLastYear.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateNextWeek.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateNextMonth.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateNextYear.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateCurrentCalendarWeek.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateCurrentCalendarMonth.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateCurrentCalendarYear.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DatePreviousCalendarWeek.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DatePreviousCalendarMonth.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DatePreviousCalendarYear.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateNextCalendarWeek.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateNextCalendarMonth.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateNextCalendarYear.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateDaysFromNow.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateWeeksFromNow.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateMonthsFromNow.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateYearsFromNow.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateDaysAgo.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateWeeksAgo.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateMonthsAgo.name]: this.DynamicDateConverter,
            [operator_1.OperatorType.DateYearsAgo.name]: this.DynamicDateConverter
        };
        if (!expression.isValid) {
            return null;
        }
        const mergedOptions = Object.assign(Object.assign({}, options), lodash_1.default.omitBy(expression.options, lodash_1.default.isNull));
        console.log('expression in nodeForExpression', expression);
        return converter[expression.operator](expression, mergedOptions);
    }
}
exports.default = Converter;
//# sourceMappingURL=converter.js.map