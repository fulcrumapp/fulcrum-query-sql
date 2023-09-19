export function isValueRequired(operator: any): boolean;
export function isDateOperator(operator: any): {
    name: string;
    label: string;
} | undefined;
export function availableOperatorsForColumn(column: any): any;
export function calculateDateRange(column: any, operator: any, value: any, now: any): any;
export namespace OperatorType {
    namespace Empty {
        let name: string;
        let label: string;
    }
    namespace NotEmpty {
        let name_1: string;
        export { name_1 as name };
        let label_1: string;
        export { label_1 as label };
    }
    namespace Equal {
        let name_2: string;
        export { name_2 as name };
        let label_2: string;
        export { label_2 as label };
    }
    namespace NotEqual {
        let name_3: string;
        export { name_3 as name };
        let label_3: string;
        export { label_3 as label };
    }
    namespace GreaterThan {
        let name_4: string;
        export { name_4 as name };
        let label_4: string;
        export { label_4 as label };
    }
    namespace GreaterThanOrEqual {
        let name_5: string;
        export { name_5 as name };
        let label_5: string;
        export { label_5 as label };
    }
    namespace LessThan {
        let name_6: string;
        export { name_6 as name };
        let label_6: string;
        export { label_6 as label };
    }
    namespace LessThanOrEqual {
        let name_7: string;
        export { name_7 as name };
        let label_7: string;
        export { label_7 as label };
    }
    namespace Between {
        let name_8: string;
        export { name_8 as name };
        let label_8: string;
        export { label_8 as label };
    }
    namespace NotBetween {
        let name_9: string;
        export { name_9 as name };
        let label_9: string;
        export { label_9 as label };
    }
    namespace In {
        let name_10: string;
        export { name_10 as name };
        let label_10: string;
        export { label_10 as label };
    }
    namespace NotIn {
        let name_11: string;
        export { name_11 as name };
        let label_11: string;
        export { label_11 as label };
    }
    namespace TextContain {
        let name_12: string;
        export { name_12 as name };
        let label_12: string;
        export { label_12 as label };
    }
    namespace TextNotContain {
        let name_13: string;
        export { name_13 as name };
        let label_13: string;
        export { label_13 as label };
    }
    namespace TextStartsWith {
        let name_14: string;
        export { name_14 as name };
        let label_14: string;
        export { label_14 as label };
    }
    namespace TextEndsWith {
        let name_15: string;
        export { name_15 as name };
        let label_15: string;
        export { label_15 as label };
    }
    namespace TextEqual {
        let name_16: string;
        export { name_16 as name };
        let label_16: string;
        export { label_16 as label };
    }
    namespace TextNotEqual {
        let name_17: string;
        export { name_17 as name };
        let label_17: string;
        export { label_17 as label };
    }
    namespace TextMatch {
        let name_18: string;
        export { name_18 as name };
        let label_18: string;
        export { label_18 as label };
    }
    namespace TextNotMatch {
        let name_19: string;
        export { name_19 as name };
        let label_19: string;
        export { label_19 as label };
    }
    namespace DateEqual {
        let name_20: string;
        export { name_20 as name };
        let label_20: string;
        export { label_20 as label };
    }
    namespace DateNotEqual {
        let name_21: string;
        export { name_21 as name };
        let label_21: string;
        export { label_21 as label };
    }
    namespace DateAfter {
        let name_22: string;
        export { name_22 as name };
        let label_22: string;
        export { label_22 as label };
    }
    namespace DateOnOrAfter {
        let name_23: string;
        export { name_23 as name };
        let label_23: string;
        export { label_23 as label };
    }
    namespace DateBefore {
        let name_24: string;
        export { name_24 as name };
        let label_24: string;
        export { label_24 as label };
    }
    namespace DateOnOrBefore {
        let name_25: string;
        export { name_25 as name };
        let label_25: string;
        export { label_25 as label };
    }
    namespace DateToday {
        let name_26: string;
        export { name_26 as name };
        let label_26: string;
        export { label_26 as label };
    }
    namespace DateYesterday {
        let name_27: string;
        export { name_27 as name };
        let label_27: string;
        export { label_27 as label };
    }
    namespace DateTomorrow {
        let name_28: string;
        export { name_28 as name };
        let label_28: string;
        export { label_28 as label };
    }
    namespace DateLast7Days {
        let name_29: string;
        export { name_29 as name };
        let label_29: string;
        export { label_29 as label };
    }
    namespace DateLast30Days {
        let name_30: string;
        export { name_30 as name };
        let label_30: string;
        export { label_30 as label };
    }
    namespace DateLast90Days {
        let name_31: string;
        export { name_31 as name };
        let label_31: string;
        export { label_31 as label };
    }
    namespace DateLastMonth {
        let name_32: string;
        export { name_32 as name };
        let label_32: string;
        export { label_32 as label };
    }
    namespace DateLastYear {
        let name_33: string;
        export { name_33 as name };
        let label_33: string;
        export { label_33 as label };
    }
    namespace DateNextWeek {
        let name_34: string;
        export { name_34 as name };
        let label_34: string;
        export { label_34 as label };
    }
    namespace DateNextMonth {
        let name_35: string;
        export { name_35 as name };
        let label_35: string;
        export { label_35 as label };
    }
    namespace DateNextYear {
        let name_36: string;
        export { name_36 as name };
        let label_36: string;
        export { label_36 as label };
    }
    namespace DateCurrentCalendarWeek {
        let name_37: string;
        export { name_37 as name };
        let label_37: string;
        export { label_37 as label };
    }
    namespace DateCurrentCalendarMonth {
        let name_38: string;
        export { name_38 as name };
        let label_38: string;
        export { label_38 as label };
    }
    namespace DateCurrentCalendarYear {
        let name_39: string;
        export { name_39 as name };
        let label_39: string;
        export { label_39 as label };
    }
    namespace DatePreviousCalendarWeek {
        let name_40: string;
        export { name_40 as name };
        let label_40: string;
        export { label_40 as label };
    }
    namespace DatePreviousCalendarMonth {
        let name_41: string;
        export { name_41 as name };
        let label_41: string;
        export { label_41 as label };
    }
    namespace DatePreviousCalendarYear {
        let name_42: string;
        export { name_42 as name };
        let label_42: string;
        export { label_42 as label };
    }
    namespace DateNextCalendarWeek {
        let name_43: string;
        export { name_43 as name };
        let label_43: string;
        export { label_43 as label };
    }
    namespace DateNextCalendarMonth {
        let name_44: string;
        export { name_44 as name };
        let label_44: string;
        export { label_44 as label };
    }
    namespace DateNextCalendarYear {
        let name_45: string;
        export { name_45 as name };
        let label_45: string;
        export { label_45 as label };
    }
    namespace DateDaysFromNow {
        let name_46: string;
        export { name_46 as name };
        let label_46: string;
        export { label_46 as label };
    }
    namespace DateWeeksFromNow {
        let name_47: string;
        export { name_47 as name };
        let label_47: string;
        export { label_47 as label };
    }
    namespace DateMonthsFromNow {
        let name_48: string;
        export { name_48 as name };
        let label_48: string;
        export { label_48 as label };
    }
    namespace DateYearsFromNow {
        let name_49: string;
        export { name_49 as name };
        let label_49: string;
        export { label_49 as label };
    }
    namespace DateDaysAgo {
        let name_50: string;
        export { name_50 as name };
        let label_50: string;
        export { label_50 as label };
    }
    namespace DateWeeksAgo {
        let name_51: string;
        export { name_51 as name };
        let label_51: string;
        export { label_51 as label };
    }
    namespace DateMonthsAgo {
        let name_52: string;
        export { name_52 as name };
        let label_52: string;
        export { label_52 as label };
    }
    namespace DateYearsAgo {
        let name_53: string;
        export { name_53 as name };
        let label_53: string;
        export { label_53 as label };
    }
    namespace DateBetween {
        let name_54: string;
        export { name_54 as name };
        let label_54: string;
        export { label_54 as label };
    }
    namespace DateNotBetween {
        let name_55: string;
        export { name_55 as name };
        let label_55: string;
        export { label_55 as label };
    }
    namespace ArrayAnyOf {
        let name_56: string;
        export { name_56 as name };
        let label_56: string;
        export { label_56 as label };
    }
    namespace ArrayAllOf {
        let name_57: string;
        export { name_57 as name };
        let label_57: string;
        export { label_57 as label };
    }
    namespace ArrayIsContainedIn {
        let name_58: string;
        export { name_58 as name };
        let label_58: string;
        export { label_58 as label };
    }
    namespace ArrayNoneOf {
        let name_59: string;
        export { name_59 as name };
        let label_59: string;
        export { label_59 as label };
    }
    namespace ArrayEqual {
        let name_60: string;
        export { name_60 as name };
        let label_60: string;
        export { label_60 as label };
    }
    namespace Search {
        let name_61: string;
        export { name_61 as name };
        let label_61: string;
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
