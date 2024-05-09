export default class Query {
    constructor(attrs: any);
    _ast: any;
    _form: any;
    _repeatableKey: any;
    _schema: any;
    _filter: Condition;
    _sorting: SortExpressions;
    _boundingBox: any;
    _searchFilter: any;
    _dateFilter: Expression;
    _options: QueryOptions;
    _columnSettings: ColumnSettings;
    _statusFilter: ColumnFilter;
    _projectFilter: ColumnFilter;
    _assignmentFilter: ColumnFilter;
    _changesetFilter: ColumnFilter;
    _full: boolean;
    get ast(): any;
    get form(): any;
    get repeatableKey(): any;
    get schema(): any;
    get filter(): Condition;
    get sorting(): SortExpressions;
    get columnSettings(): ColumnSettings;
    get dateFilter(): Expression;
    get statusFilter(): ColumnFilter;
    get changesetFilter(): ColumnFilter;
    get projectFilter(): ColumnFilter;
    get assignmentFilter(): ColumnFilter;
    get options(): QueryOptions;
    get full(): boolean;
    get hasFilter(): any;
    get joinColumns(): any[];
    get referencedColumns(): any[];
    get joinColumnsWithSorting(): any[];
    get defaultDateField(): "_updated_at" | "_server_updated_at";
    clearAllFilters(): void;
    set boundingBox(arg: any);
    get boundingBox(): any;
    set searchFilter(arg: any);
    get searchFilter(): any;
    get runtimeFilters(): {
        boundingBox: any;
        searchFilter: any;
        dateFilter: Expression;
    };
    toJSON({ boundingBox }?: {
        boundingBox?: boolean | undefined;
    }): {
        filter: {
            type: any;
            expressions: any;
        } | null;
        sorting: any;
        options: {
            time_zone: any;
        };
        bounding_box: any;
        search_filter: any;
        date_filter: {
            field: any;
            operator: any;
            value: any;
        } | null;
        columns: any[];
        status_filter: {
            field: any;
            value: any;
        } | null;
        changeset_filter: {
            field: any;
            value: any;
        } | null;
        project_filter: {
            field: any;
            value: any;
        } | null;
        assignment_filter: {
            field: any;
            value: any;
        } | null;
    };
    toRawAST(options: any): {
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
    toCountAST(options: any): {
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
    toTileAST(options: any, maxTileRecords: any): {
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
    toDistinctValuesAST(options: any): {
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
    toHistogramAST(options: any): {
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
    toAST({ applySort, pageSize, pageIndex, outerLimit }: {
        applySort: any;
        pageSize: any;
        pageIndex: any;
        outerLimit: any;
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
    deparse(ast: any): any;
    toSchemaAST(ast: any, options: any): {
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
    toDistinctValuesSQL(options: any): any;
    toHistogramSQL(options: any): any;
    toCountSQL(): any;
    toSQL({ applySort, pageSize, pageIndex, outerLimit }: {
        applySort: any;
        pageSize: any;
        pageIndex: any;
        outerLimit: any;
    }): any;
    /**
   * JSDoc notation to build required types into .d.ts query file.
   *
   * @param {any} [maxTileRecords] - The maximum number of tile records, can be null or undefined.
   * @returns {any} The SQL string.
   */
    toTileSQL(maxTileRecords?: any): any;
    toSummarySQL(columnSetting: any): any;
    targetList(): {
        ResTarget: {
            name: null;
            val: any;
        };
    }[];
    fromClause({ applySort, pageSize, pageIndex, boundingBox, searchFilter }: {
        applySort: any;
        pageSize: any;
        pageIndex: any;
        boundingBox: any;
        searchFilter: any;
    }): {
        RangeSubselect: {
            subquery: any;
            alias: any;
        };
    }[];
    get sortClause(): any;
    get systemSortClause(): {
        SortBy: {
            node: any;
            sortby_dir: any;
            sortby_nulls: any;
        };
    }[];
    get outerSortClause(): {
        SortBy: {
            node: any;
            sortby_dir: any;
            sortby_nulls: any;
        };
    }[];
    toHumanDescription(): string;
    setup(): void;
}
import { Condition } from './condition';
import SortExpressions from './sort-expressions';
import { Expression } from './expression';
import QueryOptions from './query-options';
import ColumnSettings from './column-settings';
import ColumnFilter from './column-filter';
