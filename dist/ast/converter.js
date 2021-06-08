"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _helpers = require("./helpers");

var _condition = require("../condition");

var _operator = require("../operator");

var _aggregate = require("../aggregate");

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MAX_DISTINCT_VALUES = 1000;
var MAX_TILE_RECORDS = 1000;

var columnRef = function columnRef(column) {
  return column.isSQL ? (0, _helpers.ColumnRef)(column.id, column.source) : (0, _helpers.ColumnRef)(column.columnName, column.source);
};

var Converter =
/*#__PURE__*/
function () {
  function Converter() {
    var _this = this;

    _defineProperty(this, "BooleanConverter", function (type, condition, options) {
      var args = _this.nodeForExpressions(condition.expressions, options);

      if (args && args.length) {
        return (0, _helpers.BoolExpr)(type, args);
      }

      return null;
    });

    _defineProperty(this, "AndConverter", function (condition, options) {
      return _this.BooleanConverter(0, condition, options);
    });

    _defineProperty(this, "OrConverter", function (condition, options) {
      return _this.BooleanConverter(1, condition, options);
    });

    _defineProperty(this, "NotConverter", function (condition, options) {
      if (condition.expressions.length > 1) {
        return (0, _helpers.BoolExpr)(2, [_this.BooleanConverter(0, condition, options)]);
      }

      return _this.BooleanConverter(2, condition, options);
    });

    _defineProperty(this, "NotEmptyConverter", function (expression) {
      return (0, _helpers.NullTest)(1, columnRef(expression.column));
    });

    _defineProperty(this, "EmptyConverter", function (expression) {
      return (0, _helpers.NullTest)(0, columnRef(expression.column));
    });

    _defineProperty(this, "EqualConverter", function (expression) {
      return _this.BinaryConverter(0, '=', expression);
    });

    _defineProperty(this, "NotEqualConverter", function (expression) {
      return _this.BinaryConverter(0, '<>', expression);
    });

    _defineProperty(this, "GreaterThanConverter", function (expression) {
      return _this.BinaryConverter(0, '>', expression);
    });

    _defineProperty(this, "GreaterThanOrEqualConverter", function (expression) {
      return _this.BinaryConverter(0, '>=', expression);
    });

    _defineProperty(this, "LessThanConverter", function (expression) {
      return _this.BinaryConverter(0, '<', expression);
    });

    _defineProperty(this, "LessThanOrEqualConverter", function (expression) {
      return _this.BinaryConverter(0, '<=', expression);
    });

    _defineProperty(this, "BetweenConverter", function (expression, options) {
      var value1 = expression.value1;
      var value2 = expression.value2;

      if (expression.isDateOperator) {
        value1 = value1 && _this.ConvertDateValue(_this.GetDate(value1, options, expression.column.isDateTime).startOf('day'));
        value2 = value2 && _this.ConvertDateValue(_this.GetDate(value2, options, expression.column.isDateTime).endOf('day'));
      }

      return _this.Between(expression.column, value1, value2);
    });

    _defineProperty(this, "NotBetweenConverter", function (expression, options) {
      var value1 = expression.value1;
      var value2 = expression.value2;

      if (expression.isDateOperator) {
        value1 = value1 && _this.ConvertDateValue(_this.GetDate(value1, options, expression.column.isDateTime).startOf('day'));
        value2 = value2 && _this.ConvertDateValue(_this.GetDate(value2, options, expression.column.isDateTime).endOf('day'));
      }

      return _this.NotBetween(expression.column, value1, value2);
    });

    _defineProperty(this, "InConverter", function (expression) {
      return _this.In(expression.column, expression.arrayValue);
    });

    _defineProperty(this, "NotInConverter", function (expression) {
      return _this.NotIn(expression.column, expression.arrayValue);
    });

    _defineProperty(this, "BinaryConverter", function (kind, operator, expression) {
      return (0, _helpers.AExpr)(kind, operator, columnRef(expression.column), _this.ConstValue(expression.column, expression.scalarValue));
    });

    _defineProperty(this, "FieldConverter", function (expression) {
      return (0, _helpers.ColumnRef)(expression.name);
    });

    _defineProperty(this, "ConstantConverter", function (expression) {
      return _this.ConstValue(expression.column, expression.scalarValue);
    });

    _defineProperty(this, "TextEqualConverter", function (expression) {
      return (0, _helpers.AExpr)(8, '~~*', _this.ConvertToText(expression.column), _this.ConstValue(expression.column, expression.scalarValue));
    });

    _defineProperty(this, "TextNotEqualConverter", function (expression) {
      return (0, _helpers.AExpr)(8, '!~~*', _this.ConvertToText(expression.column), _this.ConstValue(expression.column, expression.scalarValue));
    });

    _defineProperty(this, "TextContainConverter", function (expression) {
      return (0, _helpers.AExpr)(8, '~~*', _this.ConvertToText(expression.column), (0, _helpers.AConst)((0, _helpers.StringValue)('%' + _this.escapeLikePercent(expression.scalarValue) + '%')));
    });

    _defineProperty(this, "TextNotContainConverter", function (expression) {
      return (0, _helpers.AExpr)(8, '!~~*', _this.ConvertToText(expression.column), (0, _helpers.AConst)((0, _helpers.StringValue)('%' + _this.escapeLikePercent(expression.scalarValue) + '%')));
    });

    _defineProperty(this, "TextStartsWithConverter", function (expression) {
      return (0, _helpers.AExpr)(8, '~~*', _this.ConvertToText(expression.column), (0, _helpers.AConst)((0, _helpers.StringValue)(_this.escapeLikePercent(expression.scalarValue) + '%')));
    });

    _defineProperty(this, "TextEndsWithConverter", function (expression) {
      return (0, _helpers.AExpr)(8, '~~*', _this.ConvertToText(expression.column), (0, _helpers.AConst)((0, _helpers.StringValue)('%' + _this.escapeLikePercent(expression.scalarValue))));
    });

    _defineProperty(this, "TextMatchConverter", function (expression) {
      if (_this.IsValidRegExp(expression.scalarValue)) {
        return (0, _helpers.AExpr)(0, '~*', _this.ConvertToText(expression.column), (0, _helpers.AConst)((0, _helpers.StringValue)(expression.scalarValue)));
      }

      return null;
    });

    _defineProperty(this, "TextNotMatchConverter", function (expression) {
      if (_this.IsValidRegExp(expression.scalarValue)) {
        return (0, _helpers.AExpr)(0, '!~*', _this.ConvertToText(expression.column), (0, _helpers.AConst)((0, _helpers.StringValue)(expression.scalarValue)));
      }

      return null;
    });

    _defineProperty(this, "ArrayAnyOfConverter", function (expression) {
      return _this.AnyOf(expression.column, expression.arrayValue);
    });

    _defineProperty(this, "ArrayAllOfConverter", function (expression) {
      var values = (0, _helpers.AArrayExpr)(expression.arrayValue.map(function (v) {
        return _this.ConstValue(expression.column, v);
      }));
      return (0, _helpers.AExpr)(0, '@>', columnRef(expression.column), values);
    });

    _defineProperty(this, "ArrayEqualConverter", function (expression) {
      var values = (0, _helpers.AArrayExpr)(expression.arrayValue.map(function (v) {
        return _this.ConstValue(expression.column, v);
      }));
      var a = (0, _helpers.AExpr)(0, '<@', columnRef(expression.column), values);
      var b = (0, _helpers.AExpr)(0, '@>', columnRef(expression.column), values);
      return (0, _helpers.BoolExpr)(0, [a, b]);
    });

    _defineProperty(this, "SearchConverter", function (expression) {
      var rhs = (0, _helpers.FuncCall)('to_tsquery', [_this.ConstValue(expression.column, expression.scalarValue)]);
      return (0, _helpers.AExpr)(0, '@@', columnRef(expression.column), rhs);
    });

    _defineProperty(this, "DynamicDateConverter", function (expression, options) {
      // Let the caller specify the timezone to be used for dynamic date calculations. This
      // makes sure when the browser calculates a dynamic range, the server would calculate
      // the same range. So 'Today' is midnight to midnight in the user's local time. It would
      // be much less useful and confusing if we forced "Today" to always be London's today.
      var now = _this.GetDate(null, options, true);

      var range = (0, _operator.calculateDateRange)(expression.operator, expression.value, now);

      var value1 = _this.ConvertDateValue(range[0]);

      var value2 = _this.ConvertDateValue(range[1]);

      return _this.Between(expression.column, value1, value2);
    });

    _defineProperty(this, "NotBetween", function (column, value1, value2) {
      if (value1 != null && value2 != null) {
        return (0, _helpers.AExpr)(11, 'NOT BETWEEN', columnRef(column), [_this.ConstValue(column, value1), _this.ConstValue(column, value2)]);
      } else if (value1 != null) {
        return (0, _helpers.AExpr)(0, '<', columnRef(column), _this.ConstValue(column, value1));
      } else if (value2 != null) {
        return (0, _helpers.AExpr)(0, '>', columnRef(column), _this.ConstValue(column, value2));
      }

      return null;
    });

    _defineProperty(this, "AnyOf", function (column, values) {
      var arrayValues = (0, _helpers.AArrayExpr)(values.map(function (v) {
        return _this.ConstValue(column, v);
      }));
      return (0, _helpers.AExpr)(0, '&&', columnRef(column), arrayValues);
    });

    _defineProperty(this, "In", function (column, values) {
      var hasNull = false;
      var inValues = [];
      values.forEach(function (v) {
        if (v != null) {
          inValues.push(v);
        } else {
          hasNull = true;
        }
      });
      var expression = null;

      if (inValues.length) {
        expression = (0, _helpers.AExpr)(6, '=', columnRef(column), inValues.map(function (v) {
          return _this.ConstValue(column, v);
        }));

        if (hasNull) {
          expression = (0, _helpers.BoolExpr)(1, [(0, _helpers.NullTest)(0, columnRef(column)), expression]);
        }
      } else if (hasNull) {
        expression = (0, _helpers.NullTest)(0, columnRef(column));
      }

      return expression;
    });

    _defineProperty(this, "NotIn", function (column, values) {
      var hasNull = false;
      var inValues = [];
      values.forEach(function (v) {
        if (v != null) {
          inValues.push(v);
        } else {
          hasNull = true;
        }
      });
      var expression = null;

      if (inValues.length) {
        expression = (0, _helpers.AExpr)(6, '<>', columnRef(column), inValues.map(function (v) {
          return _this.ConstValue(column, v);
        }));

        if (hasNull) {
          expression = (0, _helpers.BoolExpr)(1, [(0, _helpers.NullTest)(1, columnRef(column)), expression]);
        }
      } else if (hasNull) {
        expression = (0, _helpers.NullTest)(1, columnRef(column));
      }

      return expression;
    });

    _defineProperty(this, "Between", function (column, value1, value2) {
      if (value1 != null && value2 != null) {
        return (0, _helpers.AExpr)(10, 'BETWEEN', columnRef(column), [_this.ConstValue(column, value1), _this.ConstValue(column, value2)]);
      } else if (value1 != null) {
        return (0, _helpers.AExpr)(0, '>=', columnRef(column), _this.ConstValue(column, value1));
      } else if (value2 != null) {
        return (0, _helpers.AExpr)(0, '<=', columnRef(column), _this.ConstValue(column, value2));
      }

      return null;
    });

    _defineProperty(this, "ConstValue", function (column, value) {
      if (value == null) {
        return null;
      }

      if (column.isInteger) {
        return (0, _helpers.AConst)((0, _helpers.IntegerValue)(value));
      }

      if (column.isNumber) {
        return (0, _helpers.AConst)((0, _helpers.FloatValue)(value));
      }

      return (0, _helpers.AConst)((0, _helpers.StringValue)(value));
    });

    _defineProperty(this, "GetDate", function (date, options, isDateTime) {
      date = date || new Date().toISOString();

      if (!isDateTime) {
        // the `date` value comes in as the string "2017-11-12 23:59:59". We want it to be interpreted as UTC for the
        // purposes of the SQL query generation. So we convert the local timestamp to a UTC one. We don't care if it's
        // in a different timezone, we just need to make sure the date component of the timestamp is identical to the
        // value stored in the date field. We are effectively disregarding the time component of the timestamp.
        return (0, _momentTimezone["default"])(date.replace(' ', 'T') + 'Z').utc();
      }

      var timeZone = options && options.timeZone || _momentTimezone["default"].tz.guess();

      return _momentTimezone["default"].tz(date, timeZone);
    });

    _defineProperty(this, "ConvertDateValue", function (date) {
      if (date) {
        return date.clone().toISOString();
      }

      return null;
    });

    _defineProperty(this, "ConvertToText", function (column) {
      if (column.isDate || column.isTime || column.isArray) {
        return (0, _helpers.TypeCast)((0, _helpers.TypeName)('text'), columnRef(column));
      }

      return columnRef(column);
    });

    _defineProperty(this, "IsValidRegExp", function (string) {
      try {
        return !!new RegExp(string);
      } catch (ex) {
        return false;
      }
    });
  }

  var _proto = Converter.prototype;

  _proto.toAST = function toAST(query, _ref) {
    var sort = _ref.sort,
        pageSize = _ref.pageSize,
        pageIndex = _ref.pageIndex,
        boundingBox = _ref.boundingBox,
        searchFilter = _ref.searchFilter;
    var targetList = this.targetList(query, sort, boundingBox);
    var joins = query.joinColumnsWithSorting.map(function (o) {
      return o.join;
    });
    var fromClause = this.fromClause(query, joins);
    var whereClause = this.whereClause(query, boundingBox, searchFilter);
    var sortClause = sort;
    var limitOffset = this.limitOffset(pageSize, pageIndex);
    var limitCount = this.limitCount(pageSize);
    return (0, _helpers.SelectStmt)({
      targetList: targetList,
      fromClause: fromClause,
      whereClause: whereClause,
      sortClause: sortClause,
      limitOffset: limitOffset,
      limitCount: limitCount
    });
  };

  _proto.toCountAST = function toCountAST(query, _ref2) {
    var boundingBox = _ref2.boundingBox,
        searchFilter = _ref2.searchFilter;
    var targetList = [(0, _helpers.ResTarget)((0, _helpers.FuncCall)('count', [(0, _helpers.AConst)((0, _helpers.IntegerValue)(1))]), 'total_count')];
    var joins = query.joinColumns.map(function (o) {
      return o.join;
    });
    var fromClause = this.fromClause(query, joins);
    var whereClause = this.whereClause(query, boundingBox, searchFilter);
    return (0, _helpers.SelectStmt)({
      targetList: targetList,
      fromClause: fromClause,
      whereClause: whereClause
    });
  };

  _proto.toTileAST = function toTileAST(query, _ref3) {
    var searchFilter = _ref3.searchFilter;
    var targetList = null;

    if (query.ast) {
      var sort = [(0, _helpers.SortBy)((0, _helpers.AConst)((0, _helpers.IntegerValue)(1)), 0, 0)];
      targetList = [(0, _helpers.ResTarget)((0, _helpers.FuncCall)('row_number', null, {
        over: (0, _helpers.WindowDef)(sort, 530)
      }), '__id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('__geometry'))];
    } else {
      var statusColumn = query.schema.repeatable ? '_record_status' : '_status';
      targetList = [(0, _helpers.ResTarget)((0, _helpers.ColumnRef)(query.schema.repeatable ? '_child_record_id' : '_record_id'), 'id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_geometry'), 'geometry'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)(statusColumn), 'status'), (0, _helpers.ResTarget)((0, _helpers.TypeCast)((0, _helpers.TypeName)('text'), (0, _helpers.AConst)((0, _helpers.StringValue)(query.form.id))), 'form_id')];

      if (query.schema.repeatable) {
        targetList.push((0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_record_id'), 'record_id'));
        targetList.push((0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_parent_id'), 'parent_id'));
      }
    }

    var joins = query.joinColumns.map(function (o) {
      return o.join;
    });
    var fromClause = this.fromClause(query, joins);
    var whereClause = this.whereClause(query, null, searchFilter);
    var limitCount = this.limitCount(MAX_TILE_RECORDS);
    return (0, _helpers.SelectStmt)({
      targetList: targetList,
      fromClause: fromClause,
      whereClause: whereClause,
      limitCount: limitCount
    });
  };

  _proto.toHistogramAST = function toHistogramAST(query, _ref4) {
    var column = _ref4.column,
        bucketSize = _ref4.bucketSize,
        type = _ref4.type,
        sort = _ref4.sort,
        pageSize = _ref4.pageSize,
        pageIndex = _ref4.pageIndex,
        boundingBox = _ref4.boundingBox,
        searchFilter = _ref4.searchFilter;

    var subLinkColumn = function subLinkColumn(col, table) {
      return (0, _helpers.SubLink)(4, (0, _helpers.SelectStmt)({
        targetList: [(0, _helpers.ResTarget)((0, _helpers.ColumnRef)(col))],
        fromClause: [(0, _helpers.RangeVar)(table)]
      }));
    };

    var expr = function expr(lhs, op, rhs) {
      return (0, _helpers.AExpr)(0, op, lhs, rhs);
    };

    var targetList = [(0, _helpers.ResTarget)((0, _helpers.ColumnRef)('series', 'series'), 'bucket'), (0, _helpers.ResTarget)((0, _helpers.CoalesceExpr)([(0, _helpers.ColumnRef)('count', 'sub'), (0, _helpers.AConst)((0, _helpers.IntegerValue)(0))]), 'count'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('min_value', 'sub'), 'min_value'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('max_value', 'sub'), 'max_value'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('avg_value', 'sub'), 'avg_value'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('sum_value', 'sub'), 'sum_value'), (0, _helpers.ResTarget)(expr(subLinkColumn('min_value', '__stats'), '+', expr(expr((0, _helpers.ColumnRef)('series', 'series'), '-', (0, _helpers.AConst)((0, _helpers.IntegerValue)(1))), '*', subLinkColumn('bucket_width', '__stats'))), 'bucket_min'), (0, _helpers.ResTarget)(expr(subLinkColumn('min_value', '__stats'), '+', expr((0, _helpers.ColumnRef)('series', 'series'), '*', subLinkColumn('bucket_width', '__stats'))), 'bucket_max'), (0, _helpers.ResTarget)(subLinkColumn('range', '__stats'), 'range'), (0, _helpers.ResTarget)(subLinkColumn('bucket_width', '__stats'), 'bucket_width')];
    var withClause = this.histogramWithClause(column, bucketSize, type, query, boundingBox, searchFilter);
    var seriesFunctionSublinkSelect = (0, _helpers.SelectStmt)({
      targetList: [(0, _helpers.ResTarget)((0, _helpers.AExpr)(0, '+', (0, _helpers.ColumnRef)('buckets'), (0, _helpers.AConst)((0, _helpers.IntegerValue)(1))))],
      fromClause: [(0, _helpers.RangeVar)('__stats')]
    });
    var seriesFunctionArgs = [(0, _helpers.AConst)((0, _helpers.IntegerValue)(1)), (0, _helpers.SubLink)(4, seriesFunctionSublinkSelect)];
    var seriesFunctionCall = (0, _helpers.FuncCall)('generate_series', seriesFunctionArgs);
    var seriesFunction = (0, _helpers.RangeFunction)([[seriesFunctionCall]], (0, _helpers.Alias)('series'));
    var bucketWidthFunctionCallArgs = [(0, _helpers.TypeCast)((0, _helpers.TypeName)([(0, _helpers.StringValue)('pg_catalog'), (0, _helpers.StringValue)('float8')]), (0, _helpers.ColumnRef)('value')), (0, _helpers.SubLink)(4, (0, _helpers.SelectStmt)({
      targetList: [(0, _helpers.ResTarget)((0, _helpers.ColumnRef)('min_value'))],
      fromClause: [(0, _helpers.RangeVar)('__stats')]
    })), (0, _helpers.SubLink)(4, (0, _helpers.SelectStmt)({
      targetList: [(0, _helpers.ResTarget)((0, _helpers.ColumnRef)('max_value'))],
      fromClause: [(0, _helpers.RangeVar)('__stats')]
    })), (0, _helpers.SubLink)(4, (0, _helpers.SelectStmt)({
      targetList: [(0, _helpers.ResTarget)((0, _helpers.ColumnRef)('buckets'))],
      fromClause: [(0, _helpers.RangeVar)('__stats')]
    }))];
    var bucketsSubqueryTargetList = [(0, _helpers.ResTarget)((0, _helpers.FuncCall)('width_bucket', bucketWidthFunctionCallArgs), 'bucket'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)('count', [(0, _helpers.AConst)((0, _helpers.IntegerValue)(1))]), 'count'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)('min', [(0, _helpers.ColumnRef)('value')]), 'min_value'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)('max', [(0, _helpers.ColumnRef)('value')]), 'max_value'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)('avg', [(0, _helpers.ColumnRef)('value')]), 'avg_value'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)('sum', [(0, _helpers.ColumnRef)('value')]), 'sum_value')];
    var bucketsSubqueryFromClause = [(0, _helpers.RangeVar)('__records')];
    var bucketsSubqueryGroupClause = [(0, _helpers.AConst)((0, _helpers.IntegerValue)(1))];
    var bucketsSubquerySortClause = [(0, _helpers.SortBy)((0, _helpers.AConst)((0, _helpers.IntegerValue)(1)), 0, 0)];
    var bucketsSubquery = (0, _helpers.SelectStmt)({
      targetList: bucketsSubqueryTargetList,
      fromClause: bucketsSubqueryFromClause,
      groupClause: bucketsSubqueryGroupClause,
      sortClause: bucketsSubquerySortClause
    });
    var bucketsSubselect = (0, _helpers.RangeSubselect)(bucketsSubquery, (0, _helpers.Alias)('sub'));
    var joinExpr = (0, _helpers.JoinExpr)(1, seriesFunction, bucketsSubselect, (0, _helpers.AExpr)(0, '=', (0, _helpers.ColumnRef)('series', 'series'), (0, _helpers.ColumnRef)('bucket', 'sub')));
    return (0, _helpers.SelectStmt)({
      targetList: targetList,
      fromClause: [joinExpr],
      withClause: withClause
    });
  };

  _proto.toDistinctValuesAST = function toDistinctValuesAST(query, options) {
    if (options === void 0) {
      options = {};
    }

    var valueColumn = query.ast ? (0, _helpers.ColumnRef)(options.column.id) : columnRef(options.column);
    var targetList = null;
    var isLinkedRecord = options.column.element && options.column.element.isRecordLinkElement;

    if (isLinkedRecord) {
      targetList = [(0, _helpers.ResTarget)((0, _helpers.ColumnRef)('linked_record_id', '__linked_join'), 'value')];
    } else if (options.column.isArray && options.unnestArrays !== false) {
      targetList = [(0, _helpers.ResTarget)((0, _helpers.FuncCall)('unnest', [valueColumn]), 'value')];
    } else if (options.column.element && options.column.element.isCalculatedElement && options.column.element.display.isDate) {
      // SELECT pg_catalog.timezone('UTC', to_timestamp(column_name))::date
      var timeZoneCast = function timeZoneCast(param) {
        return (0, _helpers.FuncCall)([(0, _helpers.StringValue)('pg_catalog'), (0, _helpers.StringValue)('timezone')], [(0, _helpers.AConst)((0, _helpers.StringValue)('UTC')), param]);
      };

      var toTimestamp = function toTimestamp(param) {
        return (0, _helpers.FuncCall)([(0, _helpers.StringValue)('pg_catalog'), (0, _helpers.StringValue)('to_timestamp')], [param]);
      };

      targetList = [(0, _helpers.ResTarget)((0, _helpers.TypeCast)((0, _helpers.TypeName)('date'), timeZoneCast(toTimestamp(valueColumn))), 'value')];
    } else {
      targetList = [(0, _helpers.ResTarget)(valueColumn, 'value')];
    }

    targetList.push((0, _helpers.ResTarget)((0, _helpers.FuncCall)('count', [(0, _helpers.AConst)((0, _helpers.IntegerValue)(1))]), 'count'));

    if (isLinkedRecord) {
      targetList.push((0, _helpers.ResTarget)((0, _helpers.ColumnRef)('__title', '__linked'), 'label'));
    }

    var joins = query.joinColumns.map(function (o) {
      return o.join;
    });

    if (options.column.join) {
      joins.push(options.column.join);
    }

    if (isLinkedRecord) {
      joins.push({
        inner: false,
        tableName: query.form.id + "/" + options.column.element.key,
        alias: '__linked_join',
        sourceColumn: '_record_id',
        joinColumn: 'source_record_id'
      });
      var subQuery = (0, _helpers.SelectStmt)({
        targetList: [(0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_title'), '__title'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_record_id'), '__record_id')],
        fromClause: [(0, _helpers.RangeVar)("" + options.column.element.form.id)]
      });
      var linkedSubselect = (0, _helpers.RangeSubselect)(subQuery, (0, _helpers.Alias)('__linked'));
      joins.push({
        inner: false,
        rarg: linkedSubselect,
        alias: '__linked',
        sourceTableName: '__linked_join',
        sourceColumn: 'linked_record_id',
        joinColumn: '__record_id'
      });
    }

    var fromClause = this.fromClause(query, joins, [options.column]); // const whereClause = null; // options.all ? null : this.whereClause(query);
    // TODO(zhm) need to pass the bbox and search here?

    var whereClause = this.whereClause(query, null, null, options);
    var groupClause = [(0, _helpers.AConst)((0, _helpers.IntegerValue)(1))];

    if (isLinkedRecord) {
      groupClause.push((0, _helpers.AConst)((0, _helpers.IntegerValue)(3)));
    }

    var sortClause = [];

    if (options.by === 'frequency') {
      sortClause.push((0, _helpers.SortBy)((0, _helpers.AConst)((0, _helpers.IntegerValue)(2)), 2, 0));
    }

    if (isLinkedRecord) {
      sortClause.push((0, _helpers.SortBy)((0, _helpers.AConst)((0, _helpers.IntegerValue)(3)), 1, 0));
    }

    sortClause.push((0, _helpers.SortBy)((0, _helpers.AConst)((0, _helpers.IntegerValue)(1)), 1, 0));
    var limitCount = this.limitCount(MAX_DISTINCT_VALUES);
    return (0, _helpers.SelectStmt)({
      targetList: targetList,
      fromClause: fromClause,
      whereClause: whereClause,
      groupClause: groupClause,
      sortClause: sortClause,
      limitCount: limitCount
    });
  };

  _proto.toSummaryAST = function toSummaryAST(query, columnSetting, _ref5) {
    var boundingBox = _ref5.boundingBox,
        searchFilter = _ref5.searchFilter;

    if (columnSetting.summary.aggregate === _aggregate.AggregateType.Histogram.name) {
      var histogramAttributes = {
        column: columnSetting.column,
        bucketSize: 12,
        type: columnSetting.column.isDate ? 'date' : 'number',
        sort: null,
        boundingBox: boundingBox,
        searchFilter: searchFilter
      };
      return this.toHistogramAST(query, histogramAttributes);
    }

    var targetList = this.summaryTargetList(query, columnSetting);
    var joins = query.joinColumns.map(function (o) {
      return o.join;
    });

    if (columnSetting.column.join) {
      joins.push(columnSetting.column.join);
    }

    var fromClause = this.fromClause(query, joins, [columnSetting.column]);
    var whereClause = this.summaryWhereClause(query, columnSetting, {
      boundingBox: boundingBox,
      searchFilter: searchFilter
    });
    return (0, _helpers.SelectStmt)({
      targetList: targetList,
      fromClause: fromClause,
      whereClause: whereClause
    });
  };

  _proto.histogramWithClause = function histogramWithClause(column, bucketSize, type, query, boundingBox, searchFilter) {
    var recordsTargetList = null;

    if (type === 'date') {
      var datePartArgs = [(0, _helpers.AConst)((0, _helpers.StringValue)('epoch')), (0, _helpers.TypeCast)((0, _helpers.TypeName)('date'), columnRef(column))];
      recordsTargetList = [(0, _helpers.ResTarget)((0, _helpers.FuncCall)('date_part', datePartArgs), 'value')];
    } else {
      recordsTargetList = [(0, _helpers.ResTarget)((0, _helpers.TypeCast)((0, _helpers.TypeName)([(0, _helpers.StringValue)('pg_catalog'), (0, _helpers.StringValue)('float8')]), columnRef(column)), 'value')];
    }

    var joins = query.joinColumnsWithSorting.map(function (o) {
      return o.join;
    });
    var recordsFromClause = this.fromClause(query, joins, [column]);
    var recordsWhere = this.whereClause(query, boundingBox, searchFilter);
    var recordsSelect = (0, _helpers.SelectStmt)({
      targetList: recordsTargetList,
      fromClause: recordsFromClause,
      whereClause: recordsWhere
    });
    var recordsExpr = (0, _helpers.CommonTableExpr)('__records', recordsSelect);
    var statsTargetList = [(0, _helpers.ResTarget)((0, _helpers.AConst)((0, _helpers.IntegerValue)(bucketSize)), 'buckets'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)('count', [(0, _helpers.AConst)((0, _helpers.IntegerValue)(1))]), 'count'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)('min', [(0, _helpers.ColumnRef)('value')]), 'min_value'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)('max', [(0, _helpers.ColumnRef)('value')]), 'max_value'), (0, _helpers.ResTarget)((0, _helpers.AExpr)(0, '-', (0, _helpers.FuncCall)('max', [(0, _helpers.ColumnRef)('value')]), (0, _helpers.FuncCall)('min', [(0, _helpers.ColumnRef)('value')])), 'range'), (0, _helpers.ResTarget)((0, _helpers.AExpr)(0, '/', (0, _helpers.AExpr)(0, '-', (0, _helpers.TypeCast)((0, _helpers.TypeName)([(0, _helpers.StringValue)('pg_catalog'), (0, _helpers.StringValue)('float8')]), (0, _helpers.FuncCall)('max', [(0, _helpers.ColumnRef)('value')])), (0, _helpers.TypeCast)((0, _helpers.TypeName)([(0, _helpers.StringValue)('pg_catalog'), (0, _helpers.StringValue)('float8')]), (0, _helpers.FuncCall)('min', [(0, _helpers.ColumnRef)('value')]))), (0, _helpers.AConst)((0, _helpers.FloatValue)(bucketSize))), 'bucket_width')];
    var statsFromClause = [(0, _helpers.RangeVar)('__records')];
    var statsSelect = (0, _helpers.SelectStmt)({
      targetList: statsTargetList,
      fromClause: statsFromClause
    });
    var statsExpr = (0, _helpers.CommonTableExpr)('__stats', statsSelect);
    return (0, _helpers.WithClause)([recordsExpr, statsExpr]);
  };

  _proto.toSchemaAST = function toSchemaAST(query, _temp) {
    var _ref6 = _temp === void 0 ? {} : _temp,
        schemaOnly = _ref6.schemaOnly;

    // wrap the query in a subquery with 1=0
    var targetList = [(0, _helpers.ResTarget)((0, _helpers.ColumnRef)((0, _helpers.AStar)()))];
    var fromClause = [(0, _helpers.RangeSubselect)(query, (0, _helpers.Alias)('wrapped'))];
    var whereClause = schemaOnly ? (0, _helpers.AExpr)(0, '=', (0, _helpers.AConst)((0, _helpers.IntegerValue)(0)), (0, _helpers.AConst)((0, _helpers.IntegerValue)(1))) : null;
    return (0, _helpers.SelectStmt)({
      targetList: targetList,
      fromClause: fromClause,
      whereClause: whereClause
    });
  };

  _proto.limitOffset = function limitOffset(pageSize, pageIndex) {
    if (pageSize != null && pageIndex != null) {
      return (0, _helpers.AConst)((0, _helpers.IntegerValue)(+pageIndex * +pageSize));
    }

    return null;
  };

  _proto.limitCount = function limitCount(pageSize) {
    if (pageSize != null) {
      return (0, _helpers.AConst)((0, _helpers.IntegerValue)(+pageSize));
    }

    return null;
  };

  _proto.targetList = function targetList(query, sort, boundingBox) {
    var list = [(0, _helpers.ResTarget)((0, _helpers.ColumnRef)((0, _helpers.AStar)(), 'records'))];
    var subJoinColumns = query.joinColumnsWithSorting;

    if (subJoinColumns.indexOf(query.schema.createdByColumn) !== -1) {
      list.push((0, _helpers.ResTarget)((0, _helpers.ColumnRef)('name', query.schema.createdByColumn.join.alias), query.schema.createdByColumn.id));
    }

    if (subJoinColumns.indexOf(query.schema.updatedByColumn) !== -1) {
      list.push((0, _helpers.ResTarget)((0, _helpers.ColumnRef)('name', query.schema.updatedByColumn.join.alias), query.schema.updatedByColumn.id));
    }

    if (subJoinColumns.indexOf(query.schema.assignedToColumn) !== -1) {
      list.push((0, _helpers.ResTarget)((0, _helpers.ColumnRef)('name', query.schema.assignedToColumn.join.alias), query.schema.assignedToColumn.id));
    }

    if (subJoinColumns.indexOf(query.schema.projectColumn) !== -1) {
      list.push((0, _helpers.ResTarget)((0, _helpers.ColumnRef)('name', query.schema.projectColumn.join.alias), query.schema.projectColumn.id));
    }

    list.push((0, _helpers.ResTarget)((0, _helpers.FuncCall)('row_number', null, {
      over: (0, _helpers.WindowDef)(sort, 530)
    }), '__row_number'));
    return list;
  };

  _proto.fromClause = function fromClause(query, leftJoins, exactColumns) {
    if (leftJoins === void 0) {
      leftJoins = [];
    }

    var baseQuery = null;

    if (query.ast) {
      var queryAST = query.ast;
      var referencedColumns = query.referencedColumns.concat(exactColumns || []); // If there's an `exactColumn`, pick it out specifically with a guaranteed unique alias so it can be
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

        for (var _iterator = referencedColumns, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref7;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref7 = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref7 = _i.value;
          }

          var column = _ref7;
          Converter.duplicateResTargetWithExactName(query, queryAST.SelectStmt.targetList, column, column.id);
        }
      }

      return [(0, _helpers.RangeSubselect)(queryAST, (0, _helpers.Alias)('records'))];
    }

    baseQuery = this.formQueryRangeVar(query);
    var visitedTables = {};

    if (leftJoins) {
      for (var _iterator2 = leftJoins, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref8;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref8 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref8 = _i2.value;
        }

        var join = _ref8;

        if (!visitedTables[join.alias]) {
          visitedTables[join.alias] = join;
          baseQuery = Converter.joinClause(baseQuery, join);
        }
      }
    }

    return [baseQuery];
  };

  _proto.whereClause = function whereClause(query, boundingBox, search, options) {
    if (options === void 0) {
      options = {};
    }

    var systemParts = [];
    options = _extends({}, query.options || {}, {}, options);
    var filterNode = this.nodeForCondition(query.filter, options);

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

    for (var _iterator3 = query.columnSettings.columns, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref9;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref9 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref9 = _i3.value;
      }

      var item = _ref9;

      if (item.hasFilter) {
        var expression = this.createExpressionForColumnFilter(item.filter, options);

        if (expression) {
          systemParts.push(expression);
        }
      }

      if (item.search) {
        if (item.column.isArray || item.column.isDate || item.column.isTime || item.column.isNumber) {
          systemParts.push((0, _helpers.AExpr)(8, '~~*', (0, _helpers.TypeCast)((0, _helpers.TypeName)('text'), columnRef(item.column)), (0, _helpers.AConst)((0, _helpers.StringValue)('%' + this.escapeLikePercent(item.search) + '%'))));
        } else {
          systemParts.push((0, _helpers.AExpr)(8, '~~*', columnRef(item.column), (0, _helpers.AConst)((0, _helpers.StringValue)('%' + this.escapeLikePercent(item.search) + '%'))));
        }
      }

      if (item.expression.isValid) {
        systemParts.push(this.nodeForExpression(item.expression, options));
      }

      if (item.range.isValid) {
        systemParts.push(this.nodeForExpression(item.range, options));
      }
    }

    if (options.expressions) {
      systemParts.push.apply(systemParts, options.expressions);
    }

    var expressions = systemParts.filter(function (o) {
      return o != null;
    });

    if (filterNode && expressions.length) {
      return (0, _helpers.BoolExpr)(0, [filterNode].concat(expressions));
    } else if (expressions.length) {
      return (0, _helpers.BoolExpr)(0, [].concat(expressions));
    }

    return filterNode;
  };

  Converter.joinClause = function joinClause(baseQuery, _ref10) {
    var inner = _ref10.inner,
        tableName = _ref10.tableName,
        alias = _ref10.alias,
        sourceColumn = _ref10.sourceColumn,
        joinColumn = _ref10.joinColumn,
        sourceTableName = _ref10.sourceTableName,
        rarg = _ref10.rarg;
    return (0, _helpers.JoinExpr)(inner ? 0 : 1, baseQuery, rarg || (0, _helpers.RangeVar)(tableName, (0, _helpers.Alias)(alias)), (0, _helpers.AExpr)(0, '=', (0, _helpers.ColumnRef)(sourceColumn, sourceTableName || 'records'), (0, _helpers.ColumnRef)(joinColumn, alias)));
  };

  Converter.duplicateResTargetWithExactName = function duplicateResTargetWithExactName(query, targetList, column, exactName) {
    var resTarget = Converter.findResTarget(query, column); // If a column is referenced more than once don't add it again

    for (var _iterator4 = targetList, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
      var _ref11;

      if (_isArray4) {
        if (_i4 >= _iterator4.length) break;
        _ref11 = _iterator4[_i4++];
      } else {
        _i4 = _iterator4.next();
        if (_i4.done) break;
        _ref11 = _i4.value;
      }

      var existing = _ref11;

      if (existing.ResTarget.name === exactName) {
        return;
      }
    } // If we found a matching restarget, copy the entire node and give it a new name


    if (resTarget) {
      resTarget = JSON.parse(JSON.stringify(resTarget));
      resTarget.ResTarget.name = exactName;
    } else {
      resTarget = (0, _helpers.ResTarget)((0, _helpers.ColumnRef)(column.columnName, column.source), exactName);
    }

    targetList.push(resTarget);
  };

  Converter.findResTarget = function findResTarget(query, column) {
    // UNION's don't have targetList's
    if (!query.ast.SelectStmt.targetList) {
      return null;
    } // look for any A_Star nodes, a SELECT * modifies how we process the res targets. If there's
    // an A_Star node in the targetList, it means that we can't just get the column by index because
    // the * might expand to columns that cause the indexes to be different.


    var hasStar = query.ast.SelectStmt.targetList.find(function (target) {
      return target.ResTarget && target.ResTarget.val && target.ResTarget.val.ColumnRef && target.ResTarget.val.ColumnRef.fields && target.ResTarget.val.ColumnRef.fields[0] && target.ResTarget.val.ColumnRef.fields[0].A_Star;
    }); // the simple case is when there is no * in the query

    if (!hasStar && query.ast.SelectStmt.targetList.length === query.schema.columns.length) {
      return query.ast.SelectStmt.targetList[column.index];
    } // Find the ResTarget node by name, or else return null, which means the column
    // must be coming from a * node and we can just use a simple ResTarget + ColumnRef


    return query.ast.SelectStmt.targetList.find(function (target) {
      return target.ResTarget.name === column.name;
    });
  };

  _proto.formQueryRangeVar = function formQueryRangeVar(query) {
    var full = query.full ? '/_full' : '';

    if (query.repeatableKey) {
      return (0, _helpers.RangeVar)(query.form.id + '/' + query.repeatableKey + full, (0, _helpers.Alias)('records'));
    }

    return (0, _helpers.RangeVar)(query.form.id + full, (0, _helpers.Alias)('records'));
  };

  _proto.createExpressionForColumnFilter = function createExpressionForColumnFilter(filter, options) {
    var expression = null;

    if (filter === options.except) {
      return null;
    }

    if (filter.hasValues) {
      var hasNull = false;
      var values = [];
      filter.value.forEach(function (v) {
        if (v != null) {
          values.push(v);
        } else {
          hasNull = true;
        }
      });

      if (values.length) {
        if (filter.column.isArray) {
          expression = this.AnyOf(filter.column, values);
        } else if (filter.column.element && filter.column.element.isCalculatedElement && filter.column.element.display.isDate) {
          expression = this.In(filter.column, values.map(function (value) {
            return new Date(value).getTime() / 1000;
          }));
        } else {
          expression = this.In(filter.column, values);
        }

        if (hasNull) {
          expression = (0, _helpers.BoolExpr)(1, [(0, _helpers.NullTest)(0, columnRef(filter.column)), expression]);
        }
      } else if (hasNull) {
        expression = (0, _helpers.NullTest)(0, columnRef(filter.column));
      }
    } else if (filter.isEmptySet) {
      // add 1 = 0 clause to return 0 rows
      expression = (0, _helpers.AExpr)(0, '=', (0, _helpers.AConst)((0, _helpers.IntegerValue)(1)), (0, _helpers.AConst)((0, _helpers.IntegerValue)(0)));
    }

    return expression;
  };

  _proto.boundingBoxFilter = function boundingBoxFilter(query, boundingBox) {
    var xmin = boundingBox[0],
        ymin = boundingBox[1],
        xmax = boundingBox[2],
        ymax = boundingBox[3];
    var columnName = query.ast ? '__geometry' : '_geometry'; // if the east value is less than the west value, the bbox spans the 180 meridian.
    // Split the box into 2 separate boxes on either side of the meridian and use
    // an OR statement in the where clause so records on either side of the meridian
    // will be returned.

    if (xmax < xmin) {
      var box1 = [xmin, ymin, 180, ymax];
      var box2 = [-180, ymin, xmax, ymax];
      var boxes = [this.geometryQuery(columnName, box1), this.geometryQuery(columnName, box2)];
      return (0, _helpers.BoolExpr)(1, boxes);
    }

    return this.geometryQuery(columnName, boundingBox);
  };

  _proto.geometryQuery = function geometryQuery(columnName, boundingBox) {
    var args = [(0, _helpers.AConst)((0, _helpers.FloatValue)(boundingBox[0])), (0, _helpers.AConst)((0, _helpers.FloatValue)(boundingBox[1])), (0, _helpers.AConst)((0, _helpers.FloatValue)(boundingBox[2])), (0, _helpers.AConst)((0, _helpers.FloatValue)(boundingBox[3])), (0, _helpers.AConst)((0, _helpers.IntegerValue)(4326))];
    var rhs = (0, _helpers.FuncCall)('st_makeenvelope', args);
    return (0, _helpers.AExpr)(0, '&&', (0, _helpers.ColumnRef)(columnName), rhs);
  };

  _proto.escapeLikePercent = function escapeLikePercent(value) {
    return value.replace(/\%/g, '\\%').replace(/_/g, '\\_%');
  };

  _proto.searchFilter = function searchFilter(query, search) {
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
    search = search.trim(); // if it's a fully custom SQL statement, use a simpler form with no index

    if (query.ast) {
      return (0, _helpers.AExpr)(8, '~~*', (0, _helpers.TypeCast)((0, _helpers.TypeName)('text'), (0, _helpers.ColumnRef)('records')), (0, _helpers.AConst)((0, _helpers.StringValue)('%' + this.escapeLikePercent(search) + '%')));
    }

    var toTsQuery = function toTsQuery(dictionary, term) {
      var args = [(0, _helpers.AConst)((0, _helpers.StringValue)(dictionary)), (0, _helpers.AConst)((0, _helpers.StringValue)("'" + term + "':*"))];
      return (0, _helpers.FuncCall)('to_tsquery', args);
    };

    var makeTsQueryCall = function makeTsQueryCall(term) {
      return toTsQuery('english', term.toLowerCase().replace(/'/g, "''"));
    };

    var terms = search.split(' ').filter(function (s) {
      return s.trim().length;
    });
    var term = terms.shift();
    var tsQueries = makeTsQueryCall(term);

    while (terms.length) {
      term = terms.shift();
      tsQueries = (0, _helpers.AExpr)(0, '&&', tsQueries, makeTsQueryCall(term));
    }

    var ftsExpression = (0, _helpers.AExpr)(0, '@@', (0, _helpers.ColumnRef)('_record_index'), tsQueries);
    var ilikeExpression = (0, _helpers.AExpr)(8, '~~*', (0, _helpers.ColumnRef)('_record_index_text'), (0, _helpers.AConst)((0, _helpers.StringValue)('%' + this.escapeLikePercent(search) + '%')));
    var andArgs = [ftsExpression, ilikeExpression];
    return (0, _helpers.BoolExpr)(0, andArgs);
  };

  _proto.summaryWhereClause = function summaryWhereClause(query, columnSetting, _ref12) {
    var _converters;

    var boundingBox = _ref12.boundingBox,
        searchFilter = _ref12.searchFilter;
    var expressions = [];
    var converters = (_converters = {}, _converters[_aggregate.AggregateType.Empty.name] = function () {
      return (0, _helpers.NullTest)(0, columnRef(columnSetting.column));
    }, _converters[_aggregate.AggregateType.NotEmpty.name] = function () {
      return (0, _helpers.NullTest)(1, columnRef(columnSetting.column));
    }, _converters[_aggregate.AggregateType.PercentEmpty.name] = function () {
      return (0, _helpers.NullTest)(0, columnRef(columnSetting.column));
    }, _converters[_aggregate.AggregateType.PercentNotEmpty.name] = function () {
      return (0, _helpers.NullTest)(1, columnRef(columnSetting.column));
    }, _converters);
    var expressionConverter = converters[columnSetting.summary.aggregate];

    if (expressionConverter) {
      expressions.push(expressionConverter());
    }

    return this.whereClause(query, boundingBox, searchFilter, {
      expressions: expressions
    });
  };

  _proto.summaryTargetList = function summaryTargetList(query, columnSetting) {
    var _converter;

    var simpleFunctionResTarget = function simpleFunctionResTarget(funcName, param) {
      return function () {
        return [(0, _helpers.ResTarget)((0, _helpers.FuncCall)(funcName, [param || columnRef(columnSetting.column)]), 'value')];
      };
    };

    var converter = (_converter = {}, _converter[_aggregate.AggregateType.Sum.name] = simpleFunctionResTarget('sum'), _converter[_aggregate.AggregateType.Average.name] = simpleFunctionResTarget('avg'), _converter[_aggregate.AggregateType.Min.name] = simpleFunctionResTarget('min'), _converter[_aggregate.AggregateType.Max.name] = simpleFunctionResTarget('max'), _converter[_aggregate.AggregateType.StdDev.name] = simpleFunctionResTarget('stddev'), _converter[_aggregate.AggregateType.Histogram.name] = simpleFunctionResTarget('count'), _converter[_aggregate.AggregateType.Empty.name] = simpleFunctionResTarget('count', (0, _helpers.AConst)((0, _helpers.IntegerValue)(1))), _converter[_aggregate.AggregateType.NotEmpty.name] = simpleFunctionResTarget('count', (0, _helpers.AConst)((0, _helpers.IntegerValue)(1))), _converter[_aggregate.AggregateType.Unique.name] = function () {
      return [(0, _helpers.ResTarget)((0, _helpers.FuncCall)('count', [columnRef(columnSetting.column)], {
        agg_distinct: true
      }), 'value')];
    }, _converter[_aggregate.AggregateType.PercentEmpty.name] = simpleFunctionResTarget('count'), _converter[_aggregate.AggregateType.PercentNotEmpty.name] = simpleFunctionResTarget('count'), _converter[_aggregate.AggregateType.PercentUnique.name] = simpleFunctionResTarget('count'), _converter);
    return converter[columnSetting.summary.aggregate]();
  };

  _proto.nodeForExpressions = function nodeForExpressions(expressions, options) {
    var _this2 = this;

    return expressions.map(function (e) {
      return _this2.nodeForExpression(e, options);
    }).filter(function (e) {
      return e;
    });
  };

  _proto.nodeForCondition = function nodeForCondition(condition, options) {
    var _converter2;

    var converter = (_converter2 = {}, _converter2[_condition.ConditionType.And] = this.AndConverter, _converter2[_condition.ConditionType.Or] = this.OrConverter, _converter2[_condition.ConditionType.Not] = this.NotConverter, _converter2);
    return converter[condition.type](condition, options);
  };

  _proto.nodeForExpression = function nodeForExpression(expression, options) {
    var _converter3;

    if (expression.expressions) {
      return this.nodeForCondition(expression, options);
    }

    if (expression === options.except) {
      return null;
    }

    var converter = (_converter3 = {}, _converter3[_operator.OperatorType.Empty.name] = this.EmptyConverter, _converter3[_operator.OperatorType.NotEmpty.name] = this.NotEmptyConverter, _converter3[_operator.OperatorType.Equal.name] = this.EqualConverter, _converter3[_operator.OperatorType.NotEqual.name] = this.NotEqualConverter, _converter3[_operator.OperatorType.GreaterThan.name] = this.GreaterThanConverter, _converter3[_operator.OperatorType.GreaterThanOrEqual.name] = this.GreaterThanOrEqualConverter, _converter3[_operator.OperatorType.LessThan.name] = this.LessThanConverter, _converter3[_operator.OperatorType.LessThanOrEqual.name] = this.LessThanOrEqualConverter, _converter3[_operator.OperatorType.Between.name] = this.BetweenConverter, _converter3[_operator.OperatorType.NotBetween.name] = this.NotBetweenConverter, _converter3[_operator.OperatorType.In.name] = this.InConverter, _converter3[_operator.OperatorType.NotIn.name] = this.NotInConverter, _converter3[_operator.OperatorType.TextContain.name] = this.TextContainConverter, _converter3[_operator.OperatorType.TextNotContain.name] = this.TextNotContainConverter, _converter3[_operator.OperatorType.TextStartsWith.name] = this.TextStartsWithConverter, _converter3[_operator.OperatorType.TextEndsWith.name] = this.TextEndsWithConverter, _converter3[_operator.OperatorType.TextEqual.name] = this.TextEqualConverter, _converter3[_operator.OperatorType.TextNotEqual.name] = this.TextNotEqualConverter, _converter3[_operator.OperatorType.TextMatch.name] = this.TextMatchConverter, _converter3[_operator.OperatorType.TextNotMatch.name] = this.TextNotMatchConverter, _converter3[_operator.OperatorType.DateEqual.name] = this.EqualConverter, _converter3[_operator.OperatorType.DateNotEqual.name] = this.NotEqualConverter, _converter3[_operator.OperatorType.DateAfter.name] = this.GreaterThanConverter, _converter3[_operator.OperatorType.DateOnOrAfter.name] = this.GreaterThanOrEqualConverter, _converter3[_operator.OperatorType.DateBefore.name] = this.LessThanConverter, _converter3[_operator.OperatorType.DateOnOrBefore.name] = this.LessThanOrEqualConverter, _converter3[_operator.OperatorType.DateBetween.name] = this.BetweenConverter, _converter3[_operator.OperatorType.DateNotBetween.name] = this.NotBetweenConverter, _converter3[_operator.OperatorType.ArrayAnyOf.name] = this.ArrayAnyOfConverter, _converter3[_operator.OperatorType.ArrayAllOf.name] = this.ArrayAllOfConverter, _converter3[_operator.OperatorType.ArrayEqual.name] = this.ArrayEqualConverter, _converter3[_operator.OperatorType.Search.name] = this.SearchConverter, _converter3[_operator.OperatorType.DateToday.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateYesterday.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateTomorrow.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateLast7Days.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateLast30Days.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateLast90Days.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateLastMonth.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateLastYear.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateNextWeek.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateNextMonth.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateNextYear.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateCurrentCalendarWeek.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateCurrentCalendarMonth.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateCurrentCalendarYear.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DatePreviousCalendarWeek.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DatePreviousCalendarMonth.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DatePreviousCalendarYear.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateNextCalendarWeek.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateNextCalendarMonth.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateNextCalendarYear.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateDaysFromNow.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateWeeksFromNow.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateMonthsFromNow.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateYearsFromNow.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateDaysAgo.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateWeeksAgo.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateMonthsAgo.name] = this.DynamicDateConverter, _converter3[_operator.OperatorType.DateYearsAgo.name] = this.DynamicDateConverter, _converter3);

    if (!expression.isValid) {
      return null;
    }

    return converter[expression.operator](expression, options);
  };

  return Converter;
}();

exports["default"] = Converter;
//# sourceMappingURL=converter.js.map