import { ColumnRef,
         ResTarget,
         AStar,
         RangeVar,
         SelectStmt,
         BoolExpr,
         NullTest,
         AExpr,
         AConst,
         StringValue,
         AArrayExpr,
         IntegerValue,
         FloatValue,
         SortBy,
         TypeCast,
         TypeName,
         FuncCall,
         WindowDef,
         RangeSubselect,
         WithClause,
         CommonTableExpr,
         RangeFunction,
         JoinExpr,
         Alias,
         CoalesceExpr,
         SubLink } from './helpers';

import { ConditionType } from '../condition';
import { OperatorType, calculateDateRange } from '../operator';
import { AggregateType } from '../aggregate';
import moment from 'moment-timezone';

const MAX_DISTINCT_VALUES = 1000;

const columnRef = (column) => {
  return column.isSQL ? ColumnRef(column.id, column.source)
                      : ColumnRef(column.columnName, column.source);
};

export default class Converter {
  toAST(query, {sort, pageSize, pageIndex, boundingBox, searchFilter}) {
    const targetList = this.targetList(query, sort, boundingBox);

    const joins = query.joinColumnsWithSorting.map(o => o.join);

    const fromClause = this.fromClause(query, joins);

    const whereClause = this.whereClause(query, boundingBox, searchFilter);

    const sortClause = sort;

    const limitOffset = this.limitOffset(pageSize, pageIndex);

    const limitCount = this.limitCount(pageSize);

    return SelectStmt({targetList, fromClause, whereClause, sortClause, limitOffset, limitCount});
  }

  toCountAST(query, {boundingBox, searchFilter}) {
    const targetList = [ ResTarget(FuncCall('count', [ AConst(IntegerValue(1)) ]), 'total_count') ];

    const joins = query.joinColumns.map(o => o.join);

    const fromClause = this.fromClause(query, joins);

    const whereClause = this.whereClause(query, boundingBox, searchFilter);

    return SelectStmt({targetList, fromClause, whereClause});
  }

  toTileAST(query, {searchFilter}) {
    let targetList = null;

    if (query.ast) {
      const sort = [ SortBy(AConst(IntegerValue(1)), 0, 0) ];

      targetList = [
        ResTarget(FuncCall('row_number', null, {over: WindowDef(sort, 530)}), '__id'),
        ResTarget(ColumnRef('__geometry'))
      ];
    } else {
      targetList = [
        ResTarget(ColumnRef('_record_id'), 'id'),
        ResTarget(ColumnRef('_geometry'), 'geometry'),
        ResTarget(ColumnRef('_status'), 'status'),
        ResTarget(TypeCast(TypeName('text'), AConst(StringValue(query.form.id))), 'form_id')
      ];
    }

    const joins = query.joinColumns.map(o => o.join);

    const fromClause = this.fromClause(query, joins);

    const whereClause = this.whereClause(query, null, searchFilter);

    return SelectStmt({targetList, fromClause, whereClause});
  }

