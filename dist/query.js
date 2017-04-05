'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _condition = require('./condition');

var _expression = require('./expression');

var _sortExpressions = require('./sort-expressions');

var _sortExpressions2 = _interopRequireDefault(_sortExpressions);

var _converter = require('./ast/converter');

var _converter2 = _interopRequireDefault(_converter);

var _columnFilter = require('./column-filter');

var _columnFilter2 = _interopRequireDefault(_columnFilter);

var _pgQueryDeparser = require('pg-query-deparser');

var _pgQueryDeparser2 = _interopRequireDefault(_pgQueryDeparser);

var _queryOptions = require('./query-options');

var _queryOptions2 = _interopRequireDefault(_queryOptions);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _columnSettings = require('./column-settings');

var _columnSettings2 = _interopRequireDefault(_columnSettings);

var _helpers = require('./ast/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Query = function () {
  function Query(attrs) {
    _classCallCheck(this, Query);

    this._ast = attrs.ast;
    this._form = attrs.form;
    this._repeatableKey = attrs.repeatableKey;
    this._schema = attrs.schema;
    this._filter = new _condition.Condition(attrs.filter, attrs.schema);
    this._sorting = new _sortExpressions2.default(attrs.sorting, attrs.schema);
    this._boundingBox = attrs.bounding_box || null;
    this._searchFilter = attrs.search_filter;
    this._dateFilter = new _expression.Expression(attrs.date_filter || { field: this.defaultDateField }, attrs.schema);
    this._options = new _queryOptions2.default(attrs.options || {});
    this._columnSettings = new _columnSettings2.default(this._schema, attrs.columns);
    this._statusFilter = new _columnFilter2.default(_extends({}, attrs.status_filter, { field: attrs.repeatableKey ? '_record_status' : '_status' }), this._schema);
    this._projectFilter = new _columnFilter2.default(_extends({}, attrs.project_filter, { field: attrs.repeatableKey ? 'record_project.name' : 'project.name' }), this._schema);
    this._assignmentFilter = new _columnFilter2.default(_extends({}, attrs.assignment_filter, { field: attrs.repeatableKey ? 'record_assigned_to.name' : 'assigned_to.name' }), this._schema);

    this.setup();
  }

  Query.prototype.clearAllFilters = function clearAllFilters() {
    this.statusFilter.reset();
    this.projectFilter.reset();
    this.assignmentFilter.reset();

    this.columnSettings.reset();

    this._filter = new _condition.Condition(null, this._schema);
    this._sorting = new _sortExpressions2.default(null, this._schema);
    // this._boundingBox = null;
    this._searchFilter = '';
    this._dateFilter = new _expression.Expression({ field: this.defaultDateField }, this._schema);
  };

  Query.prototype.toJSON = function toJSON() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$boundingBox = _ref.boundingBox,
        boundingBox = _ref$boundingBox === undefined ? false : _ref$boundingBox;

    return {
      filter: this.filter.toJSON(),
      sorting: this.sorting.toJSON(),
      options: this.options.toJSON(),
      bounding_box: boundingBox ? this.boundingBox : null,
      search_filter: this.searchFilter,
      date_filter: this.dateFilter.toJSON(),
      columns: this.columnSettings.toJSON(),
      status_filter: this.statusFilter.toJSON(),
      project_filter: this.projectFilter.toJSON(),
      assignment_filter: this.assignmentFilter.toJSON()
    };
  };

  Query.prototype.toRawAST = function toRawAST(options) {
    return new _converter2.default().toAST(this, options);
  };

  Query.prototype.toCountAST = function toCountAST(options) {
    return new _converter2.default().toCountAST(this, options);
  };

  Query.prototype.toTileAST = function toTileAST(options) {
    return new _converter2.default().toTileAST(this, options);
  };

  Query.prototype.toDistinctValuesAST = function toDistinctValuesAST(options) {
    return new _converter2.default().toDistinctValuesAST(this, options);
  };

  Query.prototype.toHistogramAST = function toHistogramAST(options) {
    return new _converter2.default().toHistogramAST(this, options);
  };

  Query.prototype.toAST = function toAST(_ref2) {
    var applySort = _ref2.applySort,
        pageSize = _ref2.pageSize,
        pageIndex = _ref2.pageIndex,
        outerLimit = _ref2.outerLimit;

    var finalLimit = outerLimit ? (0, _helpers.AConst)((0, _helpers.IntegerValue)(+outerLimit)) : null;

    var sortClause = applySort ? this.outerSortClause : null;

    var fromClause = this.fromClause(_extends({ applySort: applySort, pageSize: pageSize, pageIndex: pageIndex }, this.runtimeFilters));

    return (0, _helpers.SelectStmt)({
      targetList: this.targetList(),
      fromClause: fromClause,
      sortClause: sortClause,
      limitCount: finalLimit
    });
  };

  Query.prototype.deparse = function deparse(ast) {
    return new _pgQueryDeparser2.default().deparse(ast);
  };

  Query.prototype.toSchemaAST = function toSchemaAST(ast, options) {
    return new _converter2.default().toSchemaAST(ast, options);
  };

  Query.prototype.toDistinctValuesSQL = function toDistinctValuesSQL(options) {
    return this.deparse(this.toDistinctValuesAST(options));
  };

  Query.prototype.toHistogramSQL = function toHistogramSQL(options) {
    return this.deparse(this.toHistogramAST(options));
  };

  Query.prototype.toCountSQL = function toCountSQL() {
    return this.deparse(this.toCountAST(this.runtimeFilters));
  };

  Query.prototype.toSQL = function toSQL(_ref3) {
    var applySort = _ref3.applySort,
        pageSize = _ref3.pageSize,
        pageIndex = _ref3.pageIndex,
        outerLimit = _ref3.outerLimit;

    var options = _extends({
      applySort: applySort,
      pageSize: pageSize,
      pageIndex: pageIndex,
      outerLimit: outerLimit
    }, this.runtimeFilters);

    return this.deparse(this.toAST(options));
  };

  Query.prototype.toTileSQL = function toTileSQL() {
    return this.deparse(this.toTileAST(this.runtimeFilters));
  };

  Query.prototype.toSummarySQL = function toSummarySQL(columnSetting) {
    var ast = new _converter2.default().toSummaryAST(this, columnSetting, this.runtimeFilters);
    return this.deparse(ast);
  };

  Query.prototype.targetList = function targetList() {
    if (this.ast) {
      return [(0, _helpers.ResTarget)((0, _helpers.ColumnRef)((0, _helpers.AStar)()))];
    }

    var timeZoneCast = function timeZoneCast(columnRef) {
      return (0, _helpers.FuncCall)([(0, _helpers.StringValue)('pg_catalog'), (0, _helpers.StringValue)('timezone')], [(0, _helpers.AConst)((0, _helpers.StringValue)('UTC')), columnRef]);
    };

    var timeZoneFormat = (0, _helpers.AConst)((0, _helpers.StringValue)('YYYY-MM-DD"T"HH24:MI:SS"Z"'));

    var joinedColumns = [];

    // The "subJoinColumns" are joins that need to happen in the inner sub-select from Converter.
    // We don't need to join them in the outer part.
    var subJoinColumns = this.joinColumnsWithSorting;

    if (this.schema.createdByColumn) {
      if (subJoinColumns.indexOf(this.schema.createdByColumn) === -1) {
        joinedColumns.push((0, _helpers.ResTarget)((0, _helpers.ColumnRef)('name', 'created_by'), 'created_by'));
      } else {
        joinedColumns.push((0, _helpers.ResTarget)((0, _helpers.ColumnRef)('created_by.name'), 'created_by'));
      }
    }

    if (this.schema.updatedByColumn) {
      if (subJoinColumns.indexOf(this.schema.updatedByColumn) === -1) {
        joinedColumns.push((0, _helpers.ResTarget)((0, _helpers.ColumnRef)('name', 'updated_by'), 'updated_by'));
      } else {
        joinedColumns.push((0, _helpers.ResTarget)((0, _helpers.ColumnRef)('updated_by.name'), 'updated_by'));
      }
    }

    if (this.schema.assignedToColumn) {
      var alias = this.schema.assignedToColumn.join.alias;

      if (subJoinColumns.indexOf(this.schema.assignedToColumn) === -1) {
        joinedColumns.push((0, _helpers.ResTarget)((0, _helpers.ColumnRef)('name', alias), alias));
      } else {
        joinedColumns.push((0, _helpers.ResTarget)((0, _helpers.ColumnRef)(alias + '.name'), alias));
      }
    }

    if (this.schema.projectColumn) {
      var _alias = this.schema.projectColumn.join.alias;

      if (subJoinColumns.indexOf(this.schema.projectColumn) === -1) {
        joinedColumns.push((0, _helpers.ResTarget)((0, _helpers.ColumnRef)('name', _alias), _alias));
      } else {
        joinedColumns.push((0, _helpers.ResTarget)((0, _helpers.ColumnRef)(_alias + '.name'), _alias));
      }
    }

    if (this.repeatableKey) {
      return [(0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_record_status'), 'record_status'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_version'), 'version'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_child_record_id'), 'id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_record_id'), 'record_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_parent_id'), 'parent_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_index'), 'index'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)([(0, _helpers.StringValue)('pg_catalog'), (0, _helpers.StringValue)('date_part')], [(0, _helpers.AConst)((0, _helpers.StringValue)('epoch')), timeZoneCast((0, _helpers.ColumnRef)('_server_created_at'))]), 'created_at'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)([(0, _helpers.StringValue)('pg_catalog'), (0, _helpers.StringValue)('date_part')], [(0, _helpers.AConst)((0, _helpers.StringValue)('epoch')), timeZoneCast((0, _helpers.ColumnRef)('_server_updated_at'))]), 'updated_at'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)([(0, _helpers.StringValue)('pg_catalog'), (0, _helpers.StringValue)('date_part')], [(0, _helpers.AConst)((0, _helpers.StringValue)('epoch')), timeZoneCast((0, _helpers.ColumnRef)('_created_at'))]), 'client_created_at'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)([(0, _helpers.StringValue)('pg_catalog'), (0, _helpers.StringValue)('date_part')], [(0, _helpers.AConst)((0, _helpers.StringValue)('epoch')), timeZoneCast((0, _helpers.ColumnRef)('_updated_at'))]), 'client_updated_at'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_created_by_id'), 'created_by_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_updated_by_id'), 'updated_by_id'), (0, _helpers.ResTarget)((0, _helpers.TypeCast)((0, _helpers.TypeName)('text'), (0, _helpers.AConst)((0, _helpers.StringValue)(this.form.id))), 'form_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_record_project_id'), 'record_project_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_record_assigned_to_id'), 'record_assigned_to_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_form_values'), 'form_values'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_latitude'), 'latitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_longitude'), 'longitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_edited_duration'), 'edited_duration'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_updated_duration'), 'updated_duration'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_created_duration'), 'created_duration')].concat(joinedColumns);
    }

    return [(0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_status'), 'status'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_version'), 'version'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_record_id'), 'id'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)('to_char', [timeZoneCast((0, _helpers.ColumnRef)('_server_created_at')), timeZoneFormat]), 'created_at'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)('to_char', [timeZoneCast((0, _helpers.ColumnRef)('_server_updated_at')), timeZoneFormat]), 'updated_at'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)('to_char', [timeZoneCast((0, _helpers.ColumnRef)('_created_at')), timeZoneFormat]), 'client_created_at'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)('to_char', [timeZoneCast((0, _helpers.ColumnRef)('_updated_at')), timeZoneFormat]), 'client_updated_at'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_created_by_id'), 'created_by_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_updated_by_id'), 'updated_by_id'), (0, _helpers.ResTarget)((0, _helpers.TypeCast)((0, _helpers.TypeName)('text'), (0, _helpers.AConst)((0, _helpers.StringValue)(this.form.id))), 'form_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_project_id'), 'project_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_assigned_to_id'), 'assigned_to_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_form_values'), 'form_values'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_latitude'), 'latitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_longitude'), 'longitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_altitude'), 'altitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_speed'), 'speed'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_course'), 'course'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_horizontal_accuracy'), 'horizontal_accuracy'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_vertical_accuracy'), 'vertical_accuracy'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_edited_duration'), 'edited_duration'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_updated_duration'), 'updated_duration'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_created_duration'), 'created_duration')].concat(joinedColumns);
  };

  Query.prototype.fromClause = function fromClause(_ref4) {
    var applySort = _ref4.applySort,
        pageSize = _ref4.pageSize,
        pageIndex = _ref4.pageIndex,
        boundingBox = _ref4.boundingBox,
        searchFilter = _ref4.searchFilter;

    var ast = applySort ? this.toRawAST({ sort: this.sortClause, pageSize: pageSize, pageIndex: pageIndex, boundingBox: boundingBox, searchFilter: searchFilter }) : this.toRawAST({ boundingBox: boundingBox, searchFilter: searchFilter });

    var baseQuery = (0, _helpers.RangeSubselect)(ast, (0, _helpers.Alias)('records'));

    if (this.ast) {
      return [baseQuery];
    }

    // The "subJoinColumns" are joins that need to happen in the inner sub-select from Converter.
    // We don't need to join them in the outer part.
    var subJoinColumns = this.joinColumnsWithSorting;

    if (this.schema.createdByColumn && subJoinColumns.indexOf(this.schema.createdByColumn) === -1) {
      baseQuery = _converter2.default.joinClause(baseQuery, this.schema.createdByColumn.join);
    }

    if (this.schema.updatedByColumn && subJoinColumns.indexOf(this.schema.updatedByColumn) === -1) {
      baseQuery = _converter2.default.joinClause(baseQuery, this.schema.updatedByColumn.join);
    }

    if (this.schema.assignedToColumn && subJoinColumns.indexOf(this.schema.assignedToColumn) === -1) {
      baseQuery = _converter2.default.joinClause(baseQuery, this.schema.assignedToColumn.join);
    }

    if (this.schema.projectColumn && subJoinColumns.indexOf(this.schema.projectColumn) === -1) {
      baseQuery = _converter2.default.joinClause(baseQuery, this.schema.projectColumn.join);
    }

    return [baseQuery];
  };

  Query.prototype.toHumanDescription = function toHumanDescription() {
    var parts = [];

    var description = null;

    if (description = this.statusFilter.toHumanDescription()) {
      parts.push(description);
    }

    if (description = this.projectFilter.toHumanDescription()) {
      parts.push(description);
    }

    if (description = this.assignmentFilter.toHumanDescription()) {
      parts.push(description);
    }

    if (description = this.columnSettings.columns.map(function (o) {
      return o.filter;
    }).map(function (o) {
      return o.toHumanDescription();
    })) {
      for (var _iterator = description, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref5;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref5 = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref5 = _i.value;
        }

        var desc = _ref5;

        if (desc) {
          parts.push(desc);
        }
      }
    }

    if (this.searchFilter) {
      parts.push('Search by ' + this.searchFilter);
    }

    if (description = this.dateFilter.toHumanDescription()) {
      parts.push(description);
    }

    // if ((description = this.filter.toHumanDescription())) {
    //   parts.push(description);
    // }

    if (description = this.sorting.toHumanDescription()) {
      parts.push(description);
    }

    return parts.join(', ');
  };

  Query.prototype.setup = function setup() {
    if (!this.ast) {
      return;
    }

    var geometryColumns = this.schema.geometryColumns;

    if (geometryColumns.length) {
      // For custom SQL, we need to add a column called __geometry at the end that evaluates to the
      // exact same expression as the first geometry column. This is needed so that queries like
      // SELECT geom, * FROM table will work when we need to reference the geom column from an outer
      // query.
      var geometryColumn = geometryColumns[0];

      _converter2.default.duplicateResTargetWithExactName(this, this.ast.SelectStmt.targetList, geometryColumn, '__geometry');
    }
  };

  _createClass(Query, [{
    key: 'ast',
    get: function get() {
      return this._ast;
    }
  }, {
    key: 'form',
    get: function get() {
      return this._form;
    }
  }, {
    key: 'repeatableKey',
    get: function get() {
      return this._repeatableKey;
    }
  }, {
    key: 'schema',
    get: function get() {
      return this._schema;
    }
  }, {
    key: 'filter',
    get: function get() {
      return this._filter;
    }
  }, {
    key: 'sorting',
    get: function get() {
      return this._sorting;
    }
  }, {
    key: 'columnSettings',
    get: function get() {
      return this._columnSettings;
    }
  }, {
    key: 'dateFilter',
    get: function get() {
      return this._dateFilter;
    }
  }, {
    key: 'statusFilter',
    get: function get() {
      return this._statusFilter;
    }
  }, {
    key: 'projectFilter',
    get: function get() {
      return this._projectFilter;
    }
  }, {
    key: 'assignmentFilter',
    get: function get() {
      return this._assignmentFilter;
    }
  }, {
    key: 'options',
    get: function get() {
      return this._options;
    }
  }, {
    key: 'hasFilter',
    get: function get() {
      return this.statusFilter.hasFilter || this.projectFilter.hasFilter || this.assignmentFilter.hasFilter || this.columnSettings.columns.find(function (o) {
        return o.hasFilter;
      }) || this.searchFilter || this.dateFilter.isValid || this.filter.expressions.find(function (o) {
        return o.isValid;
      }) || this.sorting.hasSort;
    }
  }, {
    key: 'joinColumns',
    get: function get() {
      var joins = [];

      if (this.projectFilter.hasFilter) {
        joins.push(this.projectFilter.column);
      }

      if (this.assignmentFilter.hasFilter) {
        joins.push(this.assignmentFilter.column);
      }

      joins.push.apply(joins, this.columnSettings.columns.filter(function (o) {
        return o.hasFilter && o.column.join;
      }).map(function (o) {
        return o.column;
      }));

      joins.push.apply(joins, this.filter.allExpressions.filter(function (o) {
        return o.isValid && o.column.join;
      }).map(function (o) {
        return o.column;
      }));

      return joins;
    }
  }, {
    key: 'referencedColumns',
    get: function get() {
      var columns = [];

      if (this.projectFilter.hasFilter) {
        columns.push(this.projectFilter.column);
      }

      if (this.assignmentFilter.hasFilter) {
        columns.push(this.assignmentFilter.column);
      }

      columns.push.apply(columns, this.columnSettings.columns.filter(function (o) {
        return o.hasFilter;
      }).map(function (o) {
        return o.column;
      }));

      columns.push.apply(columns, this.filter.allExpressions.filter(function (o) {
        return o.isValid;
      }).map(function (o) {
        return o.column;
      }));

      if (this.sorting.hasSort) {
        columns.push.apply(columns, this.sorting.expressions.filter(function (o) {
          return o.isValid;
        }).map(function (o) {
          return o.column;
        }));
      }

      return columns;
    }
  }, {
    key: 'joinColumnsWithSorting',
    get: function get() {
      var joins = this.joinColumns;

      if (this.sorting.hasSort) {
        joins.push.apply(joins, this.sorting.expressions.filter(function (o) {
          return o.isValid && o.column.join;
        }).map(function (o) {
          return o.column;
        }));
      }

      return joins;
    }
  }, {
    key: 'defaultDateField',
    get: function get() {
      return this.repeatableKey ? '_updated_at' : '_server_updated_at';
    }
  }, {
    key: 'boundingBox',
    set: function set(box) {
      this._boundingBox = box;
    },
    get: function get() {
      return this._boundingBox;
    }
  }, {
    key: 'searchFilter',
    get: function get() {
      return this._searchFilter || '';
    },
    set: function set(filter) {
      this._searchFilter = filter;
    }
  }, {
    key: 'runtimeFilters',
    get: function get() {
      return {
        boundingBox: this.boundingBox,
        searchFilter: this.searchFilter,
        dateFilter: this.dateFilter
      };
    }
  }, {
    key: 'sortClause',
    get: function get() {
      var _this = this;

      if (this.sorting.isEmpty) {
        return this.systemSortClause;
      }

      // always add the record ID to the sorting so it's stable across executions
      var sorts = this.sorting.expressions.map(function (sort) {
        var direction = sort.direction === 'desc' ? 2 : 1;

        if (_this.ast) {
          return [(0, _helpers.SortBy)((0, _helpers.ColumnRef)(sort.column.id, sort.column.source), direction, 0)];
        }

        return [(0, _helpers.SortBy)((0, _helpers.ColumnRef)(sort.column.columnName, sort.column.source), direction, 0), (0, _helpers.SortBy)((0, _helpers.ColumnRef)('_record_id'), direction, 0)];
      });

      return _lodash2.default.flatten(sorts);
    }
  }, {
    key: 'systemSortClause',
    get: function get() {
      if (this.ast) {
        return [(0, _helpers.SortBy)((0, _helpers.AConst)((0, _helpers.IntegerValue)(1)), 2, 0)];
      }

      if (this.repeatableKey) {
        return [(0, _helpers.SortBy)((0, _helpers.ColumnRef)('_updated_at'), 2, 0)];
      }

      return [(0, _helpers.SortBy)((0, _helpers.ColumnRef)('_server_updated_at'), 2, 0)];
    }
  }, {
    key: 'outerSortClause',
    get: function get() {
      return [(0, _helpers.SortBy)((0, _helpers.ColumnRef)('__row_number'), 1, 0)];
    }
  }]);

  return Query;
}();

exports.default = Query;
//# sourceMappingURL=query.js.map