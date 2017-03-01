'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Column = function () {
  function Column() {
    _classCallCheck(this, Column);
  }

  Column.prototype.toJSON = function toJSON() {
    return {
      id: this.id
    };
  };

  _createClass(Column, [{
    key: 'isArray',
    get: function get() {
      return this.type === 'array';
    }
  }, {
    key: 'isDate',
    get: function get() {
      return this.type === 'timestamp';
    }
  }, {
    key: 'isNumber',
    get: function get() {
      return this.type === 'double' || this.type === 'integer';
    }
  }, {
    key: 'supportsRanges',
    get: function get() {
      return this.isNumber || this.isDate;
    }
  }]);

  return Column;
}();

exports.default = Column;
//# sourceMappingURL=column.js.map