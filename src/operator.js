import moment from 'moment';

export const OperatorType = {
  Empty: {
    name: 'is_empty',
    label: 'Is blank'
  },

  NotEmpty: {
    name: 'is_not_empty',
    label: 'Is not blank'
  },

  Equal: {
    name: 'equal',
    label: 'Equals'
  },

  NotEqual: {
    name: 'not_equal',
    label: 'Does not equal'
  },

  GreaterThan: {
    name: 'greater_than',
    label: 'Greater than'
  },

  GreaterThanOrEqual: {
    name: 'greater_than_or_equal',
    label: 'Greater than or equal to'
  },

  LessThan: {
    name: 'less_than',
    label: 'Less than'
  },

  LessThanOrEqual: {
    name: 'less_than_or_equal',
    label: 'Less than or equal to'
  },

  Between: {
    name: 'between',
    label: 'Between'
  },

  NotBetween: {
    name: 'not_between',
    label: 'Not between'
  },

  In: {
    name: 'in',
    label: 'One of'
  },

  NotIn: {
    name: 'not_in',
    label: 'Not one of'
  },

  TextContain: {
    name: 'text_contain',
    label: 'Contains'
  },

  TextNotContain: {
    name: 'text_not_contain',
    label: 'Does not contain'
  },

  TextStartsWith: {
    name: 'text_starts_with',
    label: 'Starts with'
  },

  TextEndsWith: {
    name: 'text_ends_with',
    label: 'Ends with'
  },

  TextEqual: {
    name: 'text_equal',
    label: 'Equals'
  },

  TextNotEqual: {
    name: 'text_not_equal',
    label: 'Does not equal'
  },

  TextMatch: {
    name: 'text_match',
    label: 'Matches regex'
  },

  TextNotMatch: {
    name: 'text_not_match',
    label: 'Does not match regex'
  },

  DateEqual: {
    name: 'date_equal',
    label: 'Equals'
  },

  DateNotEqual: {
    name: 'date_not_equal',
    label: 'Does not equal'
  },

  DateAfter: {
    name: 'date_after',
    label: 'After'
  },

  DateOnOrAfter: {
    name: 'date_on_or_after',
    label: 'On or After'
  },

  DateBefore: {
    name: 'date_before',
    label: 'Before'
  },

  DateOnOrBefore: {
    name: 'date_on_or_before',
    label: 'On or Before'
  },

  DateToday: {
    name: 'date_today',
    label: 'Today'
  },

  DateYesterday: {
    name: 'date_yesterday',
    label: 'Yesterday'
  },

  DateTomorrow: {
    name: 'date_tomorrow',
    label: 'Tomorrow'
  },

  DateLast7Days: {
    name: 'date_last_7_days',
    label: 'Last 7 days'
  },

  DateLast30Days: {
    name: 'date_last_30_days',
    label: 'Last 30 days'
  },

  DateLast90Days: {
    name: 'date_last_90_days',
    label: 'Last 90 days'
  },

  DateLastMonth: {
    name: 'date_last_month',
    label: '1 Month Ago'
  },

  DateLastYear: {
    name: 'date_last_year',
    label: '1 Year Ago'
  },

  DateNextWeek: {
    name: 'date_next_week',
    label: '1 Week from Now'
  },

  DateNextMonth: {
    name: 'date_next_month',
    label: '1 Month from Now'
  },

  DateNextYear: {
    name: 'date_next_year',
    label: '1 Year from Now'
  },

  DateCurrentCalendarWeek: {
    name: 'date_current_calendar_week',
    label: 'This Week'
  },

  DateCurrentCalendarMonth: {
    name: 'date_current_calendar_month',
    label: 'This Month'
  },

  DateCurrentCalendarYear: {
    name: 'date_current_calendar_year',
    label: 'This Year'
  },

  DatePreviousCalendarWeek: {
    name: 'date_previous_calendar_week',
    label: 'Last Week'
  },

  DatePreviousCalendarMonth: {
    name: 'date_previous_calendar_month',
    label: 'Last Month'
  },

  DatePreviousCalendarYear: {
    name: 'date_previous_calendar_year',
    label: 'Last Year'
  },

  DateNextCalendarWeek: {
    name: 'date_next_calendar_week',
    label: 'Next Week'
  },

  DateNextCalendarMonth: {
    name: 'date_next_calendar_month',
    label: 'Next Month'
  },

  DateNextCalendarYear: {
    name: 'date_next_calendar_year',
    label: 'Next Year'
  },

  DateDaysFromNow: {
    name: 'date_days_from_now',
    label: 'Days from Now'
  },

  DateWeeksFromNow: {
    name: 'date_weeks_from_now',
    label: 'Weeks from Now'
  },

  DateMonthsFromNow: {
    name: 'date_months_from_now',
    label: 'Months from now'
  },

  DateYearsFromNow: {
    name: 'date_weeks_from_now',
    label: 'Years from now'
  },

  DateDaysAgo: {
    name: 'date_days_ago',
    label: 'Days ago'
  },

  DateWeeksAgo: {
    name: 'date_weeks_ago',
    label: 'Weeks ago'
  },

  DateMonthsAgo: {
    name: 'date_months_ago',
    label: 'Months ago'
  },

  DateYearsAgo: {
    name: 'date_years_ago',
    label: 'Years ago'
  },

  DateBetween: {
    name: 'date_between',
    label: 'Specific Range'
  },

  DateNotBetween: {
    name: 'date_not_between',
    label: 'Not Between'
  },

  ArrayAnyOf: {
    name: 'array_any_of',
    label: 'Any of'
  },

  ArrayAllOf: {
    name: 'array_all_of',
    label: 'All of'
  },

  ArrayIsContainedIn: {
    name: 'array_is_contained_in',
    label: 'Contained In'
  },

  ArrayNoneOf: {
    name: 'array_none_of',
    label: 'None of'
  },

  ArrayEqual: {
    name: 'array_equal',
    label: 'Equals'
  },

  Search: {
    name: 'search',
    label: 'Search'
  }
};

