import { Form } from 'fulcrum-core';
import Deparse from 'pg-query-deparser';
import Converter from '../converter';
import FormSchema from '../../form-schema';
import {
  ColumnRef,
  BoolExpr,
  AExpr,
  BooleanTest,
} from '../helpers';
import Query from '../../query';
import { Expression } from '../../expression';

describe('NotEmpty converter', () => {
  describe('given an non-array', () => {
    it('creates a subquery with a not null test', () => {
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
            label: 'Text',
            data_name: 'text',
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
        ],
        repeatables: {},
      };
      const form = new Form(formJson);
      const schema = new FormSchema(form, rawColumns.form, rawColumns.repeatables, { fullSchema: true });

      const expression = new Expression({ field: '3bd0', operator: 'is_not_empty' }, schema);

      const expr = new Converter().NotEmptyConverter(expression);

      const sql = new Deparse().deparse(expr);

      const expectSql = '"text" IS NOT NULL';
      expect(sql).toEqual(expectSql);
    });
  });
  describe('given an array', () => {
    it('creates a subquery with array_to_string', () => {
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
            type: 'PhotoField',
            key: '3bd0',
            label: 'Photos',
            data_name: 'photos',
          },
        ],
      };
      const rawColumns = {
        form: [
          {
            field: '3bd0',
            name: 'photos',
            type: 'array',
          },
          {
            field: '3bd0',
            name: 'photos_captions',
            type: 'array',
          },
        ],
        repeatables: {},
      };
      const form = new Form(formJson);
      const schema = new FormSchema(form, rawColumns.form, rawColumns.repeatables, { fullSchema: true });

      const expression = new Expression({ field: '3bd0_captions', operator: 'is_not_empty' }, schema);

      const expr = new Converter().NotEmptyConverter(expression);

      const sql = new Deparse().deparse(expr);

      const expectSql = '("photos_captions" IS NOT NULL AND ((length(array_to_string("photos_captions", \'\'))) > (0)))';
      expect(sql).toEqual(expectSql);
    });
  });
});

describe('Empty converter', () => {
  describe('given an non-array', () => {
    it('creates a subquery with a null test', () => {
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
            label: 'Text',
            data_name: 'text',
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
        ],
        repeatables: {},
      };
      const form = new Form(formJson);
      const schema = new FormSchema(form, rawColumns.form, rawColumns.repeatables, { fullSchema: true });

      const expression = new Expression({ field: '3bd0', operator: 'is_empty' }, schema);

      const expr = new Converter().EmptyConverter(expression);

      const sql = new Deparse().deparse(expr);

      const expectSql = '"text" IS NULL';
      expect(sql).toEqual(expectSql);
    });
  });
  describe('given an array', () => {
    it('creates a subquery with array_position', () => {
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
            type: 'PhotoField',
            key: '3bd0',
            label: 'Photos',
            data_name: 'photos',
          },
        ],
      };
      const rawColumns = {
        form: [
          {
            field: '3bd0',
            name: 'photos',
            type: 'array',
          },
          {
            field: '3bd0',
            name: 'photos_captions',
            type: 'array',
          },
        ],
        repeatables: {},
      };
      const form = new Form(formJson);
      const schema = new FormSchema(form, rawColumns.form, rawColumns.repeatables, { fullSchema: true });

      const expression = new Expression({ field: '3bd0_captions', operator: 'is_empty' }, schema);

      const expr = new Converter().EmptyConverter(expression);

      const sql = new Deparse().deparse(expr);

      const expectSql = '("photos_captions" IS NULL OR ((COALESCE(array_position("photos_captions", NULL), 0)) > (0)))';
      expect(sql).toEqual(expectSql);
    });
  });
});