  toHistogramAST(query, {column, bucketSize, type, sort, pageSize, pageIndex, boundingBox, searchFilter}) {
    const subLinkColumn = (col, table) => {
      return SubLink(4, SelectStmt({
        targetList: [ ResTarget(ColumnRef(col)) ],
        fromClause: [ RangeVar(table) ]
      }));
    };

    const expr = (lhs, op, rhs) => {
      return AExpr(0, op, lhs, rhs);
    };

    const targetList = [
      ResTarget(ColumnRef('series', 'series'), 'bucket'),
      ResTarget(CoalesceExpr([ ColumnRef('count', 'sub'), AConst(IntegerValue(0)) ]), 'count'),
      ResTarget(ColumnRef('min_value', 'sub'), 'min_value'),
      ResTarget(ColumnRef('max_value', 'sub'), 'max_value'),
      ResTarget(ColumnRef('avg_value', 'sub'), 'avg_value'),
      ResTarget(ColumnRef('sum_value', 'sub'), 'sum_value'),

      ResTarget(expr(subLinkColumn('min_value', '__stats'),
                     '+',
                     expr(expr(ColumnRef('series', 'series'),
                               '-',
                               AConst(IntegerValue(1))),
                          '*',
                          subLinkColumn('bucket_width', '__stats'))), 'bucket_min'),

      ResTarget(expr(subLinkColumn('min_value', '__stats'),
                     '+',
                     expr(ColumnRef('series', 'series'),
                          '*',
                          subLinkColumn('bucket_width', '__stats'))), 'bucket_max'),

      ResTarget(subLinkColumn('range', '__stats'), 'range'),
      ResTarget(subLinkColumn('bucket_width', '__stats'), 'bucket_width')
    ];

    const withClause = this.histogramWithClause(column, bucketSize, type, query, boundingBox, searchFilter);

    const seriesFunctionSublinkSelect = SelectStmt({
      targetList: [ ResTarget(AExpr(0, '+', ColumnRef('buckets'), AConst(IntegerValue(1)))) ],
      fromClause: [ RangeVar('__stats') ]
    });

    const seriesFunctionArgs = [
      AConst(IntegerValue(1)),
      SubLink(4, seriesFunctionSublinkSelect)
    ];

    const seriesFunctionCall = FuncCall('generate_series', seriesFunctionArgs);
    const seriesFunction = RangeFunction([ [ seriesFunctionCall ] ], Alias('series'));

    const bucketWidthFunctionCallArgs = [
      TypeCast(TypeName([ StringValue('pg_catalog'), StringValue('float8') ]), ColumnRef('value')),
      SubLink(4, SelectStmt({targetList: [ ResTarget(ColumnRef('min_value')) ], fromClause: [ RangeVar('__stats') ]})),
      SubLink(4, SelectStmt({targetList: [ ResTarget(ColumnRef('max_value')) ], fromClause: [ RangeVar('__stats') ]})),
      SubLink(4, SelectStmt({targetList: [ ResTarget(ColumnRef('buckets')) ], fromClause: [ RangeVar('__stats') ]}))
    ];

    const bucketsSubqueryTargetList = [
      ResTarget(FuncCall('width_bucket', bucketWidthFunctionCallArgs), 'bucket'),
      ResTarget(FuncCall('count', [ AConst(IntegerValue(1)) ]), 'count'),
      ResTarget(FuncCall('min', [ ColumnRef('value') ]), 'min_value'),
      ResTarget(FuncCall('max', [ ColumnRef('value') ]), 'max_value'),
      ResTarget(FuncCall('avg', [ ColumnRef('value') ]), 'avg_value'),
      ResTarget(FuncCall('sum', [ ColumnRef('value') ]), 'sum_value')
    ];

    const bucketsSubqueryFromClause = [ RangeVar('__records') ];
    const bucketsSubqueryGroupClause = [ AConst(IntegerValue(1)) ];
    const bucketsSubquerySortClause = [ SortBy(AConst(IntegerValue(1)), 0, 0) ];

    const bucketsSubquery = SelectStmt({
      targetList: bucketsSubqueryTargetList,
      fromClause: bucketsSubqueryFromClause,
      groupClause: bucketsSubqueryGroupClause,
      sortClause: bucketsSubquerySortClause
    });

    const bucketsSubselect = RangeSubselect(bucketsSubquery, Alias('sub'));

    const joinExpr = JoinExpr(1,
                              seriesFunction,
                              bucketsSubselect,
                              AExpr(0, '=', ColumnRef('series', 'series'), ColumnRef('bucket', 'sub')));

    return SelectStmt({targetList, fromClause: [ joinExpr ], withClause});
  }

  toDistinctValuesAST(query, options = {}) {
    const valueColumn = query.ast ? ColumnRef(options.column.id) : columnRef(options.column);

    let targetList = null;

    const isLinkedRecord = options.column.element && options.column.element.isRecordLinkElement;

    if (isLinkedRecord) {
      targetList = [ ResTarget(ColumnRef('linked_record_id', '__join'), 'value') ];
    } else if (options.column.isArray) {
      targetList = [ ResTarget(FuncCall('unnest', [ valueColumn ]), 'value') ];
    } else {
      targetList = [ ResTarget(valueColumn, 'value') ];
    }

    targetList.push(ResTarget(FuncCall('count', [ AConst(IntegerValue(1)) ]), 'count'));

    if (isLinkedRecord) {
      targetList.push(ResTarget(ColumnRef('_title', '__linked'), 'label'));
    }

    const joins = query.joinColumns.map(o => o.join);

    if (options.column.join) {
      joins.push(options.column.join);
    }

    if (isLinkedRecord) {
      joins.push({inner: false,
                  tableName: `${query.form.id}/${options.column.element.key}`,
                  alias: '__join',
                  sourceColumn: '_record_id',
                  joinColumn: 'source_record_id'});

      joins.push({inner: false,
                  tableName: `${options.column.element.form.id}`,
                  alias: '__linked',
                  sourceTableName: '__join',
                  sourceColumn: 'linked_record_id',
                  joinColumn: '_record_id'});
    }

    const fromClause = this.fromClause(query, joins, [ options.column ]);

    // const whereClause = null; // options.all ? null : this.whereClause(query);
    // TODO(zhm) need to pass the bbox and search here?
    const whereClause = this.whereClause(query, null, null, options);

    const groupClause = [ AConst(IntegerValue(1)) ];

    if (isLinkedRecord) {
      groupClause.push(AConst(IntegerValue(3)));
    }

    const sortClause = [];

    if (options.by === 'frequency') {
      sortClause.push(SortBy(AConst(IntegerValue(2)), 2, 0));
    }

    if (isLinkedRecord) {
      sortClause.push(SortBy(AConst(IntegerValue(3)), 1, 0));
    }

    sortClause.push(SortBy(AConst(IntegerValue(1)), 1, 0));

    const limitClause = AConst(IntegerValue(MAX_DISTINCT_VALUES));

    return SelectStmt({targetList, fromClause, whereClause, groupClause, sortClause, limitClause});
  }