export const OperatorsByValue = {};

for (const key of Object.keys(OperatorType)) {
  OperatorsByValue[OperatorType[key].name] = OperatorType[key];
}

const TEXTUAL_OPERATORS = [
  OperatorType.In,
  OperatorType.NotIn,
  OperatorType.Empty,
  OperatorType.NotEmpty,
  OperatorType.TextContain,
  OperatorType.TextNotContain,
  OperatorType.TextStartsWith,
  OperatorType.TextEndsWith,
  OperatorType.TextEqual,
  OperatorType.TextNotEqual,
  OperatorType.TextMatch,
  OperatorType.TextNotMatch
];

const DATE_OPERATORS = [
  OperatorType.DateEqual,
  OperatorType.DateOnOrAfter,
  OperatorType.DateAfter,
  OperatorType.DateOnOrBefore,
  OperatorType.DateBefore,
  OperatorType.DateBetween,
  OperatorType.DateNotBetween,
  OperatorType.DateNotEqual,
  OperatorType.Empty,
  OperatorType.NotEmpty,
  OperatorType.In,
  OperatorType.NotIn,
  OperatorType.DateToday,
  OperatorType.DateYesterday,
  OperatorType.DateTomorrow,
  OperatorType.DateLast7Days,
  OperatorType.DateLast30Days,
  OperatorType.DateLast90Days,
  OperatorType.DateLastMonth,
  OperatorType.DateLastYear,
  OperatorType.DateNextWeek,
  OperatorType.DateNextMonth,
  OperatorType.DateNextYear,
  OperatorType.DateCurrentCalendarWeek,
  OperatorType.DateCurrentCalendarMonth,
  OperatorType.DateCurrentCalendarYear,
  OperatorType.DatePreviousCalendarWeek,
  OperatorType.DatePreviousCalendarMonth,
  OperatorType.DatePreviousCalendarYear,
  OperatorType.DateNextCalendarWeek,
  OperatorType.DateNextCalendarMonth,
  OperatorType.DateNextCalendarYear,
  OperatorType.DateDaysFromNow,
  OperatorType.DateWeeksFromNow,
  OperatorType.DateMonthsFromNow,
  OperatorType.DateYearsFromNow,
  OperatorType.DateDaysAgo,
  OperatorType.DateWeeksAgo,
  OperatorType.DateMonthsAgo,
  OperatorType.DateYearsAgo
];

