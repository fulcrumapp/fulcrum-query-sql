export function SelectStmt({ targetList, fromClause, whereClause, sortClause, limitOffset, limitCount, groupClause, withClause }: {
    targetList: any;
    fromClause: any;
    whereClause: any;
    sortClause: any;
    limitOffset: any;
    limitCount: any;
    groupClause: any;
    withClause: any;
}): {
    SelectStmt: {
        targetList: any;
        fromClause: any;
        whereClause: any;
        sortClause: any;
        limitOffset: any;
        limitCount: any;
        groupClause: any;
        withClause: any;
        op: number;
    };
};
export function StringValue(value: any): {
    String: {
        str: any;
    };
};
export function IntegerValue(value: any): {
    Integer: {
        ival: number | null;
    };
};
export function FloatValue(value: any): {
    Float: {
        str: any;
    };
};
export function Alias(name: any): {
    Alias: {
        aliasname: any;
    };
};
export function RangeVar(name: any, alias: any): {
    RangeVar: {
        relname: any;
        inhOpt: number;
        relpersistence: string;
        alias: any;
    };
};
export function ResTarget(node: any, name?: null): {
    ResTarget: {
        name: null;
        val: any;
    };
};
export function FuncCall(name: any, args: any, options: any): {
    FuncCall: any;
};
export function WindowDef(orderClause: any, frameOptions: any): {
    WindowDef: {
        orderClause: any;
        frameOptions: any;
    };
};
export function ColumnRef(name: any, source: any): {
    ColumnRef: {
        fields: any[];
    };
};
export function TypeCast(typeName: any, arg: any): {
    TypeCast: {
        arg: any;
        typeName: any;
    };
};
export function TypeName(names: any, mod: any): {
    TypeName: {
        names: any;
        typemod: any;
    };
};
export function JoinExpr(type: any, larg: any, rarg: any, quals: any): {
    JoinExpr: {
        jointype: any;
        larg: any;
        rarg: any;
        quals: any;
    };
};
export function AConst(value: any): {
    A_Const: {
        val: any;
    };
};
export function AStar(): {
    A_Star: {};
};
export function BoolExpr(op: any, args: any): {
    BoolExpr: {
        boolop: any;
        args: any;
    };
};
export function BooleanTest(arg: any, booltesttype: any): {
    BooleanTest: {
        arg: any;
        booltesttype: any;
    };
};
export function AExpr(kind: any, name: any, lexpr: any, rexpr: any): {
    A_Expr: {
        kind: any;
        name: {
            String: {
                str: any;
            };
        }[];
        lexpr: any;
        rexpr: any;
    };
};
export function RangeSubselect(subquery: any, alias: any): {
    RangeSubselect: {
        subquery: any;
        alias: any;
    };
};
export function AArrayExpr(values: any): {
    A_ArrayExpr: {
        elements: any;
    };
};
export function SortBy(node: any, direction: any, nulls: any): {
    SortBy: {
        node: any;
        sortby_dir: any;
        sortby_nulls: any;
    };
};
export function NullTest(type: any, arg: any): {
    NullTest: {
        arg: any;
        nulltesttype: any;
    };
};
export function WithClause(ctes: any): {
    WithClause: {
        ctes: any;
    };
};
export function CommonTableExpr(name: any, query: any): {
    CommonTableExpr: {
        ctename: any;
        ctequery: any;
    };
};
export function RangeFunction(functions: any, alias: any): {
    RangeFunction: {
        functions: any;
        alias: any;
    };
};
export function SubLink(type: any, subselect: any): {
    SubLink: {
        subLinkType: any;
        subselect: any;
    };
};
export function CoalesceExpr(args: any): {
    CoalesceExpr: {
        args: any;
    };
};
