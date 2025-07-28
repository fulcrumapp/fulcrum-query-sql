"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectStmt = SelectStmt;
exports.StringValue = StringValue;
exports.IntegerValue = IntegerValue;
exports.FloatValue = FloatValue;
exports.Alias = Alias;
exports.RangeVar = RangeVar;
exports.ResTarget = ResTarget;
exports.FuncCall = FuncCall;
exports.WindowDef = WindowDef;
exports.ColumnRef = ColumnRef;
exports.TypeCast = TypeCast;
exports.TypeName = TypeName;
exports.JoinExpr = JoinExpr;
exports.AConst = AConst;
exports.AStar = AStar;
exports.BoolExpr = BoolExpr;
exports.BooleanTest = BooleanTest;
exports.AExpr = AExpr;
exports.RangeSubselect = RangeSubselect;
exports.AArrayExpr = AArrayExpr;
exports.SortBy = SortBy;
exports.NullTest = NullTest;
exports.WithClause = WithClause;
exports.CommonTableExpr = CommonTableExpr;
exports.RangeFunction = RangeFunction;
exports.SubLink = SubLink;
exports.CoalesceExpr = CoalesceExpr;
function SelectStmt({ targetList, fromClause, whereClause, sortClause, limitOffset, limitCount, groupClause, withClause }) {
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
function StringValue(value) {
    return {
        String: {
            str: value != null ? value.toString() : null
        }
    };
}
function IntegerValue(value) {
    return {
        Integer: {
            ival: value != null ? +value : null
        }
    };
}
function FloatValue(value) {
    return {
        Float: {
            str: value != null ? value.toString() : ''
        }
    };
}
function Alias(name) {
    return {
        Alias: {
            aliasname: name
        }
    };
}
function RangeVar(name, alias) {
    return {
        RangeVar: {
            relname: name,
            inhOpt: 2,
            relpersistence: 'p',
            alias: alias
        }
    };
}
function ResTarget(node, name = null) {
    return {
        ResTarget: {
            name: name,
            val: node
        }
    };
}
function FuncCall(name, args, options) {
    return {
        FuncCall: Object.assign({ funcname: Array.isArray(name) ? name : [StringValue(name)], args: args }, options)
    };
}
function WindowDef(orderClause, frameOptions) {
    return {
        WindowDef: {
            orderClause: orderClause,
            frameOptions: frameOptions
        }
    };
}
function ColumnRef(name, source) {
    const nameValue = typeof name === 'string' ? StringValue(name) : name;
    const fields = source ? [StringValue(source), nameValue]
        : [nameValue];
    return {
        ColumnRef: {
            fields: fields
        }
    };
}
function TypeCast(typeName, arg) {
    return {
        TypeCast: {
            arg: arg,
            typeName: typeName
        }
    };
}
function TypeName(names, mod) {
    return {
        TypeName: {
            names: typeof names === 'string' ? [StringValue(names)] : names,
            typemod: mod
        }
    };
}
function JoinExpr(type, larg, rarg, quals) {
    return {
        JoinExpr: {
            jointype: type,
            larg: larg,
            rarg: rarg,
            quals: quals
        }
    };
}
function AConst(value) {
    return {
        A_Const: {
            val: value
        }
    };
}
function AStar() {
    return {
        A_Star: {}
    };
}
function BoolExpr(op, args) {
    return {
        BoolExpr: {
            boolop: op,
            args: args
        }
    };
}
function BooleanTest(arg, booltesttype) {
    return {
        BooleanTest: {
            arg: arg,
            booltesttype: booltesttype
        }
    };
}
function AExpr(kind, name, lexpr, rexpr) {
    return {
        A_Expr: {
            kind: kind,
            name: [StringValue(name)],
            lexpr: lexpr,
            rexpr: rexpr
        }
    };
}
function RangeSubselect(subquery, alias) {
    return {
        RangeSubselect: {
            subquery: subquery,
            alias: alias
        }
    };
}
function AArrayExpr(values) {
    return {
        A_ArrayExpr: {
            elements: values
        }
    };
}
function SortBy(node, direction, nulls) {
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
function NullTest(type, arg) {
    return {
        NullTest: {
            arg: arg,
            nulltesttype: type
        }
    };
}
function WithClause(ctes) {
    return {
        WithClause: {
            ctes: ctes
        }
    };
}
function CommonTableExpr(name, query) {
    return {
        CommonTableExpr: {
            ctename: name,
            ctequery: query
        }
    };
}
function RangeFunction(functions, alias) {
    return {
        RangeFunction: {
            functions: functions,
            alias: alias
        }
    };
}
function SubLink(type, subselect) {
    return {
        SubLink: {
            subLinkType: type,
            subselect: subselect
        }
    };
}
function CoalesceExpr(args) {
    return {
        CoalesceExpr: {
            args: args
        }
    };
}
//# sourceMappingURL=helpers.js.map