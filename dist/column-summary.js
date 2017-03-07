'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _aggregate = require('./aggregate');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ColumnSummary = function () {
  function ColumnSummary(attrs, schema) {
    _classCallCheck(this, ColumnSummary);

    this._field = attrs.field;
    this._aggregate = attrs.aggregate;
    this._schema = schema;
  }

  ColumnSummary.prototype.availableAggregates = function availableAggregates() {
    return (0, _aggregate.availableAggregatesForColumn)(this.column);
  };

  _createClass(ColumnSummary, [{
    key: 'field',
    get: function get() {
      return this._field;
    }
  }, {
    key: 'column',
    get: function get() {
      return this._schema.columnForFieldKey(this.field);
    }
  }, {
    key: 'columnName',
    get: function get() {
      if (this.column) {
        return this.column.columnName;
      }
      return null;
    }
  }, {
    key: 'aggregate',
    set: function set(aggregate) {
      this._aggregate = aggregate;
    },
    get: function get() {
      return this._aggregate;
    }
  }]);

  return ColumnSummary;
}();

exports.default = ColumnSummary;
//# sourceMappingURL=column-summary.js.map