  toSummaryAST(query, columnSetting, {boundingBox, searchFilter}) {
    if (columnSetting.summary.aggregate === AggregateType.Histogram.name) {
      const histogramAttributes = {
        column: columnSetting.column,
        bucketSize: 12,
        type: columnSetting.column.isDate ? 'date' : 'number',
        sort: null,
        boundingBox,
        searchFilter
      };

      return this.toHistogramAST(query, histogramAttributes);
    }

    const targetList = this.summaryTargetList(query, columnSetting);

    const joins = query.joinColumns.map(o => o.join);

    if (columnSetting.column.join) {
      joins.push(columnSetting.column.join);
    }

    const fromClause = this.fromClause(query, joins, [ columnSetting.column ]);

    const whereClause = this.summaryWhereClause(query, columnSetting, {boundingBox, searchFilter});

    return SelectStmt({targetList, fromClause, whereClause});
  }

  histogramWithClause(column, bucketSize, type, query, boundingBox, searchFilter) {
    let recordsTargetList = null;

    if (type === 'date') {
      const datePartArgs = [
        AConst(StringValue('epoch')),
        TypeCast(TypeName('date'), columnRef(column))
      ];

      recordsTargetList = [ ResTarget(FuncCall('date_part', datePartArgs), 'value') ];
    } else {
      recordsTargetList = [ ResTarget(TypeCast(TypeName([ StringValue('pg_catalog'), StringValue('float8') ]), columnRef(column)), 'value') ];
    }

    const joins = query.joinColumnsWithSorting.map(o => o.join);

    const recordsFromClause = this.fromClause(query, joins, [ column ]);

    const recordsWhere = this.whereClause(query, boundingBox, searchFilter);
    const recordsSelect = SelectStmt({targetList: recordsTargetList, fromClause: recordsFromClause, whereClause: recordsWhere});
    const recordsExpr = CommonTableExpr('__records', recordsSelect);

    const statsTargetList = [
      ResTarget(AConst(IntegerValue(bucketSize)), 'buckets'),
      ResTarget(FuncCall('count', [ AConst(IntegerValue(1)) ]), 'count'),
      ResTarget(FuncCall('min', [ ColumnRef('value') ]), 'min_value'),
      ResTarget(FuncCall('max', [ ColumnRef('value') ]), 'max_value'),
      ResTarget(AExpr(0, '-', FuncCall('max', [ ColumnRef('value') ]), FuncCall('min', [ ColumnRef('value') ])), 'range'),
      ResTarget(AExpr(0, '/', AExpr(0, '-', TypeCast(TypeName([ StringValue('pg_catalog'), StringValue('float8') ]), FuncCall('max', [ ColumnRef('value') ])),
                                            TypeCast(TypeName([ StringValue('pg_catalog'), StringValue('float8') ]), FuncCall('min', [ ColumnRef('value') ]))),
                              AConst(FloatValue(bucketSize))), 'bucket_width')
    ];

    const statsFromClause = [ RangeVar('__records') ];
    const statsSelect = SelectStmt({targetList: statsTargetList, fromClause: statsFromClause});
    const statsExpr = CommonTableExpr('__stats', statsSelect);

    return WithClause([ recordsExpr, statsExpr ]);
  }

  toSchemaAST(query, {schemaOnly} = {}) {
    // wrap the query in a subquery with 1=0

    const targetList = [ ResTarget(ColumnRef(AStar())) ];
    const fromClause = [ RangeSubselect(query, Alias('wrapped')) ];
    const whereClause = schemaOnly ? AExpr(0, '=', AConst(IntegerValue(0)), AConst(IntegerValue(1)))
                                   : null;

    return SelectStmt({targetList, fromClause, whereClause});
  }

  limitOffset(pageSize, pageIndex) {
    if (pageSize != null && pageIndex != null) {
      return AConst(IntegerValue(+pageIndex * +pageSize));
    }

    return null;
  }

  limitCount(pageSize) {
    if (pageSize != null) {
      return AConst(IntegerValue(+pageSize));
    }

    return null;
  }

  targetList(query, sort, boundingBox) {
    const list = [
      ResTarget(ColumnRef(AStar()))
    ];

    const subJoinColumns = query.joinColumnsWithSorting;

    if (subJoinColumns.indexOf(query.schema.createdByColumn) !== -1) {
      list.push(ResTarget(ColumnRef('name', 'created_by'), 'created_by.name'));
    }

    if (subJoinColumns.indexOf(query.schema.updatedByColumn) !== -1) {
      list.push(ResTarget(ColumnRef('name', 'updated_by'), 'updated_by.name'));
    }

    if (subJoinColumns.indexOf(query.schema.assignedToColumn) !== -1) {
      list.push(ResTarget(ColumnRef('name', 'assigned_to'), 'assigned_to.name'));
    }

    if (subJoinColumns.indexOf(query.schema.projectColumn) !== -1) {
      list.push(ResTarget(ColumnRef('name', 'project'), 'project.name'));
    }

    list.push(ResTarget(FuncCall('row_number', null, {over: WindowDef(sort, 530)}), '__row_number'));

    return list;
  }

