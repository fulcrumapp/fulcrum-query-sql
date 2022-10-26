import ElementColumn from './schema/element-column';
import SimpleColumn from './schema/simple-column';

export default class FormFieldSchema {
  constructor({fullSchema = false}) {
    this.fullSchema = fullSchema;
  }

  addSystemColumn(label, attribute, columnName, type, accessor, join, sql) {
    const column = new SimpleColumn({name: label,
                                     attributeName: attribute,
                                     columnName: columnName,
                                     type: type,
                                     accessor: accessor,
                                     join,
                                     sql,
                                     index: this._columns.length});
    this._columns.push(column);
    this._columnsByKey[column.id] = column;

    return column;
  }

  addElementColumn(element, part, type) {
    const columnKey = part ? element.key + '_' + part : element.key;

    const rawColumn = this._rawColumnsByKey[columnKey];

    // if (column == null) {
    //   if the column is null, that means it's a materialized column
    //   throw new Error('Column not found for element ' + columnKey + Object.keys(this._rawColumnsByKey));
    // }

    return this.addRawElementColumn(element, rawColumn, null, type || rawColumn.type, part, columnKey);
  }

  addRawElementColumn(element, rawColumn, id, type, part, columnKey) {
    const columnObject = new ElementColumn({element, rawColumn, type, id, part, index: this._columns.length});

    this._columns.push(columnObject);
    this._columnsByKey[columnKey] = columnObject;

    return columnObject;
  }

  setupElementColumns() {
    for (const element of this.elementsForColumns) {
      // repeatable elements don't have any physical columns, but we want to add a column that has the count of items
      if (element.isRepeatableElement) {
        this.addElementColumn(element, null, 'integer');
      } else if (element.isLocationElement) {
        this.addElementColumn(element, 'address');
        this.addElementColumn(element, 'latitude');
        this.addElementColumn(element, 'longitude');
      } else if (!element.isDynamicElement) {
        this.addElementColumn(element);
      }

      if (this.fullSchema && element.isAddressElement) {
        this.addElementColumn(element, 'sub_thoroughfare');
        this.addElementColumn(element, 'thoroughfare');
        this.addElementColumn(element, 'suite');
        this.addElementColumn(element, 'locality');
        this.addElementColumn(element, 'sub_admin_area');
        this.addElementColumn(element, 'admin_area');
        this.addElementColumn(element, 'postal_code');
        this.addElementColumn(element, 'country');
      }

      if (this.fullSchema && (element.isPhotoElement || element.isVideoElement || element.isAudioElement)) {
        this.addElementColumn(element, 'captions', 'array');
        this.addElementColumn(element, 'urls', 'array');
      }

      if (this.fullSchema && element.isSignatureElement) {
        this.addElementColumn(element, 'timestamp');
      }

      if (this.fullSchema && (element.isDynamicElement)) {
        this.addElementColumn(element, 'metadata', 'array');
        this.addElementColumn(element, 'elements', 'array');
        this.addElementColumn(element, 'values', 'array');
      }
    }
  }

  findColumnByID(id) {
    return this.columns.find(e => e.id === id);
  }

  columnForFieldKey(fieldKey, part) {
    if (part) {
      return this._columnsByKey[fieldKey + '_' + part];
    }

    return this._columnsByKey[fieldKey];
  }

  get geometryColumns() {
    return this._columns.filter(c => c.isGeometry);
  }

  get columns() {
    return this._columns;
  }

  get allElements() {
    if (!this._allElements) {
      this._allElements = this.container.flattenElements(false);
    }
    return this._allElements;
  }

  get elementsForColumns() {
    if (!this._elementsForColumns) {
      this._elementsForColumns = [];

      const elements = this.allElements;

      for (const element of elements) {
        const skip = element.isSectionElement ||
                     element.isLabelElement;

        if (!skip) {
          this._elementsForColumns.push(element);
        }
      }
    }

    return this._elementsForColumns;
  }
}
