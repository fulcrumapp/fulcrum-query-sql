import { Form } from 'fulcrum-core';
import { Expression } from '../expression';
import FormSchema from '../form-schema';

describe('Expression', () => {
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
        {
          type: 'DateField',
          key: '5de2',
          label: 'Date Field',
          data_name: 'date',
        },
      ],
    };

    rawColumns = {
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
        {
          field: '5de2',
          name: 'date',
          type: 'date',
        },
      ],
      repeatables: {},
    };

    form = new Form(formJson);
    schema = new FormSchema(form, rawColumns.form, rawColumns.repeatables, { fullSchema: true });
  });

  describe('constructor', () => {
    it('creates an empty expression with default values', () => {
      const expression = new Expression({}, schema);
      
      expect(expression.field).toBeNull();
      expect(expression.operator).toBeNull();
      expect(expression.value).toBeNull();
    });

    it('creates an expression with provided attributes', () => {
      const attrs = {
        field: '3bd0',
        operator: 'equal',
        value: ['test'],
      };
      
      const expression = new Expression(attrs, schema);
      
      expect(expression.field).toBe('3bd0');
      expect(expression.operator).toBe('equal');
      expect(expression.value).toEqual(['test']);
    });
  });

  describe('isValid', () => {
    it('returns false when field is null', () => {
      const expression = new Expression({
        operator: 'equal',
        value: ['test'],
      }, schema);
      
      expect(expression.isValid).toBe(false);
    });

    it('returns false when operator is null', () => {
      const expression = new Expression({
        field: '3bd0',
        value: ['test'],
      }, schema);
      
      expect(expression.isValid).toBe(false);
    });

    it('returns true for operators that do not require values', () => {
      const expression = new Expression({
        field: '3bd0',
        operator: 'is_empty',
      }, schema);
      
      expect(expression.isValid).toBe(true);
    });

    it('returns false when value is required but not provided', () => {
      const expression = new Expression({
        field: '3bd0',
        operator: 'equal',
      }, schema);
      
      expect(expression.isValid).toBe(false);
    });

    it('returns true when all required fields are provided', () => {
      const expression = new Expression({
        field: '3bd0',
        operator: 'equal',
        value: ['test'],
      }, schema);
      
      expect(expression.isValid).toBe(true);
    });
  });

  describe('hasValue', () => {
    it('returns false when value is null', () => {
      const expression = new Expression({
        field: '3bd0',
        operator: 'equal',
      }, schema);
      
      expect(expression.hasValue).toBe(false);
    });

    it('returns false when value is empty array', () => {
      const expression = new Expression({
        field: '3bd0',
        operator: 'equal',
        value: [],
      }, schema);
      
      expect(expression.hasValue).toBe(false);
    });

    it('returns true when value has content', () => {
      const expression = new Expression({
        field: '3bd0',
        operator: 'equal',
        value: ['test'],
      }, schema);
      
      expect(expression.hasValue).toBe(true);
    });
  });

  describe('arrayValue', () => {
    it('returns null when no value is present', () => {
      const expression = new Expression({
        field: '3bd0',
        operator: 'equal',
      }, schema);
      
      expect(expression.arrayValue).toBeNull();
    });

    it('returns the array value when value is a simple array', () => {
      const expression = new Expression({
        field: '3bd0',
        operator: 'equal',
        value: ['test1', 'test2'],
      }, schema);
      
      expect(expression.arrayValue).toEqual(['test1', 'test2']);
    });

    it('returns the nested array when value contains nested arrays', () => {
      const expression = new Expression({
        field: '3bd0',
        operator: 'equal',
        value: [['nested1', 'nested2']],
      }, schema);
      
      expect(expression.arrayValue).toEqual(['nested1', 'nested2']);
    });
  });

  describe('scalarValue', () => {
    it('returns null when no value is present', () => {
      const expression = new Expression({
        field: '3bd0',
        operator: 'equal',
      }, schema);
      
      expect(expression.scalarValue).toBeNull();
    });

    it('returns the first value from the array', () => {
      const expression = new Expression({
        field: '3bd0',
        operator: 'equal',
        value: ['first', 'second'],
      }, schema);
      
      expect(expression.scalarValue).toBe('first');
    });
  });

  describe('supportsValue', () => {
    it('returns false for operators that do not require values', () => {
      const expression = new Expression({
        field: '3bd0',
        operator: 'is_empty',
      }, schema);
      
      expect(expression.supportsValue).toBe(false);
    });

    it('returns true for operators that require values', () => {
      const expression = new Expression({
        field: '3bd0',
        operator: 'equal',
      }, schema);
      
      expect(expression.supportsValue).toBe(true);
    });
  });
});