  fromClause(query, leftJoins = [], exactColumns) {
    let baseQuery = null;

    if (query.ast) {
      let queryAST = query.ast;

      const referencedColumns = query.referencedColumns.concat(exactColumns || []);

      // If there's an `exactColumn`, pick it out specifically with a guaranteed unique alias so it can be
      // referenced with certainty in outer queries. The following is an oversimplified example of the problem:
      //
      // if `id` is part of the table and needs to be references in the outer query, it must be called out specifically:
      //
      // INVALID:
      //   SELECT * FROM(SELECT *, *, * FROM table) WHERE id = ...
      //
      // VALID:
      //   SELECT * FROM(SELECT *, *, *, id AS __value FROM table) WHERE __value = ...
      //
      // Given arbitrary subqueries, we must be able to reference columns in them exactly even when there are duplicates.
      // We can't assume they're all simple ColumnRef's either. Some ResTarget's might be entire graphs of expressions which
      // needs to be duplicated to ensure uniqueness.
      if (referencedColumns.length) {
        queryAST = JSON.parse(JSON.stringify(queryAST));

        for (const column of referencedColumns) {
          Converter.duplicateResTargetWithExactName(query, queryAST.SelectStmt.targetList,
                                                    column, column.id);
        }
      }

      return [ RangeSubselect(queryAST, Alias('records')) ];
    }

    baseQuery = this.formQueryRangeVar(query);

    const visitedTables = {};

    if (leftJoins) {
      for (const join of leftJoins) {
        if (!visitedTables[join.alias]) {
          visitedTables[join.alias] = join;

          baseQuery = Converter.joinClause(baseQuery, join);
        }
      }
    }

    return [ baseQuery ];
  }

  whereClause(query, boundingBox, search, options = {}) {
    const systemParts = [];
    options = {...query.options || {}, ...options};

    const filterNode = this.nodeForCondition(query.filter, options);

    if (boundingBox) {
      systemParts.push(this.boundingBoxFilter(query, boundingBox));
    }

    if (search && search.trim().length) {
      systemParts.push(this.searchFilter(query, search));
    }

    systemParts.push(this.nodeForExpression(query.dateFilter, options));
    systemParts.push(this.createExpressionForColumnFilter(query.statusFilter, options));
    systemParts.push(this.createExpressionForColumnFilter(query.projectFilter, options));
    systemParts.push(this.createExpressionForColumnFilter(query.assignmentFilter, options));

    for (const item of query.columnSettings.columns) {
      if (item.hasFilter) {
        const expression = this.createExpressionForColumnFilter(item.filter, options);

        if (expression) {
          systemParts.push(expression);
        }
      }

      if (item.search) {
        if (item.column.isArray || item.column.isDate || item.column.isNumber) {
          systemParts.push(AExpr(8, '~~*', TypeCast(TypeName('text'), columnRef(item.column)),
                                           AConst(StringValue('%' + this.escapeLikePercent(item.search) + '%'))));
        } else {
          systemParts.push(AExpr(8, '~~*', columnRef(item.column),
                                           AConst(StringValue('%' + this.escapeLikePercent(item.search) + '%'))));
        }
      }

      if (item.expression.isValid) {
        systemParts.push(this.nodeForExpression(item.expression, options));
      }

      if (item.range.isValid) {
        systemParts.push(this.nodeForExpression(item.range, options));
      }
    }

    if (options.expressions) {
      systemParts.push.apply(systemParts, options.expressions);
    }

    const expressions = systemParts.filter(o => o != null);

    if (filterNode && expressions.length) {
      return BoolExpr(0, [ filterNode, ...expressions ]);
    } else if (expressions.length) {
      return BoolExpr(0, [ ...expressions ]);
    }

    return filterNode;
  }

  static joinClause(baseQuery, {inner, tableName, alias, sourceColumn, joinColumn, sourceTableName}) {
    return JoinExpr(inner ? 0 : 1,
                    baseQuery,
                    RangeVar(tableName, Alias(alias)),
                    AExpr(0, '=', ColumnRef(sourceColumn, sourceTableName || 'records'), ColumnRef(joinColumn, alias)));
  }

  static duplicateResTargetWithExactName(query, targetList, column, exactName) {
    let resTarget = Converter.findResTarget(query, column);

    // If a column is referenced more than once don't add it again
    for (const existing of targetList) {
      if (existing.ResTarget.name === exactName) {
        return;
      }
    }

    // If we found a matching restarget, copy the entire node and give it a new name
    if (resTarget) {
      resTarget = JSON.parse(JSON.stringify(resTarget));
      resTarget.ResTarget.name = exactName;
    } else {
      resTarget = ResTarget(ColumnRef(column.columnName, column.source), exactName);
    }

    targetList.push(resTarget);
  }

