import { Form } from 'fulcrum-core';
import ColumnSummary from '../column-summary';
import FormSchema from '../form-schema';

describe('ColumnSummary', () => {
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

  describe('constructor', () => {
    it('creates a column summary with basic attributes', () => {
      const attrs = {
        field: '4cd1',
        aggregate: 'sum',
      };
      
      const summary = new ColumnSummary(attrs, schema);
      
      expect(summary.field).toBe('4cd1');
      expect(summary.aggregate).toBe('sum');
    });

    it('creates a column summary without aggregate', () => {
      const attrs = {
        field: '3bd0',
      };
      
      const summary = new ColumnSummary(attrs, schema);
      
      expect(summary.field).toBe('3bd0');
      expect(summary.aggregate).toBeUndefined();
    });
  });

  describe('field property', () => {
    it('returns the correct field', () => {
      const summary = new ColumnSummary({ field: '3bd0' }, schema);
      
      expect(summary.field).toBe('3bd0');
    });
  });

  describe('column property', () => {
    it('returns the correct column for valid field', () => {
      const summary = new ColumnSummary({ field: '3bd0' }, schema);
      
      expect(summary.column).toBeDefined();
      expect(summary.column.key).toBe('3bd0');
    });

    it('returns null for invalid field', () => {
      const summary = new ColumnSummary({ field: 'non_existent' }, schema);
      
      expect(summary.column).toBeNull();
    });
  });

  describe('columnName property', () => {
    it('returns the correct column name for valid field', () => {
      const summary = new ColumnSummary({ field: '3bd0' }, schema);
      
      expect(summary.columnName).toBe('text');
    });

    it('returns null for invalid field', () => {
      const summary = new ColumnSummary({ field: 'non_existent' }, schema);
      
      expect(summary.columnName).toBeNull();
    });

    it('returns correct column name for number field', () => {
      const summary = new ColumnSummary({ field: '4cd1' }, schema);
      
      expect(summary.columnName).toBe('number');
    });
  });

  describe('aggregate property', () => {
    it('gets and sets aggregate correctly', () => {
      const summary = new ColumnSummary({ field: '4cd1' }, schema);
      
      expect(summary.aggregate).toBeUndefined();
      
      summary.aggregate = 'sum';
      expect(summary.aggregate).toBe('sum');
      
      summary.aggregate = 'average';
      expect(summary.aggregate).toBe('average');
    });

    it('preserves aggregate from constructor', () => {
      const summary = new ColumnSummary({ field: '4cd1', aggregate: 'max' }, schema);
      
      expect(summary.aggregate).toBe('max');
    });
  });

  describe('availableAggregates', () => {
    it('returns available aggregates for text column', () => {
      const summary = new ColumnSummary({ field: '3bd0' }, schema);
      
      const aggregates = summary.availableAggregates();
      
      expect(Array.isArray(aggregates)).toBe(true);
      expect(aggregates.length).toBeGreaterThan(0);
      
      // Text columns should not support mathematical aggregations
      const aggregateNames = aggregates.map(agg => agg.name);
      expect(aggregateNames).not.toContain('sum');
      expect(aggregateNames).not.toContain('average');
      
      // But should support count-based aggregations
      expect(aggregateNames).toContain('empty');
      expect(aggregateNames).toContain('not_empty');
    });

    it('returns available aggregates for number column', () => {
      const summary = new ColumnSummary({ field: '4cd1' }, schema);
      
      const aggregates = summary.availableAggregates();
      
      expect(Array.isArray(aggregates)).toBe(true);
      expect(aggregates.length).toBeGreaterThan(0);
      
      // Number columns should support mathematical aggregations
      const aggregateNames = aggregates.map(agg => agg.name);
      expect(aggregateNames).toContain('sum');
      expect(aggregateNames).toContain('average');
      expect(aggregateNames).toContain('min');
      expect(aggregateNames).toContain('max');
    });

    it('returns empty array for invalid column', () => {
      const summary = new ColumnSummary({ field: 'non_existent' }, schema);
      
      const aggregates = summary.availableAggregates();
      
      expect(Array.isArray(aggregates)).toBe(true);
      expect(aggregates.length).toBe(0);
    });
  });

  describe('integration with different field types', () => {
    it('works with system fields', () => {
      const summary = new ColumnSummary({ field: '_created_at' }, schema);
      
      expect(summary.field).toBe('_created_at');
      // System fields might not have columns in our test schema
      // but the field should still be accessible
    });

    it('handles fields with aggregates properly', () => {
      const attrs = {
        field: '4cd1',
        aggregate: 'sum',
      };
      
      const summary = new ColumnSummary(attrs, schema);
      
      expect(summary.field).toBe('4cd1');
      expect(summary.aggregate).toBe('sum');
      expect(summary.columnName).toBe('number');
      
      const availableAggregates = summary.availableAggregates();
      const hasSum = availableAggregates.some(agg => agg.name === 'sum');
      expect(hasSum).toBe(true);
    });
  });
});