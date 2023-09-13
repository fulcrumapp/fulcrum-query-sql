export function availableAggregatesForColumn(column: any): any[];
export namespace AggregateType {
    namespace Sum {
        let name: string;
        let label: string;
    }
    namespace Average {
        let name_1: string;
        export { name_1 as name };
        let label_1: string;
        export { label_1 as label };
    }
    namespace Median {
        let name_2: string;
        export { name_2 as name };
        let label_2: string;
        export { label_2 as label };
    }
    namespace Min {
        let name_3: string;
        export { name_3 as name };
        let label_3: string;
        export { label_3 as label };
    }
    namespace Max {
        let name_4: string;
        export { name_4 as name };
        let label_4: string;
        export { label_4 as label };
    }
    namespace StdDev {
        let name_5: string;
        export { name_5 as name };
        let label_5: string;
        export { label_5 as label };
    }
    namespace Histogram {
        let name_6: string;
        export { name_6 as name };
        let label_6: string;
        export { label_6 as label };
    }
    namespace Empty {
        let name_7: string;
        export { name_7 as name };
        let label_7: string;
        export { label_7 as label };
        export let count: boolean;
    }
    namespace NotEmpty {
        let name_8: string;
        export { name_8 as name };
        let label_8: string;
        export { label_8 as label };
        let count_1: boolean;
        export { count_1 as count };
    }
    namespace Unique {
        let name_9: string;
        export { name_9 as name };
        let label_9: string;
        export { label_9 as label };
        let count_2: boolean;
        export { count_2 as count };
    }
    namespace PercentEmpty {
        let name_10: string;
        export { name_10 as name };
        let label_10: string;
        export { label_10 as label };
    }
    namespace PercentNotEmpty {
        let name_11: string;
        export { name_11 as name };
        let label_11: string;
        export { label_11 as label };
    }
    namespace PercentUnique {
        let name_12: string;
        export { name_12 as name };
        let label_12: string;
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
