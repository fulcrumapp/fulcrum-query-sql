import { Form } from '@fulcrumapp/fulcrum-core';
import { Deparser } from '@fulcrumapp/pg-query-deparser';
import moment from 'moment-timezone';
import Converter from '../converter.js';
import FormSchema from '../../form-schema.js';
import {
  ColumnRef,
  BoolExpr,
  AExpr,
  BooleanTest,
} from '../helpers.js';
import Query from '../../query.js';
import { Expression } from '../../expression.js';
import { availableOperatorsForColumn } from '../../operator.js';

describe('NotEmpty converter', () => {
  describe('given a non-array', () => {
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

      const sql = new Deparser().deparse(expr);

      const expectSql = '"text" IS NOT NULL';
      expect(sql).toEqual(expectSql);
    });
  });

describe('ConstValue converter', () => {
  describe('given a Number column', () => {
    const numValue = 72828292;
    const numColumn = {
      isNumber: true,
      element: {
        isCalculatedElement: false,
        display: {
          isDate: false,
        },
      },
    };

    const expectedValue = (val) => (
      {
        A_Const: {
          val: {
            Float: {
              str: val != null ? val.toString() : '',
            }
          },
        },
      }
    );

    it('correctly structures a ConstValue with a Float type', () => {
      expect(new Converter().ConstValue(numColumn, numValue)).toEqual(expectedValue(numValue));
    });

    describe('given a calculated field with a date display', () => {
      const calculatedColumn = {
        isNumber: true,
        element: {
          isCalculatedElement: true,
          display: {
            isDate: true,
          }
        }
      };
      // 2025-07-22T00:00:00Z — fixed UTC epoch, independent of machine timezone
      const EPOCH_2025_07_22_UTC = 1753142400;

      it('correctly structures a ConstValue with a Float type', () => {
        expect(new Converter().ConstValue(calculatedColumn, '2025-07-22')).toEqual(expectedValue(EPOCH_2025_07_22_UTC));
      });

      it('correctly structures a ConstValue with a Float type when passed a date string with different formatting', () => {
        expect(new Converter().ConstValue(calculatedColumn, '07/22/2025')).toEqual(expectedValue(EPOCH_2025_07_22_UTC));
      });

      it('correctly structures a ConstValue with a Float type when passed a double value', () => {
        expect(new Converter().ConstValue(calculatedColumn, 1753156800.123)).toEqual(expectedValue(1753156800.123));
      });
    });
  });
});

  describe('given media captions', () => {
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

      const sql = new Deparser().deparse(expr);

      const expectSql = '("photos_captions" IS NOT NULL AND ((length(array_to_string("photos_captions", \'\'))) > (0)))';
      expect(sql).toEqual(expectSql);
    });
  });
  describe('given media field except captions', () => {
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

      const expression = new Expression({ field: '3bd0', operator: 'is_not_empty' }, schema);

      const expr = new Converter().NotEmptyConverter(expression);

      const sql = new Deparser().deparse(expr);

      const expectSql = '"photos_captions" IS NOT NULL';
      expect(sql).toEqual(expectSql);
    });
  });
});

describe('Empty converter', () => {
  describe('given a non-array', () => {
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

      const sql = new Deparser().deparse(expr);

      const expectSql = '"text" IS NULL';
      expect(sql).toEqual(expectSql);
    });
  });
  describe('given media captions', () => {
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

      const sql = new Deparser().deparse(expr);

      const expectSql = '("photos_captions" IS NULL OR ((COALESCE(array_position("photos_captions", NULL), 0)) > (0)))';
      expect(sql).toEqual(expectSql);
    });
  });
  describe('given media field except captions', () => {
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

      const expression = new Expression({ field: '3bd0', operator: 'is_empty' }, schema);

      const expr = new Converter().EmptyConverter(expression);

      const sql = new Deparser().deparse(expr);

      const expectSql = '"photos_captions" IS NULL';
      expect(sql).toEqual(expectSql);
    });
  });
});

