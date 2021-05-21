"use strict";

exports.__esModule = true;
exports["default"] = void 0;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Column = /*#__PURE__*/function () {
  function Column() {}

  var _proto = Column.prototype;

  _proto.toJSON = function toJSON() {
    return {
      id: this.id
    };
  };

  _createClass(Column, [{
    key: "isArray",
    get: function get() {
      return this.type === 'array';
    }
  }, {
    key: "isDate",
    get: function get() {
      return this.type === 'timestamp' || this.type === 'date';
    }
  }, {
    key: "isTime",
    get: function get() {
      return this.type === 'time';
    }
  }, {
    key: "isDateTime",
    get: function get() {
      return this.type === 'timestamp';
    }
  }, {
    key: "isNumber",
    get: function get() {
      return this.isDouble || this.isInteger;
    }
  }, {
    key: "isDouble",
    get: function get() {
      return this.type === 'double';
    }
  }, {
    key: "isInteger",
    get: function get() {
      return this.type === 'integer';
    }
  }, {
    key: "isGeometry",
    get: function get() {
      return this.type === 'geometry';
    }
  }, {
    key: "supportsRanges",
    get: function get() {
      return this.isNumber || this.isDate;
    }
  }, {
    key: "canSearch",
    get: function get() {
      return true;
    }
  }, {
    key: "isSortable",
    get: function get() {
      return true;
    }
  }, {
    key: "index",
    get: function get() {
      return this._index;
    }
  }]);

  return Column;
}();

exports["default"] = Column;
//# sourceMappingURL=column.js.map