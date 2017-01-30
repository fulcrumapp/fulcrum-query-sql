'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DIRECTION_ASC = exports.DIRECTION_ASC = 'asc';

var DIRECTION_DESC = exports.DIRECTION_DESC = 'desc';

var DIRECTIONS = exports.DIRECTIONS = {
  Asc: DIRECTION_ASC,
  Desc: DIRECTION_DESC
};

var Sort = exports.Sort = function () {
  function Sort(attrs, schema) {
    _classCallCheck(this, Sort);

    this._field = attrs.field || null;
    this._direction = attrs.direction || null;
    this._schema = schema;
  }

  Sort.prototype.toJSON = function toJSON() {
    return {
      field: this._field,
      direction: this._direction
    };
  };

  Sort.prototype.toHumanDescription = function toHumanDescription() {
    if (!this.isValid) {
      return null;
    }

    return [this.columnName, this.direction.toUpperCase()].join(' ');
  };

  _createClass(Sort, [{
    key: 'isValid',
    get: function get() {
      return !this.column;
    }
  }, {
    key: 'direction',
    get: function get() {
      return this._direction;
    },
    set: function set(direction) {
      this._direction = direction;
    }
  }, {
    key: 'field',
    get: function get() {
      return this._field;
    }
  }, {
    key: 'column',
    get: function get() {
      return this._schema.columnForFieldKey(this.field);
    },
    set: function set(column) {
      this._field = column ? column.id : null;
    }
  }, {
    key: 'columnName',
    get: function get() {
      if (this.column) {
        return this.column.columnName;
      }
      return null;
    }
  }]);

  return Sort;
}();
//# sourceMappingURL=sort.js.map