export default class FormFieldSchema {
    constructor({ fullSchema }: {
        fullSchema?: boolean | undefined;
    });
    fullSchema: boolean;
    addSystemColumn(label: any, attribute: any, columnName: any, type: any, accessor: any, join: any, sql: any): SimpleColumn;
    addElementColumn(element: any, part: any, type: any): ElementColumn;
    addRawElementColumn(element: any, rawColumn: any, id: any, type: any, part: any, columnKey: any): ElementColumn;
    setupElementColumns(): void;
    findColumnByID(id: any): any;
    columnForFieldKey(fieldKey: any, part: any): any;
    get geometryColumns(): any;
    get columns(): any;
    get allElements(): any;
    _allElements: any;
    get elementsForColumns(): any[];
    _elementsForColumns: any[] | undefined;
}
import SimpleColumn from "./schema/simple-column";
import ElementColumn from "./schema/element-column";
