"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoalesceExpr = exports.SubLink = exports.RangeFunction = exports.CommonTableExpr = exports.WithClause = exports.NullTest = exports.SortBy = exports.AArrayExpr = exports.RangeSubselect = exports.AExpr = exports.BooleanTest = exports.BoolExpr = exports.AStar = exports.AConst = exports.JoinExpr = exports.TypeName = exports.TypeCast = exports.ColumnRef = exports.WindowDef = exports.FuncCall = exports.ResTarget = exports.RangeVar = exports.Alias = exports.FloatValue = exports.IntegerValue = exports.StringValue = exports.SelectStmt = void 0;
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
exports.SelectStmt = SelectStmt;
function StringValue(value) {
    let str = value != null ? value.toString() : null;
    const isUUID = str === null || str === void 0 ? void 0 : str.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    if (!isUUID && !isNaN(Number(str[0]))) {
        console.log('not a UUID and starts with number', str);
        str = `""${str}""`;
        console.log('converted to', str);
    }
    return {
        String: {
            str,
        }
    };
}
exports.StringValue = StringValue;
function IntegerValue(value) {
    return {
        Integer: {
            ival: value != null ? +value : null
        }
    };
}
exports.IntegerValue = IntegerValue;
function FloatValue(value) {
    return {
        Float: {
            str: value != null ? value.toString() : ''
        }
    };
}
exports.FloatValue = FloatValue;
function Alias(name) {
    return {
        Alias: {
            aliasname: name
        }
    };
}
exports.Alias = Alias;
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
exports.RangeVar = RangeVar;
function ResTarget(node, name = null) {
    return {
        ResTarget: {
            name: name,
            val: node
        }
    };
}
exports.ResTarget = ResTarget;
function FuncCall(name, args, options) {
    return {
        FuncCall: Object.assign({ funcname: Array.isArray(name) ? name : [StringValue(name)], args: args }, options)
    };
}
exports.FuncCall = FuncCall;
function WindowDef(orderClause, frameOptions) {
    return {
        WindowDef: {
            orderClause: orderClause,
            frameOptions: frameOptions
        }
    };
}
exports.WindowDef = WindowDef;
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
exports.ColumnRef = ColumnRef;
function TypeCast(typeName, arg) {
    return {
        TypeCast: {
            arg: arg,
            typeName: typeName
        }
    };
}
exports.TypeCast = TypeCast;
function TypeName(names, mod) {
    return {
        TypeName: {
            names: typeof names === 'string' ? [StringValue(names)] : names,
            typemod: mod
        }
    };
}
exports.TypeName = TypeName;
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
exports.JoinExpr = JoinExpr;
function AConst(value) {
    return {
        A_Const: {
            val: value
        }
    };
}
exports.AConst = AConst;
function AStar() {
    return {
        A_Star: {}
    };
}
exports.AStar = AStar;
function BoolExpr(op, args) {
    return {
        BoolExpr: {
            boolop: op,
            args: args
        }
    };
}
exports.BoolExpr = BoolExpr;
function BooleanTest(arg, booltesttype) {
    return {
        BooleanTest: {
            arg: arg,
            booltesttype: booltesttype
        }
    };
}
exports.BooleanTest = BooleanTest;
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
exports.AExpr = AExpr;
function RangeSubselect(subquery, alias) {
    return {
        RangeSubselect: {
            subquery: subquery,
            alias: alias
        }
    };
}
exports.RangeSubselect = RangeSubselect;
function AArrayExpr(values) {
    return {
        A_ArrayExpr: {
            elements: values
        }
    };
}
exports.AArrayExpr = AArrayExpr;
function SortBy(node, direction, nulls) {
    return {
        SortBy: {
            node: node,
            sortby_dir: direction,
            sortby_nulls: nulls
        }
    };
}
exports.SortBy = SortBy;
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
exports.NullTest = NullTest;
function WithClause(ctes) {
    return {
        WithClause: {
            ctes: ctes
        }
    };
}
exports.WithClause = WithClause;
function CommonTableExpr(name, query) {
    return {
        CommonTableExpr: {
            ctename: name,
            ctequery: query
        }
    };
}
exports.CommonTableExpr = CommonTableExpr;
function RangeFunction(functions, alias) {
    return {
        RangeFunction: {
            functions: functions,
            alias: alias
        }
    };
}
exports.RangeFunction = RangeFunction;
function SubLink(type, subselect) {
    return {
        SubLink: {
            subLinkType: type,
            subselect: subselect
        }
    };
}
exports.SubLink = SubLink;
function CoalesceExpr(args) {
    return {
        CoalesceExpr: {
            args: args
        }
    };
}
exports.CoalesceExpr = CoalesceExpr;
//# sourceMappingURL=helpers.js.map