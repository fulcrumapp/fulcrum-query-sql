export function SelectStmt({targetList, fromClause, whereClause, sortClause, limitOffset, limitCount, groupClause, withClause}) {
  return {
    SelectStmt: {
      targetList: targetList,
      fromClause: fromClause,
      whereClause: whereClause,
      sortClause: sortClause,
      limitOffset: limitOffset,
      limitCount: limitCount,
      groupClause: groupClause,
      withClause: withClause,
      limitOption: 'LIMIT_OPTION_DEFAULT',
      op: 'SETOP_NONE'
    }
  };
}

export function StringValue(value) {
  return {
    String: {
      sval: value != null ? value.toString() : null
    }
  };
}

export function IntegerValue(value) {
  return {
    Integer: {
      ival: value != null ? +value : null
    }
  };
}

export function FloatValue(value) {
  return {
    Float: {
      fval: value != null ? value.toString() : ''
    }
  };
}

export function Alias(name) {
  return {
    aliasname: name
  };
}

export function RangeVar(name, alias) {
  return {
    RangeVar: {
      relname: name,
      inh: true,
      relpersistence: 'p',
      alias: alias
    }
  };
}

export function ResTarget(node, name = null) {
  return {
    ResTarget: {
      name: name,
      val: node
    }
  };
}

export function FuncCall(name, args, options) {
  return {
    FuncCall: {
      funcname: Array.isArray(name) ? name : [ StringValue(name) ],
      args: args,
      ...options
    }
  };
}

export function WindowDef(orderClause, frameOptions) {
  return {
    WindowDef: {
      orderClause: orderClause,
      frameOptions: frameOptions
    }
  };
}

export function ColumnRef(name, source) {
  const nameValue = typeof name === 'string' ? StringValue(name) : name;

  const fields = source ? [ StringValue(source), nameValue ]
                        : [ nameValue ];

  return {
    ColumnRef: {
      fields: fields
    }
  };
}

export function TypeCast(typeName, arg) {
  return {
    TypeCast: {
      arg: arg,
      typeName: typeName
    }
  };
}

export function TypeName(names, mod) {
  return {
    names: typeof names === 'string' ? [ StringValue(names) ] : names,
    typemod: mod != null ? mod : -1
  };
}

const JOIN_TYPE_MAP = { 0: 'JOIN_INNER', 1: 'JOIN_LEFT', 2: 'JOIN_FULL', 3: 'JOIN_RIGHT', 4: 'JOIN_SEMI', 5: 'JOIN_ANTI', 6: 'JOIN_RIGHT_ANTI' };

export function JoinExpr(type, larg, rarg, quals) {
  return {
    JoinExpr: {
      jointype: typeof type === 'string' ? type : (JOIN_TYPE_MAP[type] || type),
      larg: larg,
      rarg: rarg,
      quals: quals
    }
  };
}

export function AConst(value) {
  // pgsql-parser v17 expects A_Const to have direct sval/ival/fval keys
  // instead of the old { val: { String/Integer/Float: {...} } } wrapper.
  if (value && value.String) {
    return { A_Const: { sval: { sval: value.String.sval } } };
  }
  if (value && value.Integer) {
    return { A_Const: { ival: { ival: value.Integer.ival } } };
  }
  if (value && value.Float) {
    return { A_Const: { fval: { fval: value.Float.fval } } };
  }
  // fallback: pass through as-is
  return { A_Const: value };
}

export function NullConst() {
  return { A_Const: { isnull: true } };
}

export function AStar() {
  return {
    A_Star: {}
  };
}

const BOOL_OP_MAP = { 0: 'AND_EXPR', 1: 'OR_EXPR', 2: 'NOT_EXPR' };

export function BoolExpr(op, args) {
  return {
    BoolExpr: {
      boolop: typeof op === 'string' ? op : (BOOL_OP_MAP[op] || op),
      args: args
    }
  };
}

const BOOL_TEST_MAP = { 0: 'IS_TRUE', 1: 'IS_NOT_TRUE', 2: 'IS_FALSE', 3: 'IS_NOT_FALSE', 4: 'IS_UNKNOWN', 5: 'IS_NOT_UNKNOWN' };

