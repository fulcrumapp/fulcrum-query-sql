'use strict';

exports.__esModule = true;
exports.availableAggregatesForColumn = availableAggregatesForColumn;
var AggregateType = exports.AggregateType = {
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

var AggregatesByValue = exports.AggregatesByValue = {};

for (var _iterator = Object.keys(AggregateType), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
  var _ref;

  if (_isArray) {
    if (_i >= _iterator.length) break;
    _ref = _iterator[_i++];
  } else {
    _i = _iterator.next();
    if (_i.done) break;
    _ref = _i.value;
  }

  var key = _ref;

  AggregatesByValue[AggregateType[key].name] = AggregateType[key];
}

var TEXTUAL_AGGREGATES = [AggregateType.Empty, AggregateType.NotEmpty, AggregateType.Unique];

var NUMERIC_AGGREGATES = [AggregateType.Sum, AggregateType.Average,
// AggregateType.Median,
AggregateType.Min, AggregateType.Max, AggregateType.StdDev, AggregateType.Histogram, AggregateType.Empty, AggregateType.NotEmpty, AggregateType.Unique];

var DATE_AGGREGATES = [AggregateType.Min, AggregateType.Max, AggregateType.Histogram, AggregateType.Empty, AggregateType.NotEmpty, AggregateType.Unique];

function availableAggregatesForColumn(column) {
  var aggregates = [];

  if (column == null) {
    return aggregates;
  }

  if (column.isNumber) {
    aggregates.push.apply(aggregates, NUMERIC_AGGREGATES);
  } else if (column.isArray) {
    // aggregates.push.apply(operators, ARRAY_OPERATORS);
  } else if (column.isDate) {
    aggregates.push.apply(aggregates, DATE_AGGREGATES);
  } else {
    aggregates.push.apply(aggregates, TEXTUAL_AGGREGATES);
  }

  return aggregates;
}

exports.TEXTUAL_AGGREGATES = TEXTUAL_AGGREGATES;
exports.NUMERIC_AGGREGATES = NUMERIC_AGGREGATES;
exports.DATE_AGGREGATES = DATE_AGGREGATES;
//# sourceMappingURL=aggregate.js.map