  static findResTarget(query, column) {
    // UNION's don't have targetList's
    if (!query.ast.SelectStmt.targetList) {
      return null;
    }

    // look for any A_Star nodes, a SELECT * modifies how we process the res targets. If there's
    // an A_Star node in the targetList, it means that we can't just get the column by index because
    // the * might expand to columns that cause the indexes to be different.
    const hasStar = query.ast.SelectStmt.targetList.find((target) => {
      return target.ResTarget &&
             target.ResTarget.val &&
             target.ResTarget.val.ColumnRef &&
             target.ResTarget.val.ColumnRef.fields &&
             target.ResTarget.val.ColumnRef.fields[0] &&
             target.ResTarget.val.ColumnRef.fields[0].A_Star;
    });

    // the simple case is when there is no * in the query
    if (!hasStar && query.ast.SelectStmt.targetList.length === query.schema.columns.length) {
      return query.ast.SelectStmt.targetList[column.index];
    }

    // Find the ResTarget node by name, or else return null, which means the column
    // must be coming from a * node and we can just use a simple ResTarget + ColumnRef
    return query.ast.SelectStmt.targetList.find((target) => {
      return target.ResTarget.name === column.name;
    });
  }

  formQueryRangeVar(query) {
    if (query.repeatableKey) {
      return RangeVar(query.form.id + '/' + query.repeatableKey + '/_full', Alias('records'));
    }

    return RangeVar(query.form.id + '/_full', Alias('records'));
  }

  createExpressionForColumnFilter(filter, options) {
    let expression = null;

    if (filter === options.except) {
      return null;
    }

    if (filter.hasValues) {
      let hasNull = false;
      const values = [];

      filter.value.forEach(v => {
        if (v != null) {
          values.push(v);
        } else {
          hasNull = true;
        }
      });

      if (values.length) {
        if (filter.column.isArray) {
          expression = this.AnyOf(filter.column, values);
        } else {
          expression = this.In(filter.column, values);
        }

        if (hasNull) {
          expression = BoolExpr(1, [ NullTest(0, columnRef(filter.column)), expression ]);
        }
      } else if (hasNull) {
        expression = NullTest(0, columnRef(filter.column));
      }
    } else if (filter.isEmptySet) {
      // add 1 = 0 clause to return 0 rows
      expression = AExpr(0, '=', AConst(IntegerValue(1)),
                                 AConst(IntegerValue(0)));
    }

    return expression;
  }

  boundingBoxFilter(query, boundingBox) {
    const args = [
      AConst(FloatValue(boundingBox[0])),
      AConst(FloatValue(boundingBox[1])),
      AConst(FloatValue(boundingBox[2])),
      AConst(FloatValue(boundingBox[3])),
      AConst(IntegerValue(4326))
    ];

    const rhs = FuncCall('st_makeenvelope', args);

    const columnName = query.ast ? '__geometry' : '_geometry';

    return AExpr(0, '&&', ColumnRef(columnName), rhs);
  }

  escapeLikePercent(value) {
    return value.replace(/\%/g, '\\%').replace(/_/g, '\\_%');
  }

