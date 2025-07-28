"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATE_AGGREGATES = exports.NUMERIC_AGGREGATES = exports.TEXTUAL_AGGREGATES = exports.AggregatesByValue = exports.AggregateType = void 0;
exports.availableAggregatesForColumn = availableAggregatesForColumn;
exports.AggregateType = {
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
exports.AggregatesByValue = {};
for (const key of Object.keys(exports.AggregateType)) {
    exports.AggregatesByValue[exports.AggregateType[key].name] = exports.AggregateType[key];
}
const TEXTUAL_AGGREGATES = [
    exports.AggregateType.Empty,
    exports.AggregateType.NotEmpty,
    exports.AggregateType.Unique
];
exports.TEXTUAL_AGGREGATES = TEXTUAL_AGGREGATES;
const NUMERIC_AGGREGATES = [
    exports.AggregateType.Sum,
    exports.AggregateType.Average,
    // AggregateType.Median,
    exports.AggregateType.Min,
    exports.AggregateType.Max,
    exports.AggregateType.StdDev,
    exports.AggregateType.Histogram,
    exports.AggregateType.Empty,
    exports.AggregateType.NotEmpty,
    exports.AggregateType.Unique
];
exports.NUMERIC_AGGREGATES = NUMERIC_AGGREGATES;
const DATE_AGGREGATES = [
    exports.AggregateType.Min,
    exports.AggregateType.Max,
    exports.AggregateType.Histogram,
    exports.AggregateType.Empty,
    exports.AggregateType.NotEmpty,
    exports.AggregateType.Unique
];
exports.DATE_AGGREGATES = DATE_AGGREGATES;
function availableAggregatesForColumn(column) {
    const aggregates = [];
    if (column == null) {
        return aggregates;
    }
    // Repeatable columns don't have a physical column to enable aggregates
    // this column is the "4 items" value, which requires the in-memory record.
    // Until we add an underlying db column for the item count, we can't do any
    // aggregates on the repeatable itself.
    if (column.element && column.element.isRepeatableElement) {
        return aggregates;
    }
    if (column.isNumber) {
        aggregates.push.apply(aggregates, NUMERIC_AGGREGATES);
    }
    else if (column.isArray) {
        // aggregates.push.apply(operators, ARRAY_OPERATORS);
    }
    else if (column.isDate) {
        aggregates.push.apply(aggregates, DATE_AGGREGATES);
    }
    else {
        aggregates.push.apply(aggregates, TEXTUAL_AGGREGATES);
    }
    return aggregates;
}
//# sourceMappingURL=aggregate.js.map