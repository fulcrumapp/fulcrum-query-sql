export function availableAggregatesForColumn(column: any): any[];
export namespace AggregateType {
    namespace Sum {
        const name: string;
        const label: string;
    }
    namespace Average {
        const name_1: string;
        export { name_1 as name };
        const label_1: string;
        export { label_1 as label };
    }
    namespace Median {
        const name_2: string;
        export { name_2 as name };
        const label_2: string;
        export { label_2 as label };
    }
    namespace Min {
        const name_3: string;
        export { name_3 as name };
        const label_3: string;
        export { label_3 as label };
    }
    namespace Max {
        const name_4: string;
        export { name_4 as name };
        const label_4: string;
        export { label_4 as label };
    }
    namespace StdDev {
        const name_5: string;
        export { name_5 as name };
        const label_5: string;
        export { label_5 as label };
    }
    namespace Histogram {
        const name_6: string;
        export { name_6 as name };
        const label_6: string;
        export { label_6 as label };
    }
    namespace Empty {
        const name_7: string;
        export { name_7 as name };
        const label_7: string;
        export { label_7 as label };
        export const count: boolean;
    }
    namespace NotEmpty {
        const name_8: string;
        export { name_8 as name };
        const label_8: string;
        export { label_8 as label };
        const count_1: boolean;
        export { count_1 as count };
    }
    namespace Unique {
        const name_9: string;
        export { name_9 as name };
        const label_9: string;
        export { label_9 as label };
        const count_2: boolean;
        export { count_2 as count };
    }
    namespace PercentEmpty {
        const name_10: string;
        export { name_10 as name };
        const label_10: string;
        export { label_10 as label };
    }
    namespace PercentNotEmpty {
        const name_11: string;
        export { name_11 as name };
        const label_11: string;
        export { label_11 as label };
    }
    namespace PercentUnique {
        const name_12: string;
        export { name_12 as name };
        const label_12: string;
        export { label_12 as label };
    }
}
export const AggregatesByValue: {};
export const TEXTUAL_AGGREGATES: {
    name: string;
    label: string;
    count: boolean;
}[];
export const NUMERIC_AGGREGATES: {
    name: string;
    label: string;
}[];
export const DATE_AGGREGATES: {
    name: string;
    label: string;
}[];
