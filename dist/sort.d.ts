export const DIRECTION_ASC: "asc";
export const DIRECTION_DESC: "desc";
export namespace DIRECTIONS {
    export { DIRECTION_ASC as Asc };
    export { DIRECTION_DESC as Desc };
}
export class Sort {
    constructor(attrs: any, schema: any);
    _field: any;
    _direction: any;
    _schema: any;
    get isValid(): boolean;
    set direction(arg: any);
    get direction(): any;
    get field(): any;
    set column(arg: any);
    get column(): any;
    get columnName(): any;
    toJSON(): {
        field: any;
        direction: any;
    };
    toHumanDescription(): string | null;
}