describe('NotIn converter', () => {
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

  const schema = new FormSchema(new Form(formJson), rawColumns.form, rawColumns.repeatables, { fullSchema: true });

  it('includes blank (NULL) values when excluding non-blank values', () => {
    const expression = new Expression({ field: '3bd0', operator: 'not_in', value: ['A'] }, schema);

    const expr = new Converter().NotInConverter(expression);
    const sql = new Deparser().deparse(expr);

    expect(sql).toEqual('("text" IS NULL OR "text" NOT IN (\'A\'))');
  });

  it('excludes blank (NULL) values when blank is selected along with other values', () => {
    const expression = new Expression({ field: '3bd0', operator: 'not_in', value: ['A', null] }, schema);

    const expr = new Converter().NotInConverter(expression);
    const sql = new Deparser().deparse(expr);

    expect(sql).toEqual('("text" IS NOT NULL AND "text" NOT IN (\'A\'))');
  });

  it('excludes only blank (NULL) values when blank is the only selected value', () => {
    const expression = new Expression({ field: '3bd0', operator: 'not_in', value: [null] }, schema);

    const expr = new Converter().NotInConverter(expression);
    const sql = new Deparser().deparse(expr);

    expect(sql).toEqual('"text" IS NOT NULL');
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
      const sql = new Deparser().deparse(boolExpr);

      const expectSql = '(EXISTS (SELECT 1 FROM "ea635699-133f-4844-ae77-f4090fffc7b0" WHERE ("ea635699-133f-4844-ae77-f4090fffc7b0"."_record_id" = ANY (ARRAY["records"."rl"]) AND "ea635699-133f-4844-ae77-f4090fffc7b0"."_title" ILIKE (\'%test%\'))))';
      console.log("THIS IS SQL", sql);
      
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
      const sql = new Deparser().deparse(ast);

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
      const sql = new Deparser().deparse(ast);

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

describe('BinaryConverter', () => {
  const converter = new Converter();
    
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
        type: 'DateTimeField',
        key: 'date123',
        label: 'Created Date',
        data_name: 'created_date',
      },
      {
        type: 'TextField',
        key: '3bd0',
        numeric: true,
        label: 'Numbers',
        data_name: 'numbers',
        format: 'decimal',
      },
    ],
  };

  const rawColumns = {
    form: [
      {
        field: 'date123',
        name: 'created_date',
        type: 'date',
      },
      {
        field: '3bd0',
        name: 'numbers',
        type: 'double',
      },
    ],
    repeatables: {},
  };

  const form = new Form(formJson);
  const schema = new FormSchema(form, rawColumns.form, rawColumns.repeatables, { fullSchema: true });
  const dateColumn = schema.columns.find(col => col.id === 'date123');
  const numberColumn = schema.columns.find(col => col.id === '3bd0');

  describe('with a non-date column', () => {
    it('creates an AExpr with equals operator and string value', () => {
      const expression = {
        column: numberColumn,
        scalarValue: '123.45'
      };

      const result = converter.BinaryConverter(0, '=', expression);

      expect(result).toEqual({
        A_Expr: {
          kind: 0,
          name: [{ String: { str: '=' } }],
          lexpr: {
            ColumnRef: {
              fields: [{ String: { str: 'numbers' } }]
            }
          },
          rexpr: {
            A_Const: {
              val: {
                Float: {
                  str: '123.45'
                }
              }
            }
          }
        }
      });
    });
  });
  describe('with a date column', () => {
    it('creates an AExpr with equals operator and ISO string date', () => {
      const testDate = '2025-07-25';
      const expression = {
        isDateOperator: true,
        column: dateColumn,
        scalarValue: testDate
      };

      const result = converter.BinaryConverter(0, '>=', expression);

      expect(result).toEqual({
        A_Expr: {
          kind: 0,
          name: [{ String: { str: '>=' } }],
          lexpr: {
            ColumnRef: {
              fields: [{ String: { str: 'created_date' } }]
            }
          },
          rexpr: {
            A_Const: {
              val: {
                String: {
                  str: moment.utc(testDate).toISOString()
                }
              }
            }
          }
        }
      });
    });
  });
});

describe('gps_device_capture column', () => {
  const formJson = {
    id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    name: 'GPSForm',
    status_field: {
      type: 'StatusField',
      label: 'Status',
      data_name: 'status',
    },
    elements: [
      {
        type: 'TextField',
        key: 'f001',
        label: 'Name',
        data_name: 'name',
      },
    ],
  };

  const rawColumns = {
    form: [
      { field: 'f001', name: 'name', type: 'string' },
      { name: '_gps_device_capture', type: 'string' },
    ],
    repeatables: {},
  };

  describe('FormSchema', () => {
    it('includes _gps_device_capture in fullSchema columns', () => {
      const form = new Form(formJson);
      const schema = new FormSchema(form, rawColumns.form, rawColumns.repeatables, { fullSchema: true });
      const col = schema.columns.find(c => c.id === '_gps_device_capture');

      expect(col).toBeDefined();
      expect(col.name).toBe('GPS Device Capture');
      expect(col.attributeName).toBe('gpsDeviceCapture');
    });

    it('does not include _gps_device_capture when fullSchema is false', () => {
      const form = new Form(formJson);
      const schema = new FormSchema(form, rawColumns.form, rawColumns.repeatables, { fullSchema: false });
      const col = schema.columns.find(c => c.id === '_gps_device_capture');

      expect(col).toBeUndefined();
    });
  });

  describe('Query targetList', () => {
    it('includes gps_device_capture in the SQL target list', () => {
      const form = new Form(formJson);
      const schema = new FormSchema(form, rawColumns.form, rawColumns.repeatables, { fullSchema: true });
      const query = new Query({ form, schema, full: true });
      const sql = query.toSQL({ applySort: false });

      expect(sql).toContain('"_gps_device_capture" AS "gps_device_capture"');
    });
  });

  describe('operators', () => {
    it('returns only empty/not-empty operators for _gps_device_capture (JSONB)', () => {
      const form = new Form(formJson);
      const schema = new FormSchema(form, rawColumns.form, rawColumns.repeatables, { fullSchema: true });
      const col = schema.columns.find(c => c.id === '_gps_device_capture');
      const ops = availableOperatorsForColumn(col);

      expect(ops).toHaveLength(2);
      expect(ops.find(o => o.name === 'is_empty')).toBeDefined();
      expect(ops.find(o => o.name === 'is_not_empty')).toBeDefined();
    });

    it('does not include text operators that would fail on JSONB', () => {
      const form = new Form(formJson);
      const schema = new FormSchema(form, rawColumns.form, rawColumns.repeatables, { fullSchema: true });
      const col = schema.columns.find(c => c.id === '_gps_device_capture');
      const ops = availableOperatorsForColumn(col);

      expect(ops.find(o => o.name === 'text_contain')).toBeUndefined();
      expect(ops.find(o => o.name === 'text_match')).toBeUndefined();
      expect(ops.find(o => o.name === 'in')).toBeUndefined();
    });
  });
});
