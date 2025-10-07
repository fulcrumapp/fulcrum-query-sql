import moment from 'moment';
import {
  OperatorType,
  isValueRequired,
  isDateOperator,
  availableOperatorsForColumn,
  operatorsForDataType,
  dateRangeForOperator,
  OperatorsByValue
} from '../operator';
import { Form } from 'fulcrum-core';
import FormSchema from '../form-schema';

describe('Operator', () => {
  describe('OperatorType', () => {
    it('defines basic comparison operators', () => {
      expect(OperatorType.Equal.name).toBe('equal');
      expect(OperatorType.Equal.label).toBe('Equals');
      
      expect(OperatorType.NotEqual.name).toBe('not_equal');
      expect(OperatorType.NotEqual.label).toBe('Does not equal');
      
      expect(OperatorType.GreaterThan.name).toBe('greater_than');
      expect(OperatorType.GreaterThan.label).toBe('Greater than');
    });

    it('defines empty/not empty operators', () => {
      expect(OperatorType.Empty.name).toBe('is_empty');
      expect(OperatorType.Empty.label).toBe('Is blank');
      
      expect(OperatorType.NotEmpty.name).toBe('is_not_empty');
      expect(OperatorType.NotEmpty.label).toBe('Is not blank');
    });

    it('defines text operators', () => {
      expect(OperatorType.TextContains.name).toBe('contains');
      expect(OperatorType.TextContains.label).toBe('Contains');
      
      expect(OperatorType.TextStartsWith.name).toBe('starts_with');
      expect(OperatorType.TextStartsWith.label).toBe('Starts with');
    });

    it('defines date operators', () => {
      expect(OperatorType.DateToday.name).toBe('date_today');
      expect(OperatorType.DateToday.label).toBe('Today');
      
      expect(OperatorType.DateThisWeek.name).toBe('date_current_calendar_week');
      expect(OperatorType.DateThisWeek.label).toBe('This Week');
    });

    it('defines array operators', () => {
      expect(OperatorType.ArrayAnyOf.name).toBe('array_any_of');
      expect(OperatorType.ArrayAnyOf.label).toBe('Any of');
      
      expect(OperatorType.ArrayAllOf.name).toBe('array_all_of');
      expect(OperatorType.ArrayAllOf.label).toBe('All of');
    });
  });

  describe('isValueRequired', () => {
    it('returns false for operators that do not require values', () => {
      expect(isValueRequired('is_empty')).toBe(false);
      expect(isValueRequired('is_not_empty')).toBe(false);
      expect(isValueRequired('date_today')).toBe(false);
      expect(isValueRequired('date_current_calendar_week')).toBe(false);
    });

    it('returns true for operators that require values', () => {
      expect(isValueRequired('equal')).toBe(true);
      expect(isValueRequired('not_equal')).toBe(true);
      expect(isValueRequired('contains')).toBe(true);
      expect(isValueRequired('greater_than')).toBe(true);
      expect(isValueRequired('between')).toBe(true);
    });

    it('returns true for date operators with relative values', () => {
      expect(isValueRequired('date_days_ago')).toBe(true);
      expect(isValueRequired('date_weeks_from_now')).toBe(true);
      expect(isValueRequired('date_between')).toBe(true);
    });
  });

  describe('isDateOperator', () => {
    it('returns true for date operators', () => {
      expect(isDateOperator('date_today')).toBe(true);
      expect(isDateOperator('date_current_calendar_week')).toBe(true);
      expect(isDateOperator('date_between')).toBe(true);
      expect(isDateOperator('date_days_ago')).toBe(true);
    });

    it('returns false for non-date operators', () => {
      expect(isDateOperator('equal')).toBe(false);
      expect(isDateOperator('contains')).toBe(false);
      expect(isDateOperator('is_empty')).toBe(false);
      expect(isDateOperator('array_any_of')).toBe(false);
    });
  });

  describe('operatorsForDataType', () => {
    it('returns appropriate operators for string type', () => {
      const operators = operatorsForDataType('string');
      
      expect(operators).toContain(OperatorType.Equal);
      expect(operators).toContain(OperatorType.NotEqual);
      expect(operators).toContain(OperatorType.TextContains);
      expect(operators).toContain(OperatorType.TextStartsWith);
      expect(operators).toContain(OperatorType.Empty);
      expect(operators).toContain(OperatorType.NotEmpty);
    });

    it('returns appropriate operators for number type', () => {
      const operators = operatorsForDataType('double');
      
      expect(operators).toContain(OperatorType.Equal);
      expect(operators).toContain(OperatorType.NotEqual);
      expect(operators).toContain(OperatorType.GreaterThan);
      expect(operators).toContain(OperatorType.LessThan);
      expect(operators).toContain(OperatorType.Between);
      expect(operators).toContain(OperatorType.Empty);
      expect(operators).toContain(OperatorType.NotEmpty);
    });

    it('returns appropriate operators for date type', () => {
      const operators = operatorsForDataType('date');
      
      expect(operators).toContain(OperatorType.DateToday);
      expect(operators).toContain(OperatorType.DateThisWeek);
      expect(operators).toContain(OperatorType.DateBetween);
      expect(operators).toContain(OperatorType.DateDaysAgo);
      expect(operators).toContain(OperatorType.Empty);
      expect(operators).toContain(OperatorType.NotEmpty);
    });

    it('returns appropriate operators for array type', () => {
      const operators = operatorsForDataType('array');
      
      expect(operators).toContain(OperatorType.ArrayAnyOf);
      expect(operators).toContain(OperatorType.ArrayAllOf);
      expect(operators).toContain(OperatorType.Empty);
      expect(operators).toContain(OperatorType.NotEmpty);
    });
  });

  describe('availableOperatorsForColumn', () => {
    let schema;

    beforeEach(() => {
      const formJson = {
        id: '7a62278f-4eb8-480c-8f0c-34fc79d28bee',
        name: 'TestForm',
        status_field: {
          type: 'StatusField',
          label: 'Status',
          data_name: 'status',
        },
        elements: [
          {
            type: 'TextField',
            key: '3bd0',
            label: 'Text Field',
            data_name: 'text',
          },
          {
            type: 'NumberField',
            key: '4cd1',
            label: 'Number Field',
            data_name: 'number',
          },
        ],
      };

      const rawColumns = {
        form: [
          {
            field: '3bd0',
            name: 'text',
            type: 'string',
          },
          {
            field: '4cd1',
            name: 'number',
            type: 'double',
          },
        ],
        repeatables: {},
      };

      const form = new Form(formJson);
      schema = new FormSchema(form, rawColumns.form, rawColumns.repeatables, { fullSchema: true });
    });

    it('returns operators for a text column', () => {
      const textColumn = schema.columnsByKey['3bd0'];
      const operators = availableOperatorsForColumn(textColumn);
      
      expect(operators.length).toBeGreaterThan(0);
      expect(operators.some(op => op.name === 'equal')).toBe(true);
      expect(operators.some(op => op.name === 'contains')).toBe(true);
    });

    it('returns operators for a number column', () => {
      const numberColumn = schema.columnsByKey['4cd1'];
      const operators = availableOperatorsForColumn(numberColumn);
      
      expect(operators.length).toBeGreaterThan(0);
      expect(operators.some(op => op.name === 'equal')).toBe(true);
      expect(operators.some(op => op.name === 'greater_than')).toBe(true);
    });
  });

  describe('dateRangeForOperator', () => {
    const mockDate = moment('2023-06-15T12:00:00Z');

    beforeEach(() => {
      // Mock moment to return consistent dates for testing
      jest.spyOn(moment, 'tz').mockReturnValue(mockDate);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('returns correct range for date_today', () => {
      const range = dateRangeForOperator('date_today', null, 'UTC');
      
      expect(range).toBeDefined();
      expect(range.start).toBeDefined();
      expect(range.end).toBeDefined();
    });

    it('returns correct range for date_days_ago with value', () => {
      const range = dateRangeForOperator('date_days_ago', '5', 'UTC');
      
      expect(range).toBeDefined();
      expect(range.start).toBeDefined();
      expect(range.end).toBeDefined();
    });

    it('returns correct range for date_between with date values', () => {
      const startDate = '2023-06-01';
      const endDate = '2023-06-30';
      const range = dateRangeForOperator('date_between', [startDate, endDate], 'UTC');
      
      expect(range).toBeDefined();
      expect(range.start).toBeDefined();
      expect(range.end).toBeDefined();
    });

    it('returns null for non-date operators', () => {
      const range = dateRangeForOperator('equal', 'some_value', 'UTC');
      
      expect(range).toBeNull();
    });

    it('returns null for date operators requiring value when no value provided', () => {
      const range = dateRangeForOperator('date_days_ago', null, 'UTC');
      
      expect(range).toBeNull();
    });
  });

  describe('OperatorsByValue', () => {
    it('contains all operator types indexed by name', () => {
      expect(OperatorsByValue.equal).toBe(OperatorType.Equal);
      expect(OperatorsByValue.not_equal).toBe(OperatorType.NotEqual);
      expect(OperatorsByValue.is_empty).toBe(OperatorType.Empty);
      expect(OperatorsByValue.contains).toBe(OperatorType.TextContains);
      expect(OperatorsByValue.date_today).toBe(OperatorType.DateToday);
    });
  });
});