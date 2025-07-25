import { Form } from 'fulcrum-core';
import ColumnFilter from '../column-filter';
import FormSchema from '../form-schema';

describe('ColumnFilter', () => {
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
      ],
    };

    rawColumns = [
      {
        field: '3bd0',
        name: 'text',
        type: 'string',
      },
    ];

    form = new Form(formJson);
    schema = new FormSchema(form, rawColumns, {}, { fullSchema: true });
  });

  describe('constructor', () => {
    it('creates a column filter with basic attributes', () => {
      const attrs = {
        field: '3bd0',
        value: ['test1', 'test2'],
      };
      
      const filter = new ColumnFilter(attrs, schema);
      
      expect(filter.field).toBe('3bd0');
      expect(filter.value).toEqual(['test1', 'test2']);
    });

    it('creates a column filter with null value by default', () => {
      const attrs = {
        field: '3bd0',
      };
      
      const filter = new ColumnFilter(attrs, schema);
      
      expect(filter.field).toBe('3bd0');
      expect(filter.value).toBeNull();
    });
  });

  describe('isNull', () => {
    it('returns true when value is null', () => {
      const filter = new ColumnFilter({ field: '3bd0' }, schema);
      
      expect(filter.isNull).toBe(true);
    });

    it('returns false when value is not null', () => {
      const filter = new ColumnFilter({ field: '3bd0', value: ['test'] }, schema);
      
      expect(filter.isNull).toBe(false);
    });

    it('returns true when value is undefined', () => {
      const filter = new ColumnFilter({ field: '3bd0', value: undefined }, schema);
      
      expect(filter.isNull).toBe(true);
    });
  });

  describe('hasFilter', () => {
    it('returns false when value is null', () => {
      const filter = new ColumnFilter({ field: '3bd0' }, schema);
      
      expect(filter.hasFilter).toBe(false);
    });

    it('returns true when value is not null', () => {
      const filter = new ColumnFilter({ field: '3bd0', value: ['test'] }, schema);
      
      expect(filter.hasFilter).toBe(true);
    });

    it('returns true when value is empty array', () => {
      const filter = new ColumnFilter({ field: '3bd0', value: [] }, schema);
      
      expect(filter.hasFilter).toBe(true);
    });
  });

  describe('hasValues', () => {
    it('returns false when value is null', () => {
      const filter = new ColumnFilter({ field: '3bd0' }, schema);
      
      expect(filter.hasValues).toBe(false);
    });

    it('returns false when value is empty array', () => {
      const filter = new ColumnFilter({ field: '3bd0', value: [] }, schema);
      
      expect(filter.hasValues).toBe(false);
    });

    it('returns true when value has content', () => {
      const filter = new ColumnFilter({ field: '3bd0', value: ['test'] }, schema);
      
      expect(filter.hasValues).toBe(true);
    });
  });

  describe('isEmptySet', () => {
    it('returns false when value is null', () => {
      const filter = new ColumnFilter({ field: '3bd0' }, schema);
      
      expect(filter.isEmptySet).toBe(false);
    });

    it('returns true when value is empty array', () => {
      const filter = new ColumnFilter({ field: '3bd0', value: [] }, schema);
      
      expect(filter.isEmptySet).toBe(true);
    });

    it('returns false when value has content', () => {
      const filter = new ColumnFilter({ field: '3bd0', value: ['test'] }, schema);
      
      expect(filter.isEmptySet).toBe(false);
    });
  });

  describe('column and columnName', () => {
    it('returns correct column for valid field', () => {
      const filter = new ColumnFilter({ field: '3bd0' }, schema);
      
      expect(filter.column).toBeDefined();
      expect(filter.column.key).toBe('3bd0');
      expect(filter.columnName).toBe('text');
    });

    it('returns null for invalid field', () => {
      const filter = new ColumnFilter({ field: 'non_existent' }, schema);
      
      expect(filter.column).toBeNull();
      expect(filter.columnName).toBeNull();
    });
  });

  describe('reset', () => {
    it('resets value to null', () => {
      const filter = new ColumnFilter({ field: '3bd0', value: ['test'] }, schema);
      
      expect(filter.value).toEqual(['test']);
      expect(filter.hasFilter).toBe(true);
      
      filter.reset();
      
      expect(filter.value).toBeNull();
      expect(filter.hasFilter).toBe(false);
    });
  });

  describe('field property', () => {
    it('returns the field value', () => {
      const filter = new ColumnFilter({ field: '_status' }, schema);
      
      expect(filter.field).toBe('_status');
    });

    it('handles system fields', () => {
      const statusFilter = new ColumnFilter({ field: '_status', value: ['submitted'] }, schema);
      
      expect(statusFilter.field).toBe('_status');
      expect(statusFilter.hasFilter).toBe(true);
    });
  });
});