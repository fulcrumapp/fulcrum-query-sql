import SimpleColumn from '../schema/simple-column';
import Join from '../schema/join';

describe('SimpleColumn', () => {
  describe('constructor', () => {
    it('creates a simple column with basic attributes', () => {
      const attrs = {
        name: 'Test Column',
        attributeName: 'test_attribute',
        columnName: 'test_column',
        type: 'string',
        index: 1,
      };
      
      const column = new SimpleColumn(attrs);
      
      expect(column.name).toBe('Test Column');
      expect(column.attributeName).toBe('test_attribute');
      expect(column.columnName).toBe('test_column');
      expect(column.type).toBe('string');
    });

    it('creates a column with default type', () => {
      const attrs = {
        name: 'Test Column',
        columnName: 'test_column',
      };
      
      const column = new SimpleColumn(attrs);
      
      expect(column.type).toBe('string');
    });

    it('creates a column with join information', () => {
      const joinAttrs = {
        tableName: 'projects',
        alias: 'project',
        sourceColumn: 'project_id',
        joinColumn: 'id',
      };
      
      const attrs = {
        name: 'Project Name',
        columnName: 'project_name',
        join: joinAttrs,
      };
      
      const column = new SimpleColumn(attrs);
      
      expect(column.join).toBeInstanceOf(Join);
      expect(column.join.tableName).toBe('projects');
    });

    it('creates a SQL column with special ID format', () => {
      const attrs = {
        name: 'SQL Column',
        columnName: 'sql_column',
        sql: true,
        index: 5,
      };
      
      const column = new SimpleColumn(attrs);
      
      expect(column.id).toBe('__5:sql_column');
    });
  });

  describe('type property', () => {
    it('returns the correct type', () => {
      const column = new SimpleColumn({
        name: 'Number Column',
        columnName: 'number_col',
        type: 'double',
      });
      
      expect(column.type).toBe('double');
    });

    it('inherits type checking methods from base Column class', () => {
      const stringColumn = new SimpleColumn({
        name: 'String Column',
        columnName: 'string_col',
        type: 'string',
      });
      
      const numberColumn = new SimpleColumn({
        name: 'Number Column',
        columnName: 'number_col',
        type: 'double',
      });
      
      const dateColumn = new SimpleColumn({
        name: 'Date Column',
        columnName: 'date_col',
        type: 'date',
      });
      
      const arrayColumn = new SimpleColumn({
        name: 'Array Column',
        columnName: 'array_col',
        type: 'array',
      });
      
      expect(numberColumn.isNumber).toBe(true);
      expect(numberColumn.isDouble).toBe(true);
      expect(stringColumn.isNumber).toBe(false);
      
      expect(dateColumn.isDate).toBe(true);
      expect(dateColumn.isDateOnly).toBe(true);
      expect(stringColumn.isDate).toBe(false);
      
      expect(arrayColumn.isArray).toBe(true);
      expect(stringColumn.isArray).toBe(false);
    });
  });

  describe('id property', () => {
    it('returns column name for regular columns', () => {
      const column = new SimpleColumn({
        name: 'Regular Column',
        columnName: 'regular_column',
      });
      
      expect(column.id).toBe('regular_column');
    });

    it('returns special format for SQL columns', () => {
      const column = new SimpleColumn({
        name: 'SQL Column',
        columnName: 'sql_column',
        sql: true,
        index: 3,
      });
      
      expect(column.id).toBe('__3:sql_column');
    });

    it('handles missing index for SQL columns', () => {
      const column = new SimpleColumn({
        name: 'SQL Column',
        columnName: 'sql_column',
        sql: true,
      });
      
      expect(column.id).toBe('__undefined:sql_column');
    });
  });

  describe('name property', () => {
    it('returns the correct name', () => {
      const column = new SimpleColumn({
        name: 'Display Name',
        columnName: 'display_name',
      });
      
      expect(column.name).toBe('Display Name');
    });
  });

  describe('join property', () => {
    it('returns null when no join is specified', () => {
      const column = new SimpleColumn({
        name: 'Simple Column',
        columnName: 'simple_column',
      });
      
      expect(column.join).toBeUndefined();
    });

    it('returns Join instance when join is specified', () => {
      const joinAttrs = {
        tableName: 'users',
        alias: 'user',
        sourceColumn: 'user_id',
        joinColumn: 'id',
      };
      
      const column = new SimpleColumn({
        name: 'User Name',
        columnName: 'user_name',
        join: joinAttrs,
      });
      
      expect(column.join).toBeInstanceOf(Join);
      expect(column.join.tableName).toBe('users');
      expect(column.join.alias).toBe('user');
    });
  });

  describe('accessor property', () => {
    it('uses default accessor when none specified', () => {
      const column = new SimpleColumn({
        name: 'Test Column',
        columnName: 'test_column',
      });
      
      expect(column.accessor).toBe(column.defaultAccessor);
    });

    it('uses custom accessor when specified', () => {
      const customAccessor = 'custom.accessor';
      
      const column = new SimpleColumn({
        name: 'Test Column',
        columnName: 'test_column',
        accessor: customAccessor,
      });
      
      expect(column.accessor).toBe(customAccessor);
    });
  });

  describe('different column types', () => {
    it('handles integer columns', () => {
      const column = new SimpleColumn({
        name: 'Integer Column',
        columnName: 'int_col',
        type: 'integer',
      });
      
      expect(column.type).toBe('integer');
      expect(column.isInteger).toBe(true);
      expect(column.isNumber).toBe(true);
    });

    it('handles timestamp columns', () => {
      const column = new SimpleColumn({
        name: 'Timestamp Column',
        columnName: 'timestamp_col',
        type: 'timestamp',
      });
      
      expect(column.type).toBe('timestamp');
      expect(column.isDateTime).toBe(true);
      expect(column.isDate).toBe(true);
    });

    it('handles boolean columns', () => {
      const column = new SimpleColumn({
        name: 'Boolean Column',
        columnName: 'bool_col',
        type: 'boolean',
      });
      
      expect(column.type).toBe('boolean');
      expect(column.isBoolean).toBe(true);
    });
  });
});