describe('WhereClause converter', () => {
  describe('given a record link column to search on', () => {
    it('generates an exists subquery', () => {
      const linkedFormJson = {
        id: 'ea635699-133f-4844-ae77-f4090fffc7b0',
        name: 'LinkedForm',
        status_field: {
          type: 'StatusField',
          label: 'Status',
          data_name: 'status',
        },
        elements: [
          {
            type: 'TextField',
            key: 'abc1',
            label: 'test',
            data_name: 'text',
          },
        ],
      };
      const linkedForm = new Form(linkedFormJson);

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
            type: 'RecordLinkField',
            key: '3bd0',
            label: 'rl',
            data_name: 'rl',
            form_id: 'ea635699-133f-4844-ae77-f4090fffc7b0',
          },
        ],
      };
      const rawColumns = {
        form: [
          {
            field: '3bd0',
            name: 'rl',
            type: 'array',
          },
        ],
        repeatables: {},
      };
      const form = new Form(formJson);
      form.elements[0].form = linkedForm;
      const schema = new FormSchema(form, rawColumns.form, rawColumns.repeatables, { fullSchema: true });
      const queryOptions = {
        form: {
          name: 'LinkedTable',
        },
        schema,
      };
      const query = new Query(queryOptions);
      query.columnSettings.columnsByID['3bd0'].search = 'test';
      const boolExpr = new Converter().whereClause(query);
      const sql = new Deparse().deparse(boolExpr);

      const expectSql = '(EXISTS (SELECT 1 FROM "ea635699-133f-4844-ae77-f4090fffc7b0" WHERE ("ea635699-133f-4844-ae77-f4090fffc7b0"."_record_id" = ANY ("rl") AND "ea635699-133f-4844-ae77-f4090fffc7b0"."_title" ILIKE (\'%test%\'))))';
      expect(sql).toEqual(expectSql);
    });
  });
});

describe('JoinClause converter', () => {
  describe('given a single column to join on', () => {
    it('generates a single condition', () => {
      const baseQuery = 'select * from records';
      const join = {
        tableName: 'record_series',
        alias: 'record_series',
        sourceColumn: '_record_series_id',
        joinColumn: 'record_series_id',
      };

      const { JoinExpr } = Converter.joinClause(baseQuery, join);
      const { quals: ast } = JoinExpr;
      const sql = new Deparse().deparse(ast);

      const expectSql = '(("records"."_record_series_id") = ("record_series"."record_series_id"))';
      expect(sql).toEqual(expectSql);
    });
  });

  describe('given an AST', () => {
    it('generates a complex conditional', () => {
      const expr1 = AExpr(0, '=', ColumnRef('_record_series_id', 'records'), ColumnRef('record_series_id', 'record_series'));
      const expr2 = BooleanTest(ColumnRef('enabled', 'record_series'), 0);
      const joinExpr = BoolExpr(0, [expr1, expr2]);

      const baseQuery = 'select * from records';
      const join = {
        tableName: 'record_series',
        alias: 'record_series',
        ast: joinExpr,
      };

      const { JoinExpr } = Converter.joinClause(baseQuery, join);
      const { quals: ast } = JoinExpr;
      const sql = new Deparse().deparse(ast);

      const expectSql = '((("records"."_record_series_id") = ("record_series"."record_series_id")) AND "record_series"."enabled" IS TRUE)';
      expect(sql).toEqual(expectSql);
    });
  });
});

