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

      const { joinExpr } = Converter.joinClause(baseQuery, join);
      const { quals: ast } = joinExpr;
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
