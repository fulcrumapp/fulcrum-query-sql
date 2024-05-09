"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fulcrum_core_1 = require("fulcrum-core");
const column_1 = __importDefault(require("./column"));
class ElementColumn extends column_1.default {
    constructor({ element, rawColumn, type, id, part, index }) {
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
    get alias() {
        return this.columnName;
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
            if (feature instanceof fulcrum_core_1.Record) {
                return feature.statusValue;
            }
            return new fulcrum_core_1.StatusValue(this.element, feature.recordStatus);
        }
        return feature.formValues.get(this.element.key);
    }
    exportValue(feature, options) {
        const value = this.valueFrom(feature);
        if (value) {
            return value.format(Object.assign({ feature, part: this.part }, options));
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
            this.element.isSignatureElement ||
            this.element.isAttachmentElement ||
            this.element.isRepeatableElement) {
            return false;
        }
        return true;
    }
}
exports.default = ElementColumn;
//# sourceMappingURL=element-column.js.map