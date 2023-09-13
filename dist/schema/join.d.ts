export default class Join {
    constructor({ alias, tableName, sourceTableName, sourceColumn, joinColumn, inner, ast }: {
        alias: any;
        tableName: any;
        sourceTableName: any;
        sourceColumn: any;
        joinColumn: any;
        inner: any;
        ast: any;
    });
    _alias: any;
    _tableName: any;
    _sourceColumn: any;
    _joinColumn: any;
    _inner: boolean;
    _sourceTableName: any;
    _ast: any;
    get inner(): boolean;
    get alias(): any;
    get tableName(): any;
    get sourceColumn(): any;
    get sourceTableName(): any;
    get joinColumn(): any;
    get ast(): any;
}
