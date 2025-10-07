import { Form } from 'fulcrum-core';
import { Sort, DIRECTION_ASC, DIRECTION_DESC, DIRECTIONS } from '../sort';
import FormSchema from '../form-schema';

describe('Sort', () => {
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

  describe('constants', () => {
    it('defines direction constants', () => {
      expect(DIRECTION_ASC).toBe('asc');
      expect(DIRECTION_DESC).toBe('desc');
    });

    it('defines DIRECTIONS object', () => {
      expect(DIRECTIONS.Asc).toBe(DIRECTION_ASC);
      expect(DIRECTIONS.Desc).toBe(DIRECTION_DESC);
    });
  });

  describe('constructor', () => {
    it('creates a sort with default values', () => {
      const sort = new Sort({}, schema);
      
      expect(sort.field).toBeNull();
      expect(sort.direction).toBeNull();
    });

    it('creates a sort with provided values', () => {
      const attrs = {
        field: '3bd0',
        direction: DIRECTION_ASC,
      };
      
      const sort = new Sort(attrs, schema);
      
      expect(sort.field).toBe('3bd0');
      expect(sort.direction).toBe(DIRECTION_ASC);
    });
  });

  describe('isValid', () => {
    it('returns false when no field is set', () => {
      const sort = new Sort({}, schema);
      
      expect(sort.isValid).toBe(false);
    });

    it('returns false for non-existent field', () => {
      const sort = new Sort({ field: 'non_existent' }, schema);
      
      expect(sort.isValid).toBe(false);
    });

    it('returns true for valid field', () => {
      const sort = new Sort({ field: '3bd0' }, schema);
      
      expect(sort.isValid).toBe(true);
    });
  });

  describe('field and column properties', () => {
    it('returns correct field', () => {
      const sort = new Sort({ field: '3bd0' }, schema);
      
      expect(sort.field).toBe('3bd0');
    });

    it('returns correct column for valid field', () => {
      const sort = new Sort({ field: '3bd0' }, schema);
      
      expect(sort.column).toBeDefined();
      expect(sort.column.key).toBe('3bd0');
    });

    it('returns null column for invalid field', () => {
      const sort = new Sort({ field: 'non_existent' }, schema);
      
      expect(sort.column).toBeNull();
    });

    it('sets field when column is set', () => {
      const sort = new Sort({}, schema);
      const column = schema.columnsByKey['3bd0'];
      
      sort.column = column;
      
      expect(sort.field).toBe('3bd0');
    });

    it('sets field to null when column is set to null', () => {
      const sort = new Sort({ field: '3bd0' }, schema);
      
      sort.column = null;
      
      expect(sort.field).toBeNull();
    });
  });

  describe('columnName', () => {
    it('returns column name for valid field', () => {
      const sort = new Sort({ field: '3bd0' }, schema);
      
      expect(sort.columnName).toBe('text');
    });

    it('returns null for invalid field', () => {
      const sort = new Sort({ field: 'non_existent' }, schema);
      
      expect(sort.columnName).toBeNull();
    });

    it('returns null when no field is set', () => {
      const sort = new Sort({}, schema);
      
      expect(sort.columnName).toBeNull();
    });
  });

  describe('direction property', () => {
    it('gets and sets direction correctly', () => {
      const sort = new Sort({}, schema);
      
      sort.direction = DIRECTION_ASC;
      expect(sort.direction).toBe(DIRECTION_ASC);
      
      sort.direction = DIRECTION_DESC;
      expect(sort.direction).toBe(DIRECTION_DESC);
    });
  });

  describe('toJSON', () => {
    it('returns correct JSON representation', () => {
      const attrs = {
        field: '3bd0',
        direction: DIRECTION_ASC,
      };
      const sort = new Sort(attrs, schema);
      
      const json = sort.toJSON();
      
      expect(json).toEqual({
        field: '3bd0',
        direction: DIRECTION_ASC,
      });
    });

    it('returns JSON with null values when not set', () => {
      const sort = new Sort({}, schema);
      
      const json = sort.toJSON();
      
      expect(json).toEqual({
        field: null,
        direction: null,
      });
    });
  });

  describe('toHumanDescription', () => {
    it('returns null for invalid sort', () => {
      const sort = new Sort({}, schema);
      
      const description = sort.toHumanDescription();
      
      expect(description).toBeNull();
    });

    it('returns correct human description for ascending sort', () => {
      const sort = new Sort({
        field: '3bd0',
        direction: DIRECTION_ASC,
      }, schema);
      
      const description = sort.toHumanDescription();
      
      expect(description).toBe('Text Field ASC');
    });

    it('returns correct human description for descending sort', () => {
      const sort = new Sort({
        field: '4cd1',
        direction: DIRECTION_DESC,
      }, schema);
      
      const description = sort.toHumanDescription();
      
      expect(description).toBe('Number Field DESC');
    });

    it('uses column name when column has no label', () => {
      // Create a sort with a system column that might not have a proper label
      const sort = new Sort({
        field: '_record_id',
        direction: DIRECTION_ASC,
      }, schema);
      
      // Mock a column that has no name property
      jest.spyOn(sort, 'column', 'get').mockReturnValue({ columnName: '_record_id' });
      jest.spyOn(sort, 'columnName', 'get').mockReturnValue('_record_id');
      
      const description = sort.toHumanDescription();
      
      expect(description).toBe('_record_id ASC');
    });
  });
});