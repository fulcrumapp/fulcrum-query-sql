import { StatusValue, Record } from 'fulcrum-core';
import Column from './column';

export default class ElementColumn extends Column {
  constructor({element, rawColumn, type, id, part, index}) {
    super();

    this._type = type;
    this._element = element;
    this._rawColumn = rawColumn;
    this._id = id || element.key;
    this._part = part;
    this._index = index;

    if (part) {
      this._id += '_' + part;
    }
  }

  get type() {
    return this._type;
  }

  get name() {
    if (this.part) {
      return this.element.label + ' (' + this.part + ')';
    }

    return this.element.label;
  }

  get element() {
    return this._element;
  }

  get rawColumn() {
    return this._rawColumn;
  }

  get columnName() {
    if (this.rawColumn) {
      return this.rawColumn.name;
    }

    if (this.part) {
      return this.element.dataName + '_' + this.part;
    }

    return this.element.dataName;
  }

  get id() {
    return this._id;
  }

  get part() {
    return this._part;
  }

  valueFrom(feature) {
    if (this.element.isStatusElement) {
      if (feature instanceof Record) {
        return feature.statusValue;
      }

      return new StatusValue(this.element, feature.recordStatus);
    }

    return feature.formValues.get(this.element.key);
  }

  exportValue(feature, options) {
    const value = this.valueFrom(feature);

    if (value) {
      return value.format({feature, part: this.part, ...options});
    }

    return null;
  }

  get canSearch() {
    if (this.element.isPhotoElement ||
        this.element.isVideoElement ||
        this.element.isAudioElement ||
        this.element.isSignatureElement ||
        this.element.isAttachmentElement ||
        this.element.isRepeatableElement) {
      return false;
    }

    return true;
  }

  get supportsRanges() {
    // Repeatable columns are an exception, they don't support ranges yet because we don't
    // have a physical column to query.
    if (this.element.isRepeatableElement) {
      return false;
    }

    return this.isNumber || this.isDate;
  }

  get isSortable() {
    if (this.element.isPhotoElement ||
        this.element.isVideoElement ||
        this.element.isAudioElement ||
        this.element.isSketchElement ||
        this.element.isSignatureElement ||
        this.element.isAttachmentElement ||
        this.element.isRepeatableElement) {
      return false;
    }

    return true;
  }
}
