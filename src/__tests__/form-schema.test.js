import { Form } from 'fulcrum-core';
import FormSchema from '../form-schema';

describe('FormSchema', () => {
  let form;
  let rawColumns;
  let repeatableColumns;

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
        {
          type: 'RepeatableField',
          key: '6ef3',
          label: 'Repeatable',
          data_name: 'repeatable_section',
          elements: [
            {
              type: 'TextField',
              key: '7fg4',
              label: 'Nested Text',
              data_name: 'nested_text',
            }
          ]
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
      {
        field: '5de2',
        name: 'date',
        type: 'date',
      },
    ];

    repeatableColumns = {
      '6ef3': [
        {
          field: '7fg4',
          name: 'nested_text',  
          type: 'string',
        }
      ]
    };

    form = new Form(formJson);
  });

  describe('constructor', () => {
    it('creates a form schema with basic configuration', () => {
      const schema = new FormSchema(form, rawColumns, repeatableColumns, { fullSchema: false });
      
      expect(schema.form).toBe(form);
      expect(schema.fullSchema).toBe(false);
    });

    it('creates a full schema when specified', () => {
      const schema = new FormSchema(form, rawColumns, repeatableColumns, { fullSchema: true });
      
      expect(schema.fullSchema).toBe(true);
    });

    it('initializes columns correctly', () => {
      const schema = new FormSchema(form, rawColumns, repeatableColumns, { fullSchema: true });
      
      expect(schema.columns).toBeDefined();
      expect(Array.isArray(schema.columns)).toBe(true);
      expect(schema.columns.length).toBeGreaterThan(0);
    });
  });

  describe('system columns', () => {
    it('includes system columns in full schema', () => {
      const schema = new FormSchema(form, rawColumns, repeatableColumns, { fullSchema: true });
      
      const systemColumnNames = schema.columns.map(col => col.columnName);
      
      expect(systemColumnNames).toContain('_record_id');
      expect(systemColumnNames).toContain('_status');
      expect(systemColumnNames).toContain('_created_at');
      expect(systemColumnNames).toContain('_updated_at');
      expect(systemColumnNames).toContain('_latitude');
      expect(systemColumnNames).toContain('_longitude');
    });

    it('excludes system columns in non-full schema', () => {
      const schema = new FormSchema(form, rawColumns, repeatableColumns, { fullSchema: false });
      
      const systemColumnNames = schema.columns.map(col => col.columnName);
      
      // Should have fewer system columns or none at all
      expect(systemColumnNames.includes('_record_id')).toBe(false);
    });
  });

  describe('form element columns', () => {
    it('creates columns for form elements', () => {
      const schema = new FormSchema(form, rawColumns, repeatableColumns, { fullSchema: true });
      
      const elementColumnNames = schema.columns.map(col => col.columnName);
      
      expect(elementColumnNames).toContain('text');
      expect(elementColumnNames).toContain('number');
      expect(elementColumnNames).toContain('date');
    });

    it('maps columns by key correctly', () => {
      const schema = new FormSchema(form, rawColumns, repeatableColumns, { fullSchema: true });
      
      expect(schema.columnsByKey).toBeDefined();
      expect(schema.columnsByKey['3bd0']).toBeDefined();
      expect(schema.columnsByKey['4cd1']).toBeDefined();
      expect(schema.columnsByKey['5de2']).toBeDefined();
      
      expect(schema.columnsByKey['3bd0'].columnName).toBe('text');
      expect(schema.columnsByKey['4cd1'].columnName).toBe('number');
      expect(schema.columnsByKey['5de2'].columnName).toBe('date');
    });

    it('maps columns by name correctly', () => {
      const schema = new FormSchema(form, rawColumns, repeatableColumns, { fullSchema: true });
      
      expect(schema.columnsByName).toBeDefined();
      expect(schema.columnsByName['text']).toBeDefined();
      expect(schema.columnsByName['number']).toBeDefined();
      expect(schema.columnsByName['date']).toBeDefined();
      
      expect(schema.columnsByName['text'].key).toBe('3bd0');
      expect(schema.columnsByName['number'].key).toBe('4cd1');
      expect(schema.columnsByName['date'].key).toBe('5de2');
    });
  });

  describe('repeatable sections', () => {
    it('creates repeatable schemas for repeatable elements', () => {
      const schema = new FormSchema(form, rawColumns, repeatableColumns, { fullSchema: true });
      
      expect(schema.repeatableSchemas).toBeDefined();
      expect(schema.repeatableSchemas['6ef3']).toBeDefined();
    });

    it('maps repeatable columns correctly', () => {
      const schema = new FormSchema(form, rawColumns, repeatableColumns, { fullSchema: true });
      
      const repeatableSchema = schema.repeatableSchemas['6ef3'];
      expect(repeatableSchema).toBeDefined();
      expect(repeatableSchema.columnsByKey['7fg4']).toBeDefined();
      expect(repeatableSchema.columnsByKey['7fg4'].columnName).toBe('nested_text');
    });
  });

  describe('column lookup', () => {
    it('finds columns by key', () => {
      const schema = new FormSchema(form, rawColumns, repeatableColumns, { fullSchema: true });
      
      const textColumn = schema.columnForKey('3bd0');
      expect(textColumn).toBeDefined();
      expect(textColumn.columnName).toBe('text');
      
      const numberColumn = schema.columnForKey('4cd1');
      expect(numberColumn).toBeDefined();
      expect(numberColumn.columnName).toBe('number');
    });

    it('returns null for non-existent keys', () => {
      const schema = new FormSchema(form, rawColumns, repeatableColumns, { fullSchema: true });
      
      const nonExistentColumn = schema.columnForKey('non_existent');
      expect(nonExistentColumn).toBeNull();
    });

    it('finds columns by name', () => {
      const schema = new FormSchema(form, rawColumns, repeatableColumns, { fullSchema: true });
      
      const textColumn = schema.columnForName('text');
      expect(textColumn).toBeDefined();
      expect(textColumn.key).toBe('3bd0');
    });
  });

  describe('element access', () => {
    it('finds elements by key', () => {
      const schema = new FormSchema(form, rawColumns, repeatableColumns, { fullSchema: true });
      
      const textElement = schema.elementForKey('3bd0');
      expect(textElement).toBeDefined();
      expect(textElement.data_name).toBe('text');
      
      const numberElement = schema.elementForKey('4cd1');
      expect(numberElement).toBeDefined();
      expect(numberElement.data_name).toBe('number');
    });

    it('returns null for non-existent element keys', () => {
      const schema = new FormSchema(form, rawColumns, repeatableColumns, { fullSchema: true });
      
      const nonExistentElement = schema.elementForKey('non_existent');
      expect(nonExistentElement).toBeNull();
    });
  });

  describe('form properties', () => {
    it('provides access to form ID', () => {
      const schema = new FormSchema(form, rawColumns, repeatableColumns, { fullSchema: true });
      
      expect(schema.form.id).toBe('7a62278f-4eb8-480c-8f0c-34fc79d28bee');
    });

    it('provides access to form name', () => {
      const schema = new FormSchema(form, rawColumns, repeatableColumns, { fullSchema: true });
      
      expect(schema.form.name).toBe('TestForm');
    });
  });

  describe('data type mapping', () => {
    it('correctly maps string field types', () => {
      const schema = new FormSchema(form, rawColumns, repeatableColumns, { fullSchema: true });
      
      const textColumn = schema.columnsByKey['3bd0'];
      expect(textColumn.type).toBe('string');
    });

    it('correctly maps number field types', () => {
      const schema = new FormSchema(form, rawColumns, repeatableColumns, { fullSchema: true });
      
      const numberColumn = schema.columnsByKey['4cd1'];
      expect(numberColumn.type).toBe('double');
    });

    it('correctly maps date field types', () => {
      const schema = new FormSchema(form, rawColumns, repeatableColumns, { fullSchema: true });
      
      const dateColumn = schema.columnsByKey['5de2'];
      expect(dateColumn.type).toBe('date');
    });
  });
});