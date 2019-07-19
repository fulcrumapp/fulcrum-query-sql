"use strict";

exports.__esModule = true;
exports.availableAggregatesForColumn = availableAggregatesForColumn;
exports.DATE_AGGREGATES = exports.NUMERIC_AGGREGATES = exports.TEXTUAL_AGGREGATES = exports.AggregatesByValue = exports.AggregateType = void 0;
var AggregateType = {
  Sum: {
    name: 'sum',
    label: 'Sum'
  },
  Average: {
    name: 'average',
    label: 'Average'
  },
  Median: {
    name: 'median',
    label: 'Median'
  },
  Min: {
    name: 'min',
    label: 'Min'
  },
  Max: {
    name: 'max',
    label: 'Max'
  },
  StdDev: {
    name: 'stddev',
    label: 'Standard Deviation'
  },
  Histogram: {
    name: 'histogram',
    label: 'Histogram'
  },
  Empty: {
    name: 'empty',
    label: 'Count Blank',
    count: true
  },
  NotEmpty: {
    name: 'not_empty',
    label: 'Count Not Blank',
    count: true
  },
  Unique: {
    name: 'unique',
    label: 'Count Unique Values',
    count: true
  },
  PercentEmpty: {
    name: 'percent_empty',
    label: '% Blank'
  },
  PercentNotEmpty: {
    name: 'percent_not_empty',
    label: '% Not Blank'
  },
  PercentUnique: {
    name: 'percent_unique',
    label: '% Unique'
  }
};
exports.AggregateType = AggregateType;
var AggregatesByValue = {};
exports.AggregatesByValue = AggregatesByValue;

for (var _i = 0, _Object$keys = Object.keys(AggregateType); _i < _Object$keys.length; _i++) {
  var key = _Object$keys[_i];
  AggregatesByValue[AggregateType[key].name] = AggregateType[key];
}

var TEXTUAL_AGGREGATES = [AggregateType.Empty, AggregateType.NotEmpty, AggregateType.Unique];
exports.TEXTUAL_AGGREGATES = TEXTUAL_AGGREGATES;
var NUMERIC_AGGREGATES = [AggregateType.Sum, AggregateType.Average, // AggregateType.Median,
AggregateType.Min, AggregateType.Max, AggregateType.StdDev, AggregateType.Histogram, AggregateType.Empty, AggregateType.NotEmpty, AggregateType.Unique];
exports.NUMERIC_AGGREGATES = NUMERIC_AGGREGATES;
var DATE_AGGREGATES = [AggregateType.Min, AggregateType.Max, AggregateType.Histogram, AggregateType.Empty, AggregateType.NotEmpty, AggregateType.Unique];
exports.DATE_AGGREGATES = DATE_AGGREGATES;

function availableAggregatesForColumn(column) {
  var aggregates = [];

  if (column == null) {
    return aggregates;
  } // Repeatable columns don't have a physical column to enable aggregates
  // this column is the "4 items" value, which requires the in-memory record.
  // Until we add an underlying db column for the item count, we can't do any
  // aggregates on the repeatable itself.


  if (column.element && column.element.isRepeatableElement) {
    return aggregates;
  }

  if (column.isNumber) {
    aggregates.push.apply(aggregates, NUMERIC_AGGREGATES);
  } else if (column.isArray) {// aggregates.push.apply(operators, ARRAY_OPERATORS);
  } else if (column.isDate) {
    aggregates.push.apply(aggregates, DATE_AGGREGATES);
  } else {
    aggregates.push.apply(aggregates, TEXTUAL_AGGREGATES);
  }

  return aggregates;
}
//# sourceMappingURL=aggregate.js.map