export const DYNAMIC_DATE_OPERATORS = [
  OperatorType.DateToday,
  OperatorType.DateYesterday,
  OperatorType.DateTomorrow,
  OperatorType.DateLast7Days,
  OperatorType.DateLast30Days,
  OperatorType.DateLast90Days,
  OperatorType.DateLastMonth,
  OperatorType.DateLastYear,
  OperatorType.DateNextWeek,
  OperatorType.DateNextMonth,
  OperatorType.DateNextYear,
  OperatorType.DateCurrentCalendarWeek,
  OperatorType.DateCurrentCalendarMonth,
  OperatorType.DateCurrentCalendarYear,
  OperatorType.DatePreviousCalendarWeek,
  OperatorType.DatePreviousCalendarMonth,
  OperatorType.DatePreviousCalendarYear,
  OperatorType.DateNextCalendarWeek,
  OperatorType.DateNextCalendarMonth,
  OperatorType.DateNextCalendarYear,
  OperatorType.DateDaysFromNow,
  OperatorType.DateWeeksFromNow,
  OperatorType.DateMonthsFromNow,
  OperatorType.DateYearsFromNow,
  OperatorType.DateDaysAgo,
  OperatorType.DateWeeksAgo,
  OperatorType.DateMonthsAgo,
  OperatorType.DateYearsAgo
];

export const FRIENDLY_DATE_OPERATORS = [
  OperatorType.DateToday,
  OperatorType.DateYesterday,
  OperatorType.DateLast7Days,
  OperatorType.DateLast30Days,
  OperatorType.DateCurrentCalendarMonth,
  OperatorType.DatePreviousCalendarMonth,
  OperatorType.DateBetween
];

const NUMERIC_OPERATORS = [
  OperatorType.Equal,
  OperatorType.NotEqual,
  OperatorType.GreaterThan,
  OperatorType.GreaterThanOrEqual,
  OperatorType.LessThan,
  OperatorType.LessThanOrEqual,
  // OperatorType.Between,
  // OperatorType.NotBetween,
  OperatorType.Empty,
  OperatorType.NotEmpty,
  OperatorType.In,
  OperatorType.NotIn
];

const BOOLEAN_OPERATORS = [
  OperatorType.Equal,
  OperatorType.NotEqual,
  OperatorType.Empty,
  OperatorType.NotEmpty,
  OperatorType.In,
  OperatorType.NotIn
];

const ARRAY_OPERATORS = [
  OperatorType.ArrayAnyOf,
  OperatorType.ArrayAllOf,
  OperatorType.ArrayIsContainedIn,
  OperatorType.ArrayEqual,
  OperatorType.Empty,
  OperatorType.NotEmpty
];

const GEOSPATIAL_OPERATORS = [
];

const MEDIA_OPERATORS = [
  OperatorType.Empty,
  OperatorType.NotEmpty
];

const NO_VALUE_OPERATORS = [
  OperatorType.Empty,
  OperatorType.NotEmpty,
  OperatorType.DateToday,
  OperatorType.DateYesterday,
  OperatorType.DateTomorrow,
  OperatorType.DateLast7Days,
  OperatorType.DateLast30Days,
  OperatorType.DateLast90Days,
  OperatorType.DateLastMonth,
  OperatorType.DateLastYear,
  OperatorType.DateNextWeek,
  OperatorType.DateNextMonth,
  OperatorType.DateNextYear,
  OperatorType.DateCurrentCalendarWeek,
  OperatorType.DateCurrentCalendarMonth,
  OperatorType.DateCurrentCalendarYear,
  OperatorType.DatePreviousCalendarWeek,
  OperatorType.DatePreviousCalendarMonth,
  OperatorType.DatePreviousCalendarYear,
  OperatorType.DateNextCalendarWeek,
  OperatorType.DateNextCalendarMonth,
  OperatorType.DateNextCalendarYear
];

