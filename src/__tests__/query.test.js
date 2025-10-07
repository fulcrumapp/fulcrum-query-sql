import { Form } from 'fulcrum-core';
import Query from '../query';
import FormSchema from '../form-schema';

describe('Query', () => {
  let form;
  let schema;
  let rawColumns;
  let queryOptions;

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

    queryOptions = {
      form: {
        id: '7a62278f-4eb8-480c-8f0c-34fc79d28bee',
        name: 'TestForm',
      },
      schema,
    };
  });

  describe('constructor', () => {
    it('creates a query with default values', () => {
      const query = new Query(queryOptions);
      
      expect(query.form).toBe(queryOptions.form);
      expect(query.schema).toBe(schema);
      expect(query.full).toBe(true);
      expect(query.repeatableKey).toBeNull();
    });

    it('creates a query with custom options', () => {
      const customOptions = {
        ...queryOptions,
        full: false,
        repeatableKey: 'some_key',
        filter: {
          expressions: [
            { field: '3bd0', operator: 'equal', value: ['test'] }
          ]
        }
      };
      
      const query = new Query(customOptions);
      
      expect(query.full).toBe(false);
      expect(query.repeatableKey).toBe('some_key');
    });

    it('initializes filters correctly', () => {
      const query = new Query(queryOptions);
      
      expect(query.statusFilter).toBeDefined();
      expect(query.projectFilter).toBeDefined();
      expect(query.assignmentFilter).toBeDefined();
      expect(query.changesetFilter).toBeDefined();
      expect(query.columnSettings).toBeDefined();
    });
  });

  describe('defaultDateField', () => {
    it('returns _server_updated_at for non-repeatable queries', () => {
      const query = new Query(queryOptions);
      
      expect(query.defaultDateField).toBe('_server_updated_at');
    });

    it('returns _updated_at for repeatable queries', () => {
      const repeatableOptions = {
        ...queryOptions,
        repeatableKey: 'some_repeatable'
      };
      const query = new Query(repeatableOptions);
      
      expect(query.defaultDateField).toBe('_updated_at');
    });
  });

  describe('hasFilter', () => {
    it('returns false when no filters are set', () => {
      const query = new Query(queryOptions);
      
      expect(query.hasFilter).toBe(false);
    });

    it('returns true when status filter is set', () => {
      const optionsWithFilter = {
        ...queryOptions,
        status_filter: {
          operator: 'equal',
          value: ['submitted']
        }
      };
      const query = new Query(optionsWithFilter);
      
      expect(query.hasFilter).toBe(true);
    });

    it('returns true when search filter is set', () => {
      const optionsWithFilter = {
        ...queryOptions,
        search_filter: 'search term'
      };
      const query = new Query(optionsWithFilter);
      
      expect(query.hasFilter).toBe(true);
    });

    it('returns true when date filter is set', () => {
      const optionsWithFilter = {
        ...queryOptions,
        date_filter: {
          field: '_created_at',
          operator: 'date_today'
        }
      };
      const query = new Query(optionsWithFilter);
      
      expect(query.hasFilter).toBe(true);
    });

    it('returns true when expression filter is set', () => {
      const optionsWithFilter = {
        ...queryOptions,
        filter: {
          expressions: [
            { field: '3bd0', operator: 'equal', value: ['test'] }
          ]
        }
      };
      const query = new Query(optionsWithFilter);
      
      expect(query.hasFilter).toBe(true);
    });
  });

  describe('boundingBox', () => {
    it('gets and sets bounding box correctly', () => {
      const query = new Query(queryOptions);
      const bbox = { north: 1, south: 0, east: 1, west: 0 };
      
      query.boundingBox = bbox;
      
      expect(query.boundingBox).toBe(bbox);
    });
  });

  describe('searchFilter', () => {
    it('gets and sets search filter correctly', () => {
      const query = new Query(queryOptions);
      const searchTerm = 'test search term';
      
      query.searchFilter = searchTerm;
      
      expect(query.searchFilter).toBe(searchTerm);
    });
  });

  describe('clearAllFilters', () => {
    it('resets all filters to default state', () => {
      const optionsWithFilters = {
        ...queryOptions,
        status_filter: { operator: 'equal', value: ['submitted'] },
        search_filter: 'search term',
        filter: {
          expressions: [
            { field: '3bd0', operator: 'equal', value: ['test'] }
          ]
        }
      };
      
      const query = new Query(optionsWithFilters);
      expect(query.hasFilter).toBe(true);
      
      query.clearAllFilters();
      
      expect(query.hasFilter).toBe(false);
      expect(query.searchFilter).toBe('');
      expect(query.filter.expressions).toHaveLength(0);
    });
  });

  describe('joinColumns', () => {
    it('returns empty array when no join columns are needed', () => {
      const query = new Query(queryOptions);
      
      expect(query.joinColumns).toEqual([]);
    });

    it('includes project filter column when project filter is set', () => {
      const optionsWithProjectFilter = {
        ...queryOptions,
        project_filter: {
          operator: 'equal',
          value: ['Project Name']
        }
      };
      
      const query = new Query(optionsWithProjectFilter);
      
      expect(query.joinColumns.length).toBeGreaterThan(0);
    });
  });

  describe('referencedColumns', () => {
    it('returns empty array when no referenced columns exist', () => {
      const query = new Query(queryOptions);
      
      expect(query.referencedColumns).toEqual([]);
    });

    it('includes columns from filters and expressions', () => {
      const optionsWithFilters = {
        ...queryOptions,
        filter: {
          expressions: [
            { field: '3bd0', operator: 'equal', value: ['test'] }
          ]
        }
      };
      
      const query = new Query(optionsWithFilters);
      
      expect(query.referencedColumns.length).toBeGreaterThan(0);
    });
  });

  describe('joinColumnsWithSorting', () => {
    it('includes sorting columns in join columns', () => {
      const optionsWithSorting = {
        ...queryOptions,
        sorting: [
          { field: '3bd0', direction: 'asc' }
        ]
      };
      
      const query = new Query(optionsWithSorting);
      
      // Should include any join columns needed for sorting
      expect(Array.isArray(query.joinColumnsWithSorting)).toBe(true);
    });
  });

  describe('tableName', () => {
    it('returns correct table name for regular queries', () => {
      const query = new Query(queryOptions);
      
      expect(query.tableName).toBe('7a62278f-4eb8-480c-8f0c-34fc79d28bee/_full');
    });

    it('returns correct table name for repeatable queries', () => {
      const repeatableOptions = {
        ...queryOptions,
        repeatableKey: 'photos'
      };
      const query = new Query(repeatableOptions);
      
      expect(query.tableName).toBe('7a62278f-4eb8-480c-8f0c-34fc79d28bee/photos');
    });

    it('returns correct table name when full is false', () => {
      const limitedOptions = {
        ...queryOptions,
        full: false
      };
      const query = new Query(limitedOptions);
      
      expect(query.tableName).toBe('7a62278f-4eb8-480c-8f0c-34fc79d28bee');
    });
  });
});