describe('toTilesAST converter', () => {
  let formJson;
  let rawColumns;
  let queryOptions;

  beforeEach(() => {
    formJson = {
      id: '7a62278f-4eb8-480c-8f0c-34fc79d28bee',
      name: 'TestForm',
      status_field: {
        type: 'StatusField',
        label: 'Status',
        data_name: 'status',
      },
      elements: [
        {
          type: 'RecordLinkField',
          key: '3bd0',
          label: 'rl',
          data_name: 'rl',
          form_id: 'ea635699-133f-4844-ae77-f4090fffc7b0',
        },
      ],
    };

    rawColumns = {
      form: [
        {
          field: '3bd0',
          name: 'rl',
          type: 'array',
        },
      ],
      repeatables: {},
    };

    const form = new Form(formJson);
    const schema = new FormSchema(form, rawColumns.form, rawColumns.repeatables, { fullSchema: true });

    queryOptions = {
      form: {
        id: '7a62278f-4eb8-480c-8f0c-34fc79d28bee',
        name: 'DemoForm',
      },
      schema,
    };
  });

  describe('given a query instance', () => {
    it('generates a sytem field tiles SQL with a descending sort clause', () => {
      const query = new Query(queryOptions);
      const toTilesSQLQuery = query.toTileSQL(10000, { field: '_name', direction: 2 });

      const expectSql = `
        SELECT "_record_id" AS "id",
        "_geometry" AS "geometry",
        "_status" AS "status",
        '7a62278f-4eb8-480c-8f0c-34fc79d28bee'::text AS "form_id",
        "_name" AS "sorting_field" 
        FROM "7a62278f-4eb8-480c-8f0c-34fc79d28bee/_full" AS "records" 
        ORDER BY "sorting_field" DESC 
        LIMIT 10000
      `.replace(/\s+/g, ' ').trim();

      expect(toTilesSQLQuery.replace(/\s+/g, ' ').trim()).toEqual(expectSql);
    });

    it('generates a sytem field tiles SQL with a ascending sort clause', () => {
      const query = new Query(queryOptions);
      const toTilesSQLQuery = query.toTileSQL(10000, { field: '_name', direction: 1 });

      const expectSql = `
        SELECT "_record_id" AS "id",
        "_geometry" AS "geometry",
        "_status" AS "status",
        '7a62278f-4eb8-480c-8f0c-34fc79d28bee'::text AS "form_id",
        "_name" AS "sorting_field" 
        FROM "7a62278f-4eb8-480c-8f0c-34fc79d28bee/_full" AS "records" 
        ORDER BY "sorting_field" ASC 
        LIMIT 10000
      `.replace(/\s+/g, ' ').trim();

      expect(toTilesSQLQuery.replace(/\s+/g, ' ').trim()).toEqual(expectSql);
    });

    it('generates a non-sytem field tiles SQL with a descending sort clause', () => {
      const query = new Query(queryOptions);
      const toTilesSQLQuery = query.toTileSQL(10000, { field: '7a6f-4eb8-480c-8f0c-34ee', direction: 2 });

      const expectSql = `
        SELECT "_record_id" AS "id",
        "_geometry" AS "geometry",
        "_status" AS "status",
        '7a62278f-4eb8-480c-8f0c-34fc79d28bee'::text AS "form_id",
        '7a6f-4eb8-480c-8f0c-34ee'::text AS "sorting_field" 
        FROM "7a62278f-4eb8-480c-8f0c-34fc79d28bee/_full" AS "records" 
        ORDER BY "sorting_field" DESC 
        LIMIT 10000
      `.replace(/\s+/g, ' ').trim();

      expect(toTilesSQLQuery.replace(/\s+/g, ' ').trim()).toEqual(expectSql);
    });

    it('generates a non-sytem field tiles SQL with a ascending sort clause', () => {
      const query = new Query(queryOptions);
      const toTilesSQLQuery = query.toTileSQL(10000, { field: '7a6f-4eb8-480c-8f0c-34ee', direction: 1 });

      const expectSql = `
        SELECT "_record_id" AS "id",
        "_geometry" AS "geometry",
        "_status" AS "status",
        '7a62278f-4eb8-480c-8f0c-34fc79d28bee'::text AS "form_id",
        '7a6f-4eb8-480c-8f0c-34ee'::text AS "sorting_field" 
        FROM "7a62278f-4eb8-480c-8f0c-34fc79d28bee/_full" AS "records" 
        ORDER BY "sorting_field" ASC 
        LIMIT 10000
      `.replace(/\s+/g, ' ').trim();

      expect(toTilesSQLQuery.replace(/\s+/g, ' ').trim()).toEqual(expectSql);
    });

    it('generates a regular tiles SQL when sort clause is undefined', () => {
      const query = new Query(queryOptions);
      const toTilesSQLQuery = query.toTileSQL(10000, undefined);

      const expectSql = `
        SELECT "_record_id" AS "id",
        "_geometry" AS "geometry",
        "_status" AS "status",
        '7a62278f-4eb8-480c-8f0c-34fc79d28bee'::text AS "form_id"
        FROM "7a62278f-4eb8-480c-8f0c-34fc79d28bee/_full" AS "records"
        LIMIT 10000
      `.replace(/\s+/g, ' ').trim();

      expect(toTilesSQLQuery.replace(/\s+/g, ' ').trim()).toEqual(expectSql);
    });
  });
});
