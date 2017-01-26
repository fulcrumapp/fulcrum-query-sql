'use strict';

exports.__esModule = true;
exports.isValueRequired = isValueRequired;
exports.availableOperatorsForColumn = availableOperatorsForColumn;
var OperatorType = exports.OperatorType = {
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

  DateBefore: {
    name: 'date_before',
    label: 'Before'
  },

  ArrayAnyOf: {
    name: 'array_any_of',
    label: 'Any of'
  },

  ArrayAllOf: {
    name: 'array_all_of',
    label: 'All of'
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

var TEXTUAL_OPERATORS = [OperatorType.In, OperatorType.NotIn, OperatorType.Empty, OperatorType.NotEmpty, OperatorType.TextContain, OperatorType.TextNotContain, OperatorType.TextStartsWith, OperatorType.TextEndsWith, OperatorType.TextEqual, OperatorType.TextNotEqual, OperatorType.TextMatch, OperatorType.TextNotMatch];

var DATE_OPERATORS = [OperatorType.DateEqual, OperatorType.DateAfter, OperatorType.DateBefore, OperatorType.DateNotEqual, OperatorType.Empty, OperatorType.NotEmpty, OperatorType.In, OperatorType.NotIn];

var NUMERIC_OPERATORS = [OperatorType.Equal, OperatorType.NotEqual, OperatorType.GreaterThan, OperatorType.GreaterThanOrEqual, OperatorType.LessThan, OperatorType.LessThanOrEqual, OperatorType.Between, OperatorType.NotBetween, OperatorType.Empty, OperatorType.NotEmpty, OperatorType.In, OperatorType.NotIn];

var ARRAY_OPERATORS = [OperatorType.ArrayAnyOf, OperatorType.ArrayAllOf, OperatorType.ArrayEqual, OperatorType.Empty, OperatorType.NotEmpty];

var GEOSPATIAL_OPERATORS = [];

var MEDIA_OPERATORS = [OperatorType.Empty, OperatorType.NotEmpty];

var SYSTEM_COLUMNS = {
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
  _edited_duration: NUMERIC_OPERATORS
};

function isValueRequired(operator) {
  return operator !== OperatorType.Empty.name && operator !== OperatorType.NotEmpty.name;
}

function availableOperatorsForColumn(column) {
  var operators = [];

  if (column == null) {
    return operators;
  }

  if (SYSTEM_COLUMNS[column.id]) {
    return SYSTEM_COLUMNS[column.id];
  }

  var element = column && column.element;

  if (element) {
    if (element.isTextElement) {
      if (element.isNumeric) {
        operators.push.apply(operators, NUMERIC_OPERATORS);
      } else {
        operators.push.apply(operators, TEXTUAL_OPERATORS);
      }
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

    if (element.isClassificationElement) {
      operators.push.apply(operators, TEXTUAL_OPERATORS);
    }

    if (element.isStatusElement) {
      operators.push.apply(operators, TEXTUAL_OPERATORS);
    }

    if (element.isPhotoElement || element.isVideoElement || element.isAudioElement || element.isSignatureElement) {
      operators.push.apply(operators, MEDIA_OPERATORS);
    }
  }

  return operators;
}
//# sourceMappingURL=operator.js.map