export function isValueRequired(operator: any): boolean;
export function isDateOperator(operator: any): {
    name: string;
    label: string;
} | undefined;
export function availableOperatorsForColumn(column: any): any;
export function calculateDateRange(column: any, operator: any, value: any, now: any): any;
export namespace OperatorType {
    namespace Empty {
        const name: string;
        const label: string;
    }
    namespace NotEmpty {
        const name_1: string;
        export { name_1 as name };
        const label_1: string;
        export { label_1 as label };
    }
    namespace Equal {
        const name_2: string;
        export { name_2 as name };
        const label_2: string;
        export { label_2 as label };
    }
    namespace NotEqual {
        const name_3: string;
        export { name_3 as name };
        const label_3: string;
        export { label_3 as label };
    }
    namespace GreaterThan {
        const name_4: string;
        export { name_4 as name };
        const label_4: string;
        export { label_4 as label };
    }
    namespace GreaterThanOrEqual {
        const name_5: string;
        export { name_5 as name };
        const label_5: string;
        export { label_5 as label };
    }
    namespace LessThan {
        const name_6: string;
        export { name_6 as name };
        const label_6: string;
        export { label_6 as label };
    }
    namespace LessThanOrEqual {
        const name_7: string;
        export { name_7 as name };
        const label_7: string;
        export { label_7 as label };
    }
    namespace Between {
        const name_8: string;
        export { name_8 as name };
        const label_8: string;
        export { label_8 as label };
    }
    namespace NotBetween {
        const name_9: string;
        export { name_9 as name };
        const label_9: string;
        export { label_9 as label };
    }
    namespace In {
        const name_10: string;
        export { name_10 as name };
        const label_10: string;
        export { label_10 as label };
    }
    namespace NotIn {
        const name_11: string;
        export { name_11 as name };
        const label_11: string;
        export { label_11 as label };
    }
    namespace TextContain {
        const name_12: string;
        export { name_12 as name };
        const label_12: string;
        export { label_12 as label };
    }
    namespace TextNotContain {
        const name_13: string;
        export { name_13 as name };
        const label_13: string;
        export { label_13 as label };
    }
    namespace TextStartsWith {
        const name_14: string;
        export { name_14 as name };
        const label_14: string;
        export { label_14 as label };
    }
    namespace TextEndsWith {
        const name_15: string;
        export { name_15 as name };
        const label_15: string;
        export { label_15 as label };
    }
    namespace TextEqual {
        const name_16: string;
        export { name_16 as name };
        const label_16: string;
        export { label_16 as label };
    }
    namespace TextNotEqual {
        const name_17: string;
        export { name_17 as name };
        const label_17: string;
        export { label_17 as label };
    }
    namespace TextMatch {
        const name_18: string;
        export { name_18 as name };
        const label_18: string;
        export { label_18 as label };
    }
    namespace TextNotMatch {
        const name_19: string;
        export { name_19 as name };
        const label_19: string;
        export { label_19 as label };
    }
    namespace DateEqual {
        const name_20: string;
        export { name_20 as name };
        const label_20: string;
        export { label_20 as label };
    }
    namespace DateNotEqual {
        const name_21: string;
        export { name_21 as name };
        const label_21: string;
        export { label_21 as label };
    }
    namespace DateAfter {
        const name_22: string;
        export { name_22 as name };
        const label_22: string;
        export { label_22 as label };
    }
    namespace DateOnOrAfter {
        const name_23: string;
        export { name_23 as name };
        const label_23: string;
        export { label_23 as label };
    }
    namespace DateBefore {
        const name_24: string;
        export { name_24 as name };
        const label_24: string;
        export { label_24 as label };
    }
    namespace DateOnOrBefore {
        const name_25: string;
        export { name_25 as name };
        const label_25: string;
        export { label_25 as label };
    }
    namespace DateToday {
        const name_26: string;
        export { name_26 as name };
        const label_26: string;
        export { label_26 as label };
    }
    namespace DateYesterday {
        const name_27: string;
        export { name_27 as name };
        const label_27: string;
        export { label_27 as label };
    }
    namespace DateTomorrow {
        const name_28: string;
        export { name_28 as name };
        const label_28: string;
        export { label_28 as label };
    }
    namespace DateLast7Days {
        const name_29: string;
        export { name_29 as name };
        const label_29: string;
        export { label_29 as label };
    }
    namespace DateLast30Days {
        const name_30: string;
        export { name_30 as name };
        const label_30: string;
        export { label_30 as label };
    }
    namespace DateLast90Days {
        const name_31: string;
        export { name_31 as name };
        const label_31: string;
        export { label_31 as label };
    }
    namespace DateLastMonth {
        const name_32: string;
        export { name_32 as name };
        const label_32: string;
        export { label_32 as label };
    }
    namespace DateLastYear {
        const name_33: string;
        export { name_33 as name };
        const label_33: string;
        export { label_33 as label };
    }
    namespace DateNextWeek {
        const name_34: string;
        export { name_34 as name };
        const label_34: string;
        export { label_34 as label };
    }
    namespace DateNextMonth {
        const name_35: string;
        export { name_35 as name };
        const label_35: string;
        export { label_35 as label };
    }
    namespace DateNextYear {
        const name_36: string;
        export { name_36 as name };
        const label_36: string;
        export { label_36 as label };
    }
    namespace DateCurrentCalendarWeek {
        const name_37: string;
        export { name_37 as name };
        const label_37: string;
        export { label_37 as label };
    }
    namespace DateCurrentCalendarMonth {
        const name_38: string;
        export { name_38 as name };
        const label_38: string;
        export { label_38 as label };
    }
    namespace DateCurrentCalendarYear {
        const name_39: string;
        export { name_39 as name };
        const label_39: string;
        export { label_39 as label };
    }
    namespace DatePreviousCalendarWeek {
        const name_40: string;
        export { name_40 as name };
        const label_40: string;
        export { label_40 as label };
    }
    namespace DatePreviousCalendarMonth {
        const name_41: string;
        export { name_41 as name };
        const label_41: string;
        export { label_41 as label };
    }
    namespace DatePreviousCalendarYear {
        const name_42: string;
        export { name_42 as name };
        const label_42: string;
        export { label_42 as label };
    }
    namespace DateNextCalendarWeek {
        const name_43: string;
        export { name_43 as name };
        const label_43: string;
        export { label_43 as label };
    }
    namespace DateNextCalendarMonth {
        const name_44: string;
        export { name_44 as name };
        const label_44: string;
        export { label_44 as label };
    }
    namespace DateNextCalendarYear {
        const name_45: string;
        export { name_45 as name };
        const label_45: string;
        export { label_45 as label };
    }
    namespace DateDaysFromNow {
        const name_46: string;
        export { name_46 as name };
        const label_46: string;
        export { label_46 as label };
    }
    namespace DateWeeksFromNow {
        const name_47: string;
        export { name_47 as name };
        const label_47: string;
        export { label_47 as label };
    }
    namespace DateMonthsFromNow {
        const name_48: string;
        export { name_48 as name };
        const label_48: string;
        export { label_48 as label };
    }
    namespace DateYearsFromNow {
        const name_49: string;
        export { name_49 as name };
        const label_49: string;
        export { label_49 as label };
    }
    namespace DateDaysAgo {
        const name_50: string;
        export { name_50 as name };
        const label_50: string;
        export { label_50 as label };
    }
    namespace DateWeeksAgo {
        const name_51: string;
        export { name_51 as name };
        const label_51: string;
        export { label_51 as label };
    }
    namespace DateMonthsAgo {
        const name_52: string;
        export { name_52 as name };
        const label_52: string;
        export { label_52 as label };
    }
    namespace DateYearsAgo {
        const name_53: string;
        export { name_53 as name };
        const label_53: string;
        export { label_53 as label };
    }
    namespace DateBetween {
        const name_54: string;
        export { name_54 as name };
        const label_54: string;
        export { label_54 as label };
    }
    namespace DateNotBetween {
        const name_55: string;
        export { name_55 as name };
        const label_55: string;
        export { label_55 as label };
    }
    namespace ArrayAnyOf {
        const name_56: string;
        export { name_56 as name };
        const label_56: string;
        export { label_56 as label };
    }
    namespace ArrayAllOf {
        const name_57: string;
        export { name_57 as name };
        const label_57: string;
        export { label_57 as label };
    }
    namespace ArrayIsContainedIn {
        const name_58: string;
        export { name_58 as name };
        const label_58: string;
        export { label_58 as label };
    }
    namespace ArrayNoneOf {
        const name_59: string;
        export { name_59 as name };
        const label_59: string;
        export { label_59 as label };
    }
    namespace ArrayEqual {
        const name_60: string;
        export { name_60 as name };
        const label_60: string;
        export { label_60 as label };
    }
    namespace Search {
        const name_61: string;
        export { name_61 as name };
        const label_61: string;
        export { label_61 as label };
    }
}
export const OperatorsByValue: {};
export const DYNAMIC_DATE_OPERATORS: {
    name: string;
    label: string;
}[];
export const FRIENDLY_DATE_OPERATORS: {
    name: string;
    label: string;
}[];
