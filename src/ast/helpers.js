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
      op: 0
    }
  };
}

export function StringValue(value) {
  return {
    String: {
      str: value != null ? value.toString() : null
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
      str: value != null ? value.toString() : ''
    }
  };
}

export function Alias(name) {
  return {
    Alias: {
      aliasname: name
    }
  };
}

export function RangeVar(name, alias) {
  return {
    RangeVar: {
      relname: name,
      inhOpt: 2,
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
    TypeName: {
      names: typeof names === 'string' ? [ StringValue(names) ] : names,
      typemod: mod
    }
  };
}

export function JoinExpr(type, larg, rarg, quals) {
  return {
    JoinExpr: {
      jointype: type,
      larg: larg,
      rarg: rarg,
      quals: quals
    }
  };
}

export function AConst(value) {
  return {
    A_Const: {
      val: value
    }
  };
}

export function AStar() {
  return {
    A_Star: {}
  };
}

export function BoolExpr(op, args) {
  return {
    BoolExpr: {
      boolop: op,
      args: args
    }
  };
}

export function BooleanTest(arg, booltesttype) {
  return {
    BooleanTest: {
      arg: arg,
      booltesttype: booltesttype
    }
  };
}

export function AExpr(kind, name, lexpr, rexpr) {
  return {
    A_Expr: {
      kind: kind,
      name: [ StringValue(name) ],
      lexpr: lexpr,
      rexpr: rexpr
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

export function SortBy(node, direction, nulls) {
  return {
    SortBy: {
      node: node,
      sortby_dir: direction,
      sortby_nulls: nulls
    }
  };
}

// 0 : IS NULL
// 1 : IS NOT NULL
export function NullTest(type, arg) {
  return {
    NullTest: {
      arg: arg,
      nulltesttype: type
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

export function SubLink(type, subselect) {
  return {
    SubLink: {
      subLinkType: type,
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
