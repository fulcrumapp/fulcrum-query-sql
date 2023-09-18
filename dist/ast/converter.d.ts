export default class Converter {
    static joinClause(baseQuery: any, { inner, tableName, alias, sourceColumn, joinColumn, sourceTableName, rarg, ast }: {
        inner: any;
        tableName: any;
        alias: any;
        sourceColumn: any;
        joinColumn: any;
        sourceTableName: any;
        rarg: any;
        ast: any;
    }): {
        JoinExpr: {
            jointype: any;
            larg: any;
            rarg: any;
            quals: any;
        };
    };
    static duplicateResTargetWithExactName(query: any, targetList: any, column: any, exactName: any): void;
    static findResTarget(query: any, column: any): any;
    toAST(query: any, { sort, pageSize, pageIndex, boundingBox, searchFilter }: {
        sort: any;
        pageSize: any;
        pageIndex: any;
        boundingBox: any;
        searchFilter: any;
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
    toCountAST(query: any, { boundingBox, searchFilter }: {
        boundingBox: any;
        searchFilter: any;
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
    toTileAST(query: any, { searchFilter }: {
        searchFilter: any;
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
    toHistogramAST(query: any, { column, bucketSize, type, sort, pageSize, pageIndex, boundingBox, searchFilter }: {
        column: any;
        bucketSize: any;
        type: any;
        sort: any;
        pageSize: any;
        pageIndex: any;
        boundingBox: any;
        searchFilter: any;
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
    toDistinctValuesAST(query: any, options?: {}): {
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
    toSummaryAST(query: any, columnSetting: any, { boundingBox, searchFilter }: {
        boundingBox: any;
        searchFilter: any;
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
    histogramWithClause(column: any, bucketSize: any, type: any, query: any, boundingBox: any, searchFilter: any): {
        WithClause: {
            ctes: any;
        };
    };
    toSchemaAST(query: any, { schemaOnly }?: {
        schemaOnly: any;
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
    limitOffset(pageSize: any, pageIndex: any): {
        A_Const: {
            val: any;
        };
    } | null;
    limitCount(pageSize: any): {
        A_Const: {
            val: any;
        };
    } | null;
    targetList(query: any, sort: any, boundingBox: any): {
        ResTarget: {
            name: null;
            val: any;
        };
    }[];
    fromClause(query: any, leftJoins: any[] | undefined, exactColumns: any): {
        RangeSubselect: {
            subquery: any;
            alias: any;
        };
    }[] | ({
        RangeVar: {
            relname: any;
            inhOpt: number;
            relpersistence: string;
            alias: any;
        };
    } | {
        JoinExpr: {
            jointype: any;
            larg: any;
            rarg: any;
            quals: any;
        };
    })[];
    whereClause(query: any, boundingBox: any, search: any, options?: {}): {
        BoolExpr: {
            boolop: any;
            args: any;
        };
    } | null;
    formQueryRangeVar(query: any): {
        RangeVar: {
            relname: any;
            inhOpt: number;
            relpersistence: string;
            alias: any;
        };
    };
    createExpressionForColumnFilter(filter: any, options: any): {
        BoolExpr: {
            boolop: any;
            args: any;
        };
    } | {
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
    } | {
        NullTest: {
            arg: any;
            nulltesttype: any;
        };
    } | null;
    boundingBoxFilter(query: any, boundingBox: any): {
        BoolExpr: {
            boolop: any;
            args: any;
        };
    } | {
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
    geometryQuery(columnName: any, boundingBox: any): {
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
    escapeLikePercent(value: any): any;
    searchFilter(query: any, search: any): {
        BoolExpr: {
            boolop: any;
            args: any;
        };
    } | {
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
    summaryWhereClause(query: any, columnSetting: any, { boundingBox, searchFilter }: {
        boundingBox: any;
        searchFilter: any;
    }): {
        BoolExpr: {
            boolop: any;
            args: any;
        };
    } | null;
    summaryTargetList(query: any, columnSetting: any): {
        ResTarget: {
            name: null;
            val: any;
        };
    }[];
    nodeForExpressions(expressions: any, options: any): any;
    nodeForCondition(condition: any, options: any): {
        BoolExpr: {
            boolop: any;
            args: any;
        };
    } | null;
    nodeForExpression(expression: any, options: any): {
        BoolExpr: {
            boolop: any;
            args: any;
        };
    } | {
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
    } | {
        NullTest: {
            arg: any;
            nulltesttype: any;
        };
    } | null;
    BooleanConverter: (type: any, condition: any, options: any) => {
        BoolExpr: {
            boolop: any;
            args: any;
        };
    } | null;
    AndConverter: (condition: any, options: any) => {
        BoolExpr: {
            boolop: any;
            args: any;
        };
    } | null;
    OrConverter: (condition: any, options: any) => {
        BoolExpr: {
            boolop: any;
            args: any;
        };
    } | null;
    NotConverter: (condition: any, options: any) => {
        BoolExpr: {
            boolop: any;
            args: any;
        };
    } | null;
    NotEmptyConverter: (expression: any) => {
        NullTest: {
            arg: any;
            nulltesttype: any;
        };
    };
    EmptyConverter: (expression: any) => {
        NullTest: {
            arg: any;
            nulltesttype: any;
        };
    };
    EqualConverter: (expression: any) => {
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
    NotEqualConverter: (expression: any) => {
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
    GreaterThanConverter: (expression: any) => {
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
    GreaterThanOrEqualConverter: (expression: any) => {
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
    LessThanConverter: (expression: any) => {
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
    LessThanOrEqualConverter: (expression: any) => {
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
    BetweenConverter: (expression: any, options: any) => {
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
    } | null;
    NotBetweenConverter: (expression: any, options: any) => {
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
    } | null;
    InConverter: (expression: any) => {
        BoolExpr: {
            boolop: any;
            args: any;
        };
    } | {
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
    } | {
        NullTest: {
            arg: any;
            nulltesttype: any;
        };
    } | null;
    NotInConverter: (expression: any) => {
        BoolExpr: {
            boolop: any;
            args: any;
        };
    } | {
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
    } | {
        NullTest: {
            arg: any;
            nulltesttype: any;
        };
    } | null;
    BinaryConverter: (kind: any, operator: any, expression: any) => {
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
    FieldConverter: (expression: any) => {
        ColumnRef: {
            fields: any[];
        };
    };
    ConstantConverter: (expression: any) => {
        A_Const: {
            val: any;
        };
    } | null;
    TextEqualConverter: (expression: any) => {
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
    TextNotEqualConverter: (expression: any) => {
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
    TextContainConverter: (expression: any) => {
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
    TextNotContainConverter: (expression: any) => {
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
    TextStartsWithConverter: (expression: any) => {
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
    TextEndsWithConverter: (expression: any) => {
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
    TextMatchConverter: (expression: any) => {
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
    } | null;
    TextNotMatchConverter: (expression: any) => {
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
    } | null;
    ArrayAnyOfConverter: (expression: any) => {
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
    ArrayAllOfConverter: (expression: any) => {
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
    ArrayIsContainedIn: (expression: any) => {
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
    ArrayEqualConverter: (expression: any) => {
        BoolExpr: {
            boolop: any;
            args: any;
        };
    };
    SearchConverter: (expression: any) => {
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
    DynamicDateConverter: (expression: any, options: any) => {
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
    } | null;
    NotBetween: (column: any, value1: any, value2: any) => {
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
    } | null;
    AnyOf: (column: any, values: any) => {
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
    In: (column: any, values: any) => {
        BoolExpr: {
            boolop: any;
            args: any;
        };
    } | {
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
    } | {
        NullTest: {
            arg: any;
            nulltesttype: any;
        };
    } | null;
    NotIn: (column: any, values: any) => {
        BoolExpr: {
            boolop: any;
            args: any;
        };
    } | {
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
    } | {
        NullTest: {
            arg: any;
            nulltesttype: any;
        };
    } | null;
    Between: (column: any, value1: any, value2: any) => {
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
    } | null;
    ConstValue: (column: any, value: any) => {
        A_Const: {
            val: any;
        };
    } | null;
    GetDate: (date: any, options: any, isDateTime: any) => moment.Moment;
    ConvertDateValue: (expression: any, date: any) => any;
    ConvertToText: (column: any) => {
        ColumnRef: {
            fields: any[];
        };
    } | {
        TypeCast: {
            arg: any;
            typeName: any;
        };
    };
    IsValidRegExp: (string: any) => boolean;
}
import moment from 'moment-timezone';
