import { Form } from 'fulcrum-core';
import { Condition, ConditionType } from '../condition';
import { Expression } from '../expression';
import FormSchema from '../form-schema';

describe('Condition', () => {
  let form;
  let schema;
  let rawColumns;

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

    rawColumns = [
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
    ];

    form = new Form(formJson);
    schema = new FormSchema(form, rawColumns, {}, { fullSchema: true });
  });

  describe('ConditionType', () => {
    it('defines condition types', () => {
      expect(ConditionType.And).toBe('and');
      expect(ConditionType.Or).toBe('or');
      expect(ConditionType.Not).toBe('not');
    });
  });

  describe('constructor', () => {
    it('creates a condition with default AND type', () => {
      const condition = new Condition({}, schema);
      
      expect(condition.type).toBe(ConditionType.And);
      expect(condition.expressions).toBeDefined();
      expect(Array.isArray(condition.expressions)).toBe(true);
    });

    it('creates a condition with specified type', () => {
      const condition = new Condition({ type: ConditionType.Or }, schema);
      
      expect(condition.type).toBe(ConditionType.Or);
    });

    it('creates a condition with expressions', () => {
      const attrs = {
        type: ConditionType.And,
        expressions: [
          { field: '3bd0', operator: 'equal', value: ['test'] },
          { field: '4cd1', operator: 'greater_than', value: [10] },
        ],
      };
      
      const condition = new Condition(attrs, schema);
      
      expect(condition.expressions).toHaveLength(3); // 2 expressions + 1 empty
      expect(condition.expressions[0]).toBeInstanceOf(Expression);
      expect(condition.expressions[1]).toBeInstanceOf(Expression);
    });

    it('creates nested conditions from nested expressions', () => {
      const attrs = {
        type: ConditionType.And,
        expressions: [
          { field: '3bd0', operator: 'equal', value: ['test'] },
          {
            type: ConditionType.Or,
            expressions: [
              { field: '4cd1', operator: 'greater_than', value: [10] },
            ],
          },
        ],
      };
      
      const condition = new Condition(attrs, schema);
      
      expect(condition.expressions).toHaveLength(3); // 1 expression + 1 nested condition + 1 empty
      expect(condition.expressions[0]).toBeInstanceOf(Expression);
      expect(condition.expressions[1]).toBeInstanceOf(Condition);
    });

    it('filters out null expressions', () => {
      const attrs = {
        expressions: [
          { field: '3bd0', operator: 'equal', value: ['test'] },
          null,
          undefined,
          { field: '4cd1', operator: 'greater_than', value: [10] },
        ],
      };
      
      const condition = new Condition(attrs, schema);
      
      // Should have 2 valid expressions + 1 empty
      expect(condition.expressions).toHaveLength(3);
      expect(condition.expressions.filter(expr => expr instanceof Expression)).toHaveLength(2);
    });
  });

  describe('type property', () => {
    it('gets and sets type correctly', () => {
      const condition = new Condition({}, schema);
      
      expect(condition.type).toBe(ConditionType.And);
      
      condition.type = ConditionType.Or;
      expect(condition.type).toBe(ConditionType.Or);
      
      condition.type = ConditionType.Not;
      expect(condition.type).toBe(ConditionType.Not);
    });
  });

  describe('addEmptyCondition', () => {
    it('adds a new empty nested condition', () => {
      const condition = new Condition({}, schema);
      const initialLength = condition.expressions.length;
      
      condition.addEmptyCondition();
      
      expect(condition.expressions).toHaveLength(initialLength + 1);
      const newCondition = condition.expressions[condition.expressions.length - 1];
      expect(newCondition).toBeInstanceOf(Condition);
      expect(newCondition.expressions).toHaveLength(1); // Should have one empty expression
    });
  });

  describe('ensureEmptyExpression', () => {
    it('ensures there is always an empty expression', () => {
      const condition = new Condition({}, schema);
      
      // Should have at least one expression (the empty one)
      expect(condition.expressions.length).toBeGreaterThan(0);
      
      // The last expression should be empty/invalid
      const lastExpression = condition.expressions[condition.expressions.length - 1];
      expect(lastExpression).toBeInstanceOf(Expression);
      expect(lastExpression.isValid).toBe(false);
    });

    it('does not add another empty expression if one exists', () => {
      const condition = new Condition({}, schema);
      const initialLength = condition.expressions.length;
      
      // Call ensureEmptyExpression again
      condition.ensureEmptyExpression();
      
      // Length should remain the same
      expect(condition.expressions).toHaveLength(initialLength);
    });
  });

  describe('expressions management', () => {
    it('manages expressions array correctly', () => {
      const condition = new Condition({}, schema);
      
      expect(Array.isArray(condition.expressions)).toBe(true);
      expect(condition.expressions.length).toBeGreaterThanOrEqual(1);
    });

    it('contains expressions of correct type', () => {
      const attrs = {
        expressions: [
          { field: '3bd0', operator: 'equal', value: ['test'] },
          { field: '4cd1', operator: 'greater_than', value: [10] },
        ],
      };
      
      const condition = new Condition(attrs, schema);
      
      // Should have valid expressions plus the empty one
      const validExpressions = condition.expressions.filter(expr => expr.isValid);
      expect(validExpressions).toHaveLength(2);
      
      validExpressions.forEach(expr => {
        expect(expr).toBeInstanceOf(Expression);
        expect(expr.isValid).toBe(true);
      });
    });
  });

  describe('nested conditions', () => {
    it('handles deeply nested conditions', () => {
      const attrs = {
        type: ConditionType.And,
        expressions: [
          { field: '3bd0', operator: 'equal', value: ['test'] },
          {
            type: ConditionType.Or,
            expressions: [
              { field: '4cd1', operator: 'greater_than', value: [10] },
              {
                type: ConditionType.And,
                expressions: [
                  { field: '3bd0', operator: 'contains', value: ['nested'] },
                ],
              },
            ],
          },
        ],
      };
      
      const condition = new Condition(attrs, schema);
      
      expect(condition.type).toBe(ConditionType.And);
      expect(condition.expressions[1]).toBeInstanceOf(Condition);
      
      const nestedCondition = condition.expressions[1];
      expect(nestedCondition.type).toBe(ConditionType.Or);
      expect(nestedCondition.expressions[1]).toBeInstanceOf(Condition);
    });
  });
});