const SYSTEM_COLUMNS = {
  _record_id: TEXTUAL_OPERATORS,
  _project_id: TEXTUAL_OPERATORS,
  _assigned_to_id: TEXTUAL_OPERATORS,
  _status: TEXTUAL_OPERATORS,
  _latitude: NUMERIC_OPERATORS,
  _longitude: NUMERIC_OPERATORS,
  _created_at: DATE_OPERATORS,
  _updated_at: DATE_OPERATORS,
  _version: NUMERIC_OPERATORS,
  _created_by_id: TEXTUAL_OPERATORS,
  _updated_by_id: TEXTUAL_OPERATORS,
  _server_created_at: DATE_OPERATORS,
  _server_updated_at: DATE_OPERATORS,
  _geometry: GEOSPATIAL_OPERATORS,
  _altitude: NUMERIC_OPERATORS,
  _speed: NUMERIC_OPERATORS,
  _course: NUMERIC_OPERATORS,
  _horizontal_accuracy: NUMERIC_OPERATORS,
  _vertical_accuracy: NUMERIC_OPERATORS,
  _changeset_id: TEXTUAL_OPERATORS,
  _title: TEXTUAL_OPERATORS,
  _created_latitude: NUMERIC_OPERATORS,
  _created_longitude: NUMERIC_OPERATORS,
  _created_geometry: GEOSPATIAL_OPERATORS,
  _created_altitude: NUMERIC_OPERATORS,
  _created_horizontal_accuracy: NUMERIC_OPERATORS,
  _updated_latitude: NUMERIC_OPERATORS,
  _updated_longitude: NUMERIC_OPERATORS,
  _updated_geometry: GEOSPATIAL_OPERATORS,
  _updated_altitude: NUMERIC_OPERATORS,
  _updated_horizontal_accuracy: NUMERIC_OPERATORS,
  _created_duration: NUMERIC_OPERATORS,
  _updated_duration: NUMERIC_OPERATORS,
  _edited_duration: NUMERIC_OPERATORS,
  _record_key: TEXTUAL_OPERATORS,
  _record_sequence: NUMERIC_OPERATORS
};

export function isValueRequired(operator) {
  return !NO_VALUE_OPERATORS.find(o => o.name === operator);
}

export function isDateOperator(operator) {
  return DATE_OPERATORS.find(o => o.name === operator);
}

export function availableOperatorsForColumn(column) {
  const operators = [];

  if (column == null) {
    return operators;
  }

  if (SYSTEM_COLUMNS[column.id]) {
    return SYSTEM_COLUMNS[column.id];
  }

  const element = column && column.element;

  if (element) {
    if (element.isTextElement) {
      if (element.isNumeric) {
        operators.push.apply(operators, NUMERIC_OPERATORS);
      } else {
        operators.push.apply(operators, TEXTUAL_OPERATORS);
      }
    }

    if (element.isCheckboxElement) {
      operators.push.apply(operators, BOOLEAN_OPERATORS);
    }

    if (element.isDynamicElement) {
      operators.push.apply(operators, ARRAY_OPERATORS);
    }

    if (element.isCalculatedElement) {
      if (element.display.isNumber || element.display.isCurrency) {
        operators.push.apply(operators, NUMERIC_OPERATORS);
      } else if (element.display.isDate) {
        operators.push.apply(operators, DATE_OPERATORS);
      } else {
        operators.push.apply(operators, TEXTUAL_OPERATORS);
      }
    }

    if (element.isDateElement) {
      operators.push.apply(operators, DATE_OPERATORS);
    }

    if (element.isChoiceElement) {
      if (element.multiple) {
        operators.push.apply(operators, ARRAY_OPERATORS);
      } else {
        operators.push.apply(operators, TEXTUAL_OPERATORS);
      }
    }

    if (element.isYesNoElement) {
      operators.push.apply(operators, TEXTUAL_OPERATORS);
    }

    if (element.isClassificationElement || element.isRecordLinkElement) {
      operators.push.apply(operators, ARRAY_OPERATORS);
    }

    if (element.isStatusElement) {
      operators.push.apply(operators, TEXTUAL_OPERATORS);
    }

    if (element.isPhotoElement ||
          element.isVideoElement ||
          element.isAudioElement ||
          element.isSignatureElement ||
          element.isAttachmentElement) {
      operators.push.apply(operators, MEDIA_OPERATORS);
    }
  } else if (column.isSQL) {
    // custom types
    if (column.isNumber) {
      operators.push.apply(operators, NUMERIC_OPERATORS);
    } else if (column.isArray) {
      operators.push.apply(operators, ARRAY_OPERATORS);
    } else if (column.isDate) {
      operators.push.apply(operators, DATE_OPERATORS);
    } else {
      operators.push.apply(operators, TEXTUAL_OPERATORS);
    }
  }

  if (operators.length === 0) {
    operators.push.apply(operators, TEXTUAL_OPERATORS);
  }

  return operators;
}

