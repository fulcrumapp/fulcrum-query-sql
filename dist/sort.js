"use strict";

exports.__esModule = true;
exports.Sort = exports.DIRECTION_DESC = exports.DIRECTION_ASC = exports.DIRECTIONS = void 0;
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
var DIRECTION_ASC = 'asc';
exports.DIRECTION_ASC = DIRECTION_ASC;
var DIRECTION_DESC = 'desc';
exports.DIRECTION_DESC = DIRECTION_DESC;
var DIRECTIONS = {
  Asc: DIRECTION_ASC,
  Desc: DIRECTION_DESC
};
exports.DIRECTIONS = DIRECTIONS;
var Sort = /*#__PURE__*/function () {
  function Sort(attrs, schema) {
    this._field = attrs.field || null;
    this._direction = attrs.direction || null;
    this._schema = schema;
  }
  var _proto = Sort.prototype;
  _proto.toJSON = function toJSON() {
    return {
      field: this._field,
      direction: this._direction
    };
  };
  _proto.toHumanDescription = function toHumanDescription() {
    if (!this.isValid) {
      return null;
    }
    return [this.column ? this.column.name : this.columnName, this.direction.toUpperCase()].join(' ');
  };
  _createClass(Sort, [{
    key: "isValid",
    get: function get() {
      return !!this.column;
    }
  }, {
    key: "direction",
    get: function get() {
      return this._direction;
    },
    set: function set(direction) {
      this._direction = direction;
    }
  }, {
    key: "field",
    get: function get() {
      return this._field;
    }
  }, {
    key: "column",
    get: function get() {
      return this._schema.columnForFieldKey(this.field);
    },
    set: function set(column) {
      this._field = column ? column.id : null;
    }
  }, {
    key: "columnName",
    get: function get() {
      if (this.column) {
        return this.column.columnName;
      }
      return null;
    }
  }]);
  return Sort;
}();
exports.Sort = Sort;
//# sourceMappingURL=sort.js.map