export function BooleanTest(arg, booltesttype) {
  return {
    BooleanTest: {
      arg: arg,
      booltesttype: typeof booltesttype === 'string' ? booltesttype : (BOOL_TEST_MAP[booltesttype] || booltesttype)
    }
  };
}

const AEXPR_KIND_MAP = { 0: 'AEXPR_OP', 1: 'AEXPR_OP_ANY', 2: 'AEXPR_OP_ALL', 3: 'AEXPR_DISTINCT', 4: 'AEXPR_NOT_DISTINCT', 5: 'AEXPR_NULLIF', 6: 'AEXPR_IN', 7: 'AEXPR_LIKE', 8: 'AEXPR_ILIKE', 9: 'AEXPR_SIMILAR', 10: 'AEXPR_BETWEEN', 11: 'AEXPR_NOT_BETWEEN', 12: 'AEXPR_BETWEEN_SYM', 13: 'AEXPR_NOT_BETWEEN_SYM' };

export function AExpr(kind, name, lexpr, rexpr) {
  const mappedKind = typeof kind === 'string' ? kind : (AEXPR_KIND_MAP[kind] || kind);

  // For IN/BETWEEN/NOT_BETWEEN, rexpr must be a List node
  let finalRexpr = rexpr;
  if (Array.isArray(rexpr) && (mappedKind === 'AEXPR_IN' || mappedKind === 'AEXPR_BETWEEN' || mappedKind === 'AEXPR_NOT_BETWEEN')) {
    finalRexpr = { List: { items: rexpr } };
  }

  return {
    A_Expr: {
      kind: mappedKind,
      name: [ StringValue(name) ],
      lexpr: lexpr,
      rexpr: finalRexpr
    }
  };
}

export function RangeSubselect(subquery, alias) {
  return {
    RangeSubselect: {
      subquery: subquery,
      alias: alias
    }
  };
}

export function AArrayExpr(values) {
  return {
    A_ArrayExpr: {
      elements: values
    }
  };
}

const SORTBY_DIR_MAP = { 0: 'SORTBY_DEFAULT', 1: 'SORTBY_ASC', 2: 'SORTBY_DESC' };
const SORTBY_NULLS_MAP = { 0: 'SORTBY_NULLS_DEFAULT', 1: 'SORTBY_NULLS_FIRST', 2: 'SORTBY_NULLS_LAST' };

export function SortBy(node, direction, nulls) {
  return {
    SortBy: {
      node: node,
      sortby_dir: typeof direction === 'string' ? direction : (SORTBY_DIR_MAP[direction] || direction),
      sortby_nulls: typeof nulls === 'string' ? nulls : (SORTBY_NULLS_MAP[nulls] || nulls)
    }
  };
}

const NULL_TEST_MAP = { 0: 'IS_NULL', 1: 'IS_NOT_NULL' };

// 0 : IS NULL
// 1 : IS NOT NULL
export function NullTest(type, arg) {
  return {
    NullTest: {
      arg: arg,
      nulltesttype: typeof type === 'string' ? type : (NULL_TEST_MAP[type] || type)
    }
  };
}

export function WithClause(ctes) {
  return {
    WithClause: {
      ctes: ctes
    }
  };
}

export function CommonTableExpr(name, query) {
  return {
    CommonTableExpr: {
      ctename: name,
      ctequery: query
    }
  };
}

export function RangeFunction(functions, alias) {
  return {
    RangeFunction: {
      functions: functions,
      alias: alias
    }
  };
}

const SUBLINK_TYPE_MAP = { 0: 'EXISTS_SUBLINK', 1: 'ALL_SUBLINK', 2: 'ANY_SUBLINK', 3: 'ROWCOMPARE_SUBLINK', 4: 'EXPR_SUBLINK', 5: 'MULTIEXPR_SUBLINK', 6: 'ARRAY_SUBLINK', 7: 'CTE_SUBLINK' };

export function SubLink(type, subselect) {
  return {
    SubLink: {
      subLinkType: typeof type === 'string' ? type : (SUBLINK_TYPE_MAP[type] || type),
      subselect: subselect
    }
  };
}

export function CoalesceExpr(args) {
  return {
    CoalesceExpr: {
      args: args
    }
  };
}