export function calculateDateRange(operator, value, now) {
  now = moment(now || new Date()).clone().startOf('day');

  const date1 = now.clone();
  const date2 = now.clone();

  const range = (start, end) => {
    return [ start.clone(), (end || start).clone().endOf('day') ];
  };

  switch (operator) {
    case OperatorType.DateToday.name:
      return range(date1);

    case OperatorType.DateYesterday.name:
      return range(date1.subtract(1, 'days'), date2.subtract(1, 'days'));

    case OperatorType.DateTomorrow.name:
      return range(date1.add(1, 'days'));

    case OperatorType.DateLast7Days.name:
      return range(date1.subtract(7, 'days'), date2);

    case OperatorType.DateLast30Days.name:
      return range(date1.subtract(30, 'days'), date2);

    case OperatorType.DateLast90Days.name:
      return range(date1.subtract(90, 'days'), date2);

    case OperatorType.DateLastMonth.name:
      return range(date1.subtract(1, 'month'), date2);

    case OperatorType.DateLastYear.name:
      return range(date1.subtract(1, 'year'), date2);

    case OperatorType.DateNextWeek.name:
      return range(date1, date2.add(1, 'week'));

    case OperatorType.DateNextMonth.name:
      return range(date1, date2.add(1, 'month'));

    case OperatorType.DateNextYear.name:
      return range(date1, date2.add(1, 'year'));

    case OperatorType.DateCurrentCalendarWeek.name:
      return range(date1.startOf('week'), date2.endOf('week'));

    case OperatorType.DatePreviousCalendarWeek.name:
      return range(date1.subtract(1, 'week').startOf('week'),
                   date2.subtract(1, 'week').endOf('week'));

    case OperatorType.DateNextCalendarWeek.name:
      return range(date1.add(1, 'week').startOf('week'),
                   date2.add(1, 'week').endOf('week'));

    case OperatorType.DateCurrentCalendarMonth.name:
      return range(date1.startOf('month'), date2.endOf('month'));

    case OperatorType.DatePreviousCalendarMonth.name:
      return range(date1.subtract(1, 'month').startOf('month'),
                   date2.subtract(1, 'month').endOf('month'));

    case OperatorType.DateNextCalendarMonth.name:
      return range(date1.add(1, 'month').startOf('month'),
                   date2.add(1, 'month').endOf('month'));

    case OperatorType.DateCurrentCalendarYear.name:
      return range(date1.startOf('year'), date2.endOf('year'));

    case OperatorType.DatePreviousCalendarYear.name:
      return range(date1.subtract(1, 'year').startOf('year'),
                   date2.subtract(1, 'year').endOf('year'));

    case OperatorType.DateNextCalendarYear.name:
      return range(date1.add(1, 'year').startOf('year'),
                   date2.add(1, 'year').endOf('year'));

    case OperatorType.DateDaysFromNow.name:
      return value && range(date1, date2.add(+value, 'days'));

    case OperatorType.DateWeeksFromNow.name:
      return value && range(date1, date2.add(+value, 'weeks'));

    case OperatorType.DateMonthsFromNow.name:
      return value && range(date1, date2.add(+value, 'months'));

    case OperatorType.DateYearsFromNow.name:
      return value && range(date1, date2.add(+value, 'years'));

    case OperatorType.DateDaysAgo.name:
      return value && range(date1.subtract(+value, 'days'), date2);

    case OperatorType.DateWeeksAgo.name:
      return value && range(date1.subtract(+value, 'weeks'), date2);

    case OperatorType.DateMonthsAgo.name:
      return value && range(date1.subtract(+value, 'months'), date2);

    case OperatorType.DateYearsAgo.name:
      return value && range(date1.subtract(+value, 'years'), date2);

    case OperatorType.DateBetween.name:
      return value && range(value[0] && moment(value[0]), value[1] && moment(value[1]));

    default:
      return null;
  }
}