  searchFilter(query, search) {
    /*
       Search takes the general form:

       SELECT ...
       FROM ...
       WHERE
         _record_index @@ to_tsquery('english', '''bacon'':*'::tsquery::text) AND
         _record_index_text ILIKE '%bacon%'

       NB: The awkward cast through a text type is to properly escape raw user input as a tsquery.

       For example:
         to_tsquery('Nor:*') vs 'Nor:*'::tsquery

       Also, the ILIKE handles further reduces the resultset to exact matches which is what Fulcrum
       users more often expect. The general idea is to use the FTS index to massively reduce the result
       set before applying the much slower ILIKE operation. So, we can reduce the result very quickly
       with the tsvector index first, and then only run the ILIKE on what's left.
    */

    search = search.trim();

    // if it's a fully custom SQL statement, use a simpler form with no index
    if (query.ast) {
      return AExpr(8, '~~*', TypeCast(TypeName('text'), ColumnRef('records')),
                             AConst(StringValue('%' + this.escapeLikePercent(search) + '%')));
    }

    const toTsQuery = (dictionary, term) => {
      const args = [ AConst(StringValue(dictionary)), AConst(StringValue("'" + term + "':*")) ];

      return FuncCall('to_tsquery', args);
    };

    const makeTsQueryCall = (term) => {
      return toTsQuery(term.length > 3 ? 'english' : 'simple',
                       term.toLowerCase().replace(/'/g, "''"));
    };

    const terms = search.split(' ').filter(s => s.trim().length);

    let term = terms.shift();

    let tsQueries = makeTsQueryCall(term);

    while (terms.length) {
      term = terms.shift();
      tsQueries = AExpr(0, '&&', tsQueries, makeTsQueryCall(term));
    }

    const ftsExpression = AExpr(0, '@@', ColumnRef('_record_index'), tsQueries);

    const ilikeExpression = AExpr(8, '~~*', ColumnRef('_record_index_text'),
                                  AConst(StringValue('%' + this.escapeLikePercent(search) + '%')));

    const andArgs = [
      ftsExpression,
      ilikeExpression
    ];

    return BoolExpr(0, andArgs);
  }

  summaryWhereClause(query, columnSetting, {boundingBox, searchFilter}) {
    const expressions = [];

    const converters = {
      [AggregateType.Empty.name]: () => {
        return NullTest(0, columnRef(columnSetting.column));
      },
      [AggregateType.NotEmpty.name]: () => {
        return NullTest(1, columnRef(columnSetting.column));
      },
      [AggregateType.PercentEmpty.name]: () => {
        return NullTest(0, columnRef(columnSetting.column));
      },
      [AggregateType.PercentNotEmpty.name]: () => {
        return NullTest(1, columnRef(columnSetting.column));
      }
    };

    const expressionConverter = converters[columnSetting.summary.aggregate];

    if (expressionConverter) {
      expressions.push(expressionConverter());
    }

    return this.whereClause(query, boundingBox, searchFilter, {expressions});
  }

  summaryTargetList(query, columnSetting) {
    const simpleFunctionResTarget = (funcName, param) => {
      return () => {
        return [ ResTarget(FuncCall(funcName, [ param || columnRef(columnSetting.column) ]), 'value') ];
      };
    };

    const converter = {
      [AggregateType.Sum.name]: simpleFunctionResTarget('sum'),
      [AggregateType.Average.name]: simpleFunctionResTarget('avg'),
      [AggregateType.Min.name]: simpleFunctionResTarget('min'),
      [AggregateType.Max.name]: simpleFunctionResTarget('max'),
      [AggregateType.StdDev.name]: simpleFunctionResTarget('stddev'),
      [AggregateType.Histogram.name]: simpleFunctionResTarget('count'),
      [AggregateType.Empty.name]: simpleFunctionResTarget('count', AConst(IntegerValue(1))),
      [AggregateType.NotEmpty.name]: simpleFunctionResTarget('count', AConst(IntegerValue(1))),
      [AggregateType.Unique.name]: () => {
        return [ ResTarget(FuncCall('count', [ columnRef(columnSetting.column) ], {agg_distinct: true}), 'value') ];
      },
      [AggregateType.PercentEmpty.name]: simpleFunctionResTarget('count'),
      [AggregateType.PercentNotEmpty.name]: simpleFunctionResTarget('count'),
      [AggregateType.PercentUnique.name]: simpleFunctionResTarget('count')
    };

    return converter[columnSetting.summary.aggregate]();
  }

  nodeForExpressions(expressions, options) {
    return expressions.map(e => this.nodeForExpression(e, options))
                      .filter(e => e);
  }

  nodeForCondition(condition, options) {
    const converter = {
      [ConditionType.And]: this.AndConverter,
      [ConditionType.Or]: this.OrConverter,
      [ConditionType.Not]: this.NotConverter
    };

    return converter[condition.type](condition, options);
  }

  nodeForExpression(expression, options) {
    if (expression.expressions) {
      return this.nodeForCondition(expression, options);
    }

    if (expression === options.except) {
      return null;
    }

    const converter = {
      [OperatorType.Empty.name]: this.EmptyConverter,
      [OperatorType.NotEmpty.name]: this.NotEmptyConverter,
      [OperatorType.Equal.name]: this.EqualConverter,
      [OperatorType.NotEqual.name]: this.NotEqualConverter,
      [OperatorType.GreaterThan.name]: this.GreaterThanConverter,
      [OperatorType.GreaterThanOrEqual.name]: this.GreaterThanOrEqualConverter,
      [OperatorType.LessThan.name]: this.LessThanConverter,
      [OperatorType.LessThanOrEqual.name]: this.LessThanOrEqualConverter,
      [OperatorType.Between.name]: this.BetweenConverter,
      [OperatorType.NotBetween.name]: this.NotBetweenConverter,
      [OperatorType.In.name]: this.InConverter,
      [OperatorType.NotIn.name]: this.NotInConverter,
      [OperatorType.TextContain.name]: this.TextContainConverter,
      [OperatorType.TextNotContain.name]: this.TextNotContainConverter,
      [OperatorType.TextStartsWith.name]: this.TextStartsWithConverter,
      [OperatorType.TextEndsWith.name]: this.TextEndsWithConverter,
      [OperatorType.TextEqual.name]: this.TextEqualConverter,
      [OperatorType.TextNotEqual.name]: this.TextNotEqualConverter,
      [OperatorType.TextMatch.name]: this.TextMatchConverter,
      [OperatorType.TextNotMatch.name]: this.TextNotMatchConverter,
      [OperatorType.DateEqual.name]: this.EqualConverter,
      [OperatorType.DateNotEqual.name]: this.NotEqualConverter,
      [OperatorType.DateAfter.name]: this.GreaterThanConverter,
      [OperatorType.DateOnOrAfter.name]: this.GreaterThanOrEqualConverter,
      [OperatorType.DateBefore.name]: this.LessThanConverter,
      [OperatorType.DateOnOrBefore.name]: this.LessThanOrEqualConverter,
      [OperatorType.DateBetween.name]: this.BetweenConverter,
      [OperatorType.DateNotBetween.name]: this.NotBetweenConverter,
      [OperatorType.ArrayAnyOf.name]: this.ArrayAnyOfConverter,
      [OperatorType.ArrayAllOf.name]: this.ArrayAllOfConverter,
      [OperatorType.ArrayEqual.name]: this.ArrayEqualConverter,
      [OperatorType.Search.name]: this.SearchConverter,
      [OperatorType.DateToday.name]: this.DynamicDateConverter,
      [OperatorType.DateYesterday.name]: this.DynamicDateConverter,
      [OperatorType.DateTomorrow.name]: this.DynamicDateConverter,
      [OperatorType.DateLast7Days.name]: this.DynamicDateConverter,
      [OperatorType.DateLast30Days.name]: this.DynamicDateConverter,
      [OperatorType.DateLast90Days.name]: this.DynamicDateConverter,
      [OperatorType.DateLastMonth.name]: this.DynamicDateConverter,
      [OperatorType.DateLastYear.name]: this.DynamicDateConverter,
      [OperatorType.DateNextWeek.name]: this.DynamicDateConverter,
      [OperatorType.DateNextMonth.name]: this.DynamicDateConverter,
      [OperatorType.DateNextYear.name]: this.DynamicDateConverter,
      [OperatorType.DateCurrentCalendarWeek.name]: this.DynamicDateConverter,
      [OperatorType.DateCurrentCalendarMonth.name]: this.DynamicDateConverter,
      [OperatorType.DateCurrentCalendarYear.name]: this.DynamicDateConverter,
      [OperatorType.DatePreviousCalendarWeek.name]: this.DynamicDateConverter,
      [OperatorType.DatePreviousCalendarMonth.name]: this.DynamicDateConverter,
      [OperatorType.DatePreviousCalendarYear.name]: this.DynamicDateConverter,
      [OperatorType.DateNextCalendarWeek.name]: this.DynamicDateConverter,
      [OperatorType.DateNextCalendarMonth.name]: this.DynamicDateConverter,
      [OperatorType.DateNextCalendarYear.name]: this.DynamicDateConverter,
      [OperatorType.DateDaysFromNow.name]: this.DynamicDateConverter,
      [OperatorType.DateWeeksFromNow.name]: this.DynamicDateConverter,
      [OperatorType.DateMonthsFromNow.name]: this.DynamicDateConverter,
      [OperatorType.DateYearsFromNow.name]: this.DynamicDateConverter,
      [OperatorType.DateDaysAgo.name]: this.DynamicDateConverter,
      [OperatorType.DateWeeksAgo.name]: this.DynamicDateConverter,
      [OperatorType.DateMonthsAgo.name]: this.DynamicDateConverter,
      [OperatorType.DateYearsAgo.name]: this.DynamicDateConverter
    };

    if (!expression.isValid) {
      return null;
    }

    return converter[expression.operator](expression, options);
  }

  BooleanConverter = (type, condition, options) => {
    const args = this.nodeForExpressions(condition.expressions, options);

    if (args && args.length) {
      return BoolExpr(type, args);
    }

    return null;
  }

  AndConverter = (condition, options) => {
    return this.BooleanConverter(0, condition, options);
  }

  OrConverter = (condition, options) => {
    return this.BooleanConverter(1, condition, options);
  }

  NotConverter = (condition, options) => {
    if (condition.expressions.length > 1) {
      return BoolExpr(2, [ this.BooleanConverter(0, condition, options) ]);
    }

    return this.BooleanConverter(2, condition, options);
  }

  NotEmptyConverter = (expression) => {
    return NullTest(1, columnRef(expression.column));
  }

  EmptyConverter = (expression) => {
    return NullTest(0, columnRef(expression.column));
  }

  EqualConverter = (expression) => {
    return this.BinaryConverter(0, '=', expression);
  }

  NotEqualConverter = (expression) => {
    return this.BinaryConverter(0, '<>', expression);
  }

  GreaterThanConverter = (expression) => {
    return this.BinaryConverter(0, '>', expression);
  }

  GreaterThanOrEqualConverter = (expression) => {
    return this.BinaryConverter(0, '>=', expression);
  }

  LessThanConverter = (expression) => {
    return this.BinaryConverter(0, '<', expression);
  }

  LessThanOrEqualConverter = (expression) => {
    return this.BinaryConverter(0, '<=', expression);
  }

  BetweenConverter = (expression, options) => {
    let value1 = expression.value1;
    let value2 = expression.value2;

    if (expression.isDateOperator) {
      value1 = value1 && this.ConvertDateValue(this.GetDate(value1, options).startOf('day'));
      value2 = value2 && this.ConvertDateValue(this.GetDate(value2, options).endOf('day'));
    }

    return this.Between(expression.column, value1, value2);
  }

  NotBetweenConverter = (expression, options) => {
    let value1 = expression.value1;
    let value2 = expression.value2;

    if (expression.isDateOperator) {
      value1 = value1 && this.ConvertDateValue(this.GetDate(value1, options).startOf('day'));
      value2 = value2 && this.ConvertDateValue(this.GetDate(value2, options).endOf('day'));
    }

    return this.NotBetween(expression.column, value1, value2);
  }

  InConverter = (expression) => {
    return this.In(expression.column, expression.value);
  }

  NotInConverter = (expression) => {
    const values = expression.value.map(v => this.ConstValue(expression.column, v));

    return AExpr(6, '<>', columnRef(expression.column),
                 values);
  }

  BinaryConverter = (kind, operator, expression) => {
    return AExpr(kind, operator, columnRef(expression.column),
                 this.ConstValue(expression.column, expression.scalarValue));
  }

  FieldConverter = (expression) => {
    return ColumnRef(expression.name);
  }

  ConstantConverter = (expression) => {
    return this.ConstValue(expression.column, expression.scalarValue);
  }

  TextEqualConverter = (expression) => {
    return AExpr(8, '~~*', columnRef(expression.column),
                 this.ConstValue(expression.column, expression.scalarValue));
  }

  TextNotEqualConverter = (expression) => {
    return AExpr(8, '!~~*', columnRef(expression.column),
                 this.ConstValue(expression.column, expression.scalarValue));
  }

  TextContainConverter = (expression) => {
    return AExpr(8, '~~*', columnRef(expression.column),
                 AConst(StringValue('%' + this.escapeLikePercent(expression.scalarValue) + '%')));
  }

  TextNotContainConverter = (expression) => {
    return AExpr(8, '!~~*', columnRef(expression.column),
                 AConst(StringValue('%' + this.escapeLikePercent(expression.scalarValue) + '%')));
  }

  TextStartsWithConverter = (expression) => {
    return AExpr(8, '~~*', columnRef(expression.column),
                 AConst(StringValue(this.escapeLikePercent(expression.scalarValue) + '%')));
  }

  TextEndsWithConverter = (expression) => {
    return AExpr(8, '~~*', columnRef(expression.column),
                 AConst(StringValue('%' + this.escapeLikePercent(expression.scalarValue))));
  }

  TextMatchConverter = (expression) => {
    return AExpr(0, '~*', columnRef(expression.column),
                 AConst(StringValue(expression.scalarValue)));
  }

  TextNotMatchConverter = (expression) => {
    return AExpr(0, '!~*', columnRef(expression.column),
                 AConst(StringValue(expression.scalarValue)));
  }

  ArrayAnyOfConverter = (expression) => {
    return this.AnyOf(expression.column, expression.value);
  }

  ArrayAllOfConverter = (expression) => {
    const values = AArrayExpr(expression.value.map(v => this.ConstValue(expression.column, v)));

    return AExpr(0, '@>', columnRef(expression.column),
                 values);
  }

  ArrayEqualConverter = (expression) => {
    const values = AArrayExpr(expression.value.map(v => this.ConstValue(expression.column, v)));

    const a = AExpr(0, '<@', columnRef(expression.column),
                    values);

    const b = AExpr(0, '@>', columnRef(expression.column),
                    values);

    return BoolExpr(0, [ a, b ]);
  }

  SearchConverter = (expression) => {
    const rhs = FuncCall('to_tsquery', [ this.ConstValue(expression.column, expression.scalarValue) ]);

    return AExpr(0, '@@', columnRef(expression.column),
                 rhs);
  }

  DynamicDateConverter = (expression, options) => {
    // Let the caller specify the timezone to be used for dynamic date calculations. This
    // makes sure when the browser calculates a dynamic range, the server would calculate
    // the same range. So 'Today' is midnight to midnight in the user's local time. It would
    // be much less useful and confusing if we forced "Today" to always be London's today.
    const now = this.GetDate(null, options);

    const range = calculateDateRange(expression.operator, expression.value, now);

    const value1 = this.ConvertDateValue(range[0]);
    const value2 = this.ConvertDateValue(range[1]);

    return this.Between(expression.column, value1, value2);
  }

  NotBetween = (column, value1, value2) => {
    if (value1 != null && value2 != null) {
      return AExpr(11, 'NOT BETWEEN', columnRef(column), [ this.ConstValue(column, value1), this.ConstValue(column, value2) ]);
    } else if (value1 != null) {
      return AExpr(0, '<', columnRef(column), this.ConstValue(column, value1));
    } else if (value2 != null) {
      return AExpr(0, '>', columnRef(column), this.ConstValue(column, value2));
    }

    return null;
  }

  AnyOf = (column, values) => {
    const arrayValues = AArrayExpr(values.map(v => this.ConstValue(column, v)));

    return AExpr(0, '&&', columnRef(column), arrayValues);
  }

  In = (column, values) => {
    const arrayValues = values.map(v => this.ConstValue(column, v));

    return AExpr(6, '=', columnRef(column), arrayValues);
  }

  Between = (column, value1, value2) => {
    if (value1 != null && value2 != null) {
      return AExpr(10, 'BETWEEN', columnRef(column), [ this.ConstValue(column, value1), this.ConstValue(column, value2) ]);
    } else if (value1 != null) {
      return AExpr(0, '>=', columnRef(column), this.ConstValue(column, value1));
    } else if (value2 != null) {
      return AExpr(0, '<=', columnRef(column), this.ConstValue(column, value2));
    }

    return null;
  }

  ConstValue = (column, value) => {
    if (value == null) {
      return null;
    }

    if (column.isInteger) {
      return AConst(IntegerValue(value));
    }

    if (column.isNumber) {
      return AConst(FloatValue(value));
    }

    return AConst(StringValue(value));
  }

  GetDate = (date, options) => {
    const timeZone = (options && options.timeZone) || moment.tz.guess();

    return moment(date || new Date()).tz(timeZone);
  }

  ConvertDateValue = (date) => {
    if (date) {
      return date.clone().toISOString();
    }
    return null;
  }
}
