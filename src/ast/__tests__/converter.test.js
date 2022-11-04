import Converter from '../converter';
import Deparse from 'pg-query-deparser';
import { ColumnRef,
  BoolExpr,
  AExpr,
  AConst,
  BooleanTest, IntegerValue } from '../helpers';

describe('JoinClause converter', () => {
  describe('given a single column to join on', () => {
    it('generates a single condition', () => {
      const baseQuery = 'select * from records'
      const join = {
        tableName: 'record_series',
        alias: 'record_series',
        sourceColumn: '_record_series_id',
        joinColumn: 'record_series_id'
      }

      const { JoinExpr } = Converter.joinClause(baseQuery, join)
      const { quals: ast } = JoinExpr;
      const sql = new Deparse().deparse(ast)

      const expectSql = '(("records"."_record_series_id") = ("record_series"."record_series_id"))';
      expect(sql).toEqual(expectSql);
    });
  });

  describe('given an AST', () => {
    it('generates a complex conditional', () => {
      const expr1 = AExpr(0, '=', ColumnRef('_record_series_id', 'records'), ColumnRef('record_series_id', 'record_series'));
      const expr2 = BooleanTest(ColumnRef('enabled', 'record_series'), 0);
      const joinExpr = BoolExpr(0, [ expr1, expr2 ])

      const baseQuery = 'select * from records'
      const join = {
        tableName: 'record_series',
        alias: 'record_series',
        ast: joinExpr
      }

      const { JoinExpr } = Converter.joinClause(baseQuery, join)
      const { quals: ast } = JoinExpr;
      const sql = new Deparse().deparse(ast)

      const expectSql = '((("records"."_record_series_id") = ("record_series"."record_series_id")) AND "record_series"."enabled" IS TRUE)';
      expect(sql).toEqual(expectSql);
    });
  });
});