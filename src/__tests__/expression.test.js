import Expression from '../expression.js';
import { OperatorType } from '../operator.js';

const makeColumn = (id, attrs = {}) => ({
  id,
  columnName: id,
  isSQL: true,
  isArray: false,
  isDate: false,
  isNumber: false,
  ...attrs,
});

const makeSchema = (...columns) => ({
  columnForFieldKey: (field) => columns.find((column) => column.id === field) || null,
});

describe('Expression', () => {
  describe('scalarValue', () => {
    it.each([0, false, ''])('preserves falsy scalar value %p', (value) => {
      const expression = new Expression({}, makeSchema());

      expression.scalarValue = value;

      expect(expression.value).toEqual([value]);
      expect(expression.scalarValue).toBe(value);
    });

    it.each([null, undefined])('clears nullish scalar value %p', (value) => {
      const expression = new Expression({}, makeSchema());

      expression.scalarValue = value;

      expect(expression.value).toBeNull();
    });
  });

  describe('column setter', () => {
    it('clears an operator that is not available for the new column', () => {
      const textColumn = makeColumn('text');
      const numberColumn = makeColumn('number', { isNumber: true });
      const expression = new Expression({
        field: textColumn.id,
        operator: OperatorType.TextContain.name,
        value: ['alpha'],
      }, makeSchema(textColumn, numberColumn));

      expression.column = numberColumn;

      expect(expression.field).toBe(numberColumn.id);
      expect(expression.operator).toBeNull();
    });

    it('keeps an operator that is available for the new column', () => {
      const textColumn = makeColumn('text');
      const otherTextColumn = makeColumn('other_text');
      const expression = new Expression({
        field: textColumn.id,
        operator: OperatorType.TextContain.name,
        value: ['alpha'],
      }, makeSchema(textColumn, otherTextColumn));

      expression.column = otherTextColumn;

      expect(expression.field).toBe(otherTextColumn.id);
      expect(expression.operator).toBe(OperatorType.TextContain.name);
    });
  });
});