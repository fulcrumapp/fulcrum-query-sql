'use strict';

exports.__esModule = true;
exports.DateRange = exports.DEFAULT_RANGE_TYPE = exports.FRIENDLY_DATE_RANGE_TYPES = exports.DATE_RANGE_TYPES = exports.CUSTOM = exports.DAYS_AGO = exports.DAYS_FROM_NOW = exports.NEXT_CALENDAR_YEAR = exports.PREVIOUS_CALENDAR_YEAR = exports.CURRENT_CALENDAR_YEAR = exports.NEXT_CALENDAR_MONTH = exports.PREVIOUS_CALENDAR_MONTH = exports.CURRENT_CALENDAR_MONTH = exports.NEXT_CALENDAR_WEEK = exports.PREVIOUS_CALENDAR_WEEK = exports.CURRENT_CALENDAR_WEEK = exports.NEXT_YEAR = exports.NEXT_MONTH = exports.NEXT_WEEK = exports.LAST_YEAR = exports.LAST_MONTH = exports.LAST_WEEK = exports.TOMORROW = exports.YESTERDAY = exports.TODAY = exports.ALL_TIME = exports.DEFAULT_DATE_FIELD = exports.DATE_FIELDS = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DATE_FIELDS = exports.DATE_FIELDS = [{ label: 'Updated (Server)', value: '_server_updated_at' }, { label: 'Created (Server)', value: '_server_created_at' }, { label: 'Updated (Device)', value: '_updated_at' }, { label: 'Created (Device)', value: '_created_at' }];

var DEFAULT_DATE_FIELD = exports.DEFAULT_DATE_FIELD = DATE_FIELDS[0];

var ALL_TIME = exports.ALL_TIME = { label: 'All Time', value: 'all' };
var TODAY = exports.TODAY = { label: 'Today', value: 'today' };
var YESTERDAY = exports.YESTERDAY = { label: 'Yesterday', value: 'yesterday' };
var TOMORROW = exports.TOMORROW = { label: 'Tomorrow', value: 'tomorrow' };
var LAST_WEEK = exports.LAST_WEEK = { label: '1 week ago', value: 'last_week' };
var LAST_MONTH = exports.LAST_MONTH = { label: '1 month ago', value: 'last_month' };
var LAST_YEAR = exports.LAST_YEAR = { label: '1 year ago', value: 'last_year' };
var NEXT_WEEK = exports.NEXT_WEEK = { label: '1 week from now', value: 'next_week' };
var NEXT_MONTH = exports.NEXT_MONTH = { label: '1 month from now', value: 'next_month' };
var NEXT_YEAR = exports.NEXT_YEAR = { label: '1 year from now', value: 'next_year' };
var CURRENT_CALENDAR_WEEK = exports.CURRENT_CALENDAR_WEEK = { label: 'This week', value: 'current_calendar_week' };
var PREVIOUS_CALENDAR_WEEK = exports.PREVIOUS_CALENDAR_WEEK = { label: 'Last week', value: 'previous_calendar_week' };
var NEXT_CALENDAR_WEEK = exports.NEXT_CALENDAR_WEEK = { label: 'Next week', value: 'next_calendar_week' };
var CURRENT_CALENDAR_MONTH = exports.CURRENT_CALENDAR_MONTH = { label: 'This month', value: 'current_calendar_month' };
var PREVIOUS_CALENDAR_MONTH = exports.PREVIOUS_CALENDAR_MONTH = { label: 'Last month', value: 'previous_calendar_month' };
var NEXT_CALENDAR_MONTH = exports.NEXT_CALENDAR_MONTH = { label: 'Next month', value: 'next_calendar_month' };
var CURRENT_CALENDAR_YEAR = exports.CURRENT_CALENDAR_YEAR = { label: 'This year', value: 'current_calendar_year' };
var PREVIOUS_CALENDAR_YEAR = exports.PREVIOUS_CALENDAR_YEAR = { label: 'Last year', value: 'previous_calendar_year' };
var NEXT_CALENDAR_YEAR = exports.NEXT_CALENDAR_YEAR = { label: 'Next year', value: 'next_calendar_year' };
var DAYS_FROM_NOW = exports.DAYS_FROM_NOW = { label: 'Number of days from now', value: 'days_from_now' };
var DAYS_AGO = exports.DAYS_AGO = { label: 'Number of days ago', value: 'days_ago' };
var CUSTOM = exports.CUSTOM = { label: 'Custom', value: 'custom' };

var DATE_RANGE_TYPES = exports.DATE_RANGE_TYPES = [ALL_TIME, TODAY, YESTERDAY, TOMORROW, LAST_WEEK, LAST_MONTH, LAST_YEAR, NEXT_WEEK, NEXT_MONTH, NEXT_YEAR, CURRENT_CALENDAR_WEEK, PREVIOUS_CALENDAR_WEEK, NEXT_CALENDAR_WEEK, CURRENT_CALENDAR_MONTH, PREVIOUS_CALENDAR_MONTH, NEXT_CALENDAR_MONTH, CURRENT_CALENDAR_YEAR, PREVIOUS_CALENDAR_YEAR, NEXT_CALENDAR_YEAR, DAYS_FROM_NOW, DAYS_AGO, CUSTOM];

var FRIENDLY_DATE_RANGE_TYPES = exports.FRIENDLY_DATE_RANGE_TYPES = [ALL_TIME, TODAY, YESTERDAY, TOMORROW, LAST_WEEK, LAST_MONTH, LAST_YEAR, NEXT_WEEK, NEXT_MONTH, NEXT_YEAR, CURRENT_CALENDAR_WEEK, PREVIOUS_CALENDAR_WEEK, NEXT_CALENDAR_WEEK, CURRENT_CALENDAR_MONTH, PREVIOUS_CALENDAR_MONTH, NEXT_CALENDAR_MONTH, CURRENT_CALENDAR_YEAR, PREVIOUS_CALENDAR_YEAR, NEXT_CALENDAR_YEAR, DAYS_FROM_NOW, DAYS_AGO, CUSTOM];

var DEFAULT_RANGE_TYPE = exports.DEFAULT_RANGE_TYPE = ALL_TIME;

var DateRange = exports.DateRange = function () {
  function DateRange() {
    _classCallCheck(this, DateRange);

    this._field = DEFAULT_DATE_FIELD.value;
    this._type = DEFAULT_RANGE_TYPE.value;
    this._value = null;
  }

  DateRange.prototype.toJSON = function toJSON() {
    return {
      field: this.field,
      type: this.type,
      value: this.value
    };
  };

  DateRange.resolve = function resolve(type, value, today) {
    today = (0, _moment2.default)(today || new Date()).startOf('day');

    var range = function range(start, end) {
      return [start, (end || start).endOf('day')];
    };

    var today2 = today.clone();

    switch (type) {
      case ALL_TIME.value:
        return null;

      case TODAY.value:
        console.log('TODAY!');
        return range(today);

      case YESTERDAY.value:
        return range(today.subtract(1, 'days'));

      case TOMORROW.value:
        return range(today.add(1, 'days'));

      case LAST_WEEK.value:
        return range(today.subtract(1, 'week'), today2);

      case LAST_MONTH.value:
        return range(today.subtract(1, 'month'), today2);

      case LAST_YEAR.value:
        return range(today.subtract(1, 'year'), today2);

      case NEXT_WEEK.value:
        return range(today2, today.add(1, 'week'));

      case NEXT_MONTH.value:
        return range(today2, today.add(1, 'month'));

      case NEXT_YEAR.value:
        return range(today2, today.add(1, 'year'));

      case CURRENT_CALENDAR_WEEK.value:
        return range(today.startOf('week'), today2.endOf('week'));

      case PREVIOUS_CALENDAR_WEEK.value:
        return range(today.subtract(1, 'week').startOf('week'), today2.subtract(1, 'week').endOf('week'));

      case NEXT_CALENDAR_WEEK.value:
        return range(today.add(1, 'week').startOf('week'), today2.add(1, 'week').endOf('week'));

      case CURRENT_CALENDAR_MONTH.value:
        return range(today.startOf('month'), today2.endOf('month'));

      case PREVIOUS_CALENDAR_MONTH.value:
        return range(today.subtract(1, 'month').startOf('month'), today2.subtract(1, 'month').endOf('month'));

      case NEXT_CALENDAR_MONTH.value:
        return range(today.add(1, 'month').startOf('month'), today2.add(1, 'month').endOf('month'));

      case CURRENT_CALENDAR_YEAR.value:
        return range(today.startOf('year'), today2.endOf('year'));

      case PREVIOUS_CALENDAR_YEAR.value:
        return range(today.subtract(1, 'year').startOf('year'), today2.subtract(1, 'year').endOf('year'));

      case NEXT_CALENDAR_YEAR.value:
        return range(today.add(1, 'year').startOf('year'), today2.add(1, 'year').endOf('year'));

      case DAYS_FROM_NOW.value:
        return value && range(today, today2.add(+value, 'days'));

      case DAYS_AGO.value:
        return value && range(today.subtract(+value, 'days'), today2);

      case CUSTOM.value:
        return value && range((0, _moment2.default)(value[0]), (0, _moment2.default)(value[1]));

      default:
        return null;
    }
  };

  _createClass(DateRange, [{
    key: 'isAll',
    get: function get() {
      return this._field === ALL_TIME.value;
    }
  }, {
    key: 'field',
    set: function set(field) {
      this._field = field;
    },
    get: function get() {
      return this._field;
    }
  }, {
    key: 'type',
    set: function set(type) {
      this._type = type;
    },
    get: function get() {
      return this._type;
    }
  }, {
    key: 'value',
    set: function set(value) {
      this._value = value;
    },
    get: function get() {
      return this._value;
    }
  }]);

  return DateRange;
}();
//# sourceMappingURL=date-range.js.map