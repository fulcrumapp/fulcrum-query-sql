'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sort = require('./sort');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SortExpressions = function () {
  function SortExpressions(sorts, schema) {
    _classCallCheck(this, SortExpressions);

    sorts = sorts || [];

    this._expressions = sorts.map(function (o) {
      return new _sort.Sort(o, schema);
    });
    this._schema = schema;
  }

  SortExpressions.prototype.sortByAsc = function sortByAsc(column) {
    this._expressions = [new _sort.Sort({ field: column.id, direction: 'asc' }, this._schema)];
  };

  SortExpressions.prototype.sortByDesc = function sortByDesc(column) {
    this._expressions = [new _sort.Sort({ field: column.id, direction: 'desc' }, this._schema)];
  };

  SortExpressions.prototype.toJSON = function toJSON() {
    return this.expressions.map(function (o) {
      return o.toJSON();
    });
  };

  SortExpressions.prototype.toHumanDescription = function toHumanDescription() {
    if (!this.hasSort) {
      return null;
    }

    return this.expressions.map(function (o) {
      return o.toHumanDescription();
    }).join(', ');
  };

  _createClass(SortExpressions, [{
    key: 'isEmpty',
    get: function get() {
      return this._expressions.find(function (e) {
        return e.isValid;
      }).length === 0;
    }
  }, {
    key: 'hasSort',
    get: function get() {
      return !this.isEmpty;
    }
  }, {
    key: 'expressions',
    get: function get() {
      return this._expressions;
    }
  }]);

  return SortExpressions;
}();

exports.default = SortExpressions;
//# sourceMappingURL=sort-expressions.js.map