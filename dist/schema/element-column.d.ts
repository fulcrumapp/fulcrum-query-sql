export default class ElementColumn extends Column {
    constructor({ element, rawColumn, type, id, part, index }: {
        element: any;
        rawColumn: any;
        type: any;
        id: any;
        part: any;
        index: any;
    });
    _type: any;
    _element: any;
    _rawColumn: any;
    _id: any;
    _part: any;
    _index: any;
    get alias(): any;
    get type(): any;
    get name(): any;
    get element(): any;
    get rawColumn(): any;
    get columnName(): any;
    get id(): any;
    get part(): any;
    valueFrom(feature: any): any;
    exportValue(feature: any, options: any): any;
}
import Column from './column';
