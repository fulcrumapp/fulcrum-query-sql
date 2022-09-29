"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _condition = require("./condition");

var _expression = require("./expression");

var _sortExpressions = _interopRequireDefault(require("./sort-expressions"));

var _converter = _interopRequireDefault(require("./ast/converter"));

var _columnFilter = _interopRequireDefault(require("./column-filter"));

var _pgQueryDeparser = _interopRequireDefault(require("pg-query-deparser"));

var _queryOptions = _interopRequireDefault(require("./query-options"));

var _lodash = _interopRequireDefault(require("lodash"));

var _columnSettings = _interopRequireDefault(require("./column-settings"));

var _helpers = require("./ast/helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Query =
/*#__PURE__*/
function () {
  function Query(attrs) {
    this._ast = attrs.ast;
    this._form = attrs.form;
    this._repeatableKey = attrs.repeatableKey;
    this._schema = attrs.schema;
    this._filter = new _condition.Condition(attrs.filter, attrs.schema);
    this._sorting = new _sortExpressions["default"](attrs.sorting, attrs.schema);
    this._boundingBox = attrs.bounding_box || null;
    this._searchFilter = attrs.search_filter;
    this._dateFilter = new _expression.Expression(attrs.date_filter || {
      field: this.defaultDateField
    }, attrs.schema);
    this._options = new _queryOptions["default"](attrs.options || {});
    this._columnSettings = new _columnSettings["default"](this._schema, attrs.columns);
    this._statusFilter = new _columnFilter["default"](_extends({}, attrs.status_filter, {
      field: attrs.repeatableKey ? '_record_status' : '_status'
    }), this._schema);
    this._projectFilter = new _columnFilter["default"](_extends({}, attrs.project_filter, {
      field: attrs.repeatableKey ? 'record_project.name' : 'project.name'
    }), this._schema);
    this._assignmentFilter = new _columnFilter["default"](_extends({}, attrs.assignment_filter, {
      field: attrs.repeatableKey ? 'record_assigned_to.name' : 'assigned_to.name'
    }), this._schema);
    this._changesetFilter = new _columnFilter["default"](_extends({}, attrs.changeset_filter, {
      field: '_changeset_id'
    }), this._schema);
    this._full = attrs.full != null ? !!attrs.full : true;
    this.setup();
  }

  var _proto = Query.prototype;

  _proto.clearAllFilters = function clearAllFilters() {
    this.statusFilter.reset();
    this.changesetFilter.reset();
    this.projectFilter.reset();
    this.assignmentFilter.reset();
    this.columnSettings.reset();
    this._filter = new _condition.Condition(null, this._schema);
    this._sorting = new _sortExpressions["default"](null, this._schema); // this._boundingBox = null;

    this._searchFilter = '';
    this._dateFilter = new _expression.Expression({
      field: this.defaultDateField
    }, this._schema);
  };

  _proto.toJSON = function toJSON(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$boundingBox = _ref.boundingBox,
        boundingBox = _ref$boundingBox === void 0 ? false : _ref$boundingBox;

    return {
      filter: this.filter.toJSON(),
      sorting: this.sorting.toJSON(),
      options: this.options.toJSON(),
      bounding_box: boundingBox ? this.boundingBox : null,
      search_filter: this.searchFilter,
      date_filter: this.dateFilter.toJSON(),
      columns: this.columnSettings.toJSON(),
      status_filter: this.statusFilter.toJSON(),
      changeset_filter: this.changesetFilter.toJSON(),
      project_filter: this.projectFilter.toJSON(),
      assignment_filter: this.assignmentFilter.toJSON()
    };
  };

  _proto.toRawAST = function toRawAST(options) {
    return new _converter["default"]().toAST(this, options);
  };

  _proto.toCountAST = function toCountAST(options) {
    return new _converter["default"]().toCountAST(this, options);
  };

  _proto.toTileAST = function toTileAST(options) {
    return new _converter["default"]().toTileAST(this, options);
  };

  _proto.toDistinctValuesAST = function toDistinctValuesAST(options) {
    return new _converter["default"]().toDistinctValuesAST(this, options);
  };

  _proto.toHistogramAST = function toHistogramAST(options) {
    return new _converter["default"]().toHistogramAST(this, options);
  };

  _proto.toAST = function toAST(_ref2) {
    var applySort = _ref2.applySort,
        pageSize = _ref2.pageSize,
        pageIndex = _ref2.pageIndex,
        outerLimit = _ref2.outerLimit;
    var finalLimit = outerLimit ? (0, _helpers.AConst)((0, _helpers.IntegerValue)(+outerLimit)) : null;
    var sortClause = applySort ? this.outerSortClause : null;
    var fromClause = this.fromClause(_extends({
      applySort: applySort,
      pageSize: pageSize,
      pageIndex: pageIndex
    }, this.runtimeFilters));
    return (0, _helpers.SelectStmt)({
      targetList: this.targetList(),
      fromClause: fromClause,
      sortClause: sortClause,
      limitCount: finalLimit
    });
  };

  _proto.deparse = function deparse(ast) {
    return new _pgQueryDeparser["default"]().deparse(ast);
  };

  _proto.toSchemaAST = function toSchemaAST(ast, options) {
    return new _converter["default"]().toSchemaAST(ast, options);
  };

  _proto.toDistinctValuesSQL = function toDistinctValuesSQL(options) {
    return this.deparse(this.toDistinctValuesAST(options));
  };

  _proto.toHistogramSQL = function toHistogramSQL(options) {
    return this.deparse(this.toHistogramAST(options));
  };

  _proto.toCountSQL = function toCountSQL() {
    return this.deparse(this.toCountAST(this.runtimeFilters));
  };

  _proto.toSQL = function toSQL(_ref3) {
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

  _proto.toTileSQL = function toTileSQL() {
    return this.deparse(this.toTileAST(this.runtimeFilters));
  };

  _proto.toSummarySQL = function toSummarySQL(columnSetting) {
    var ast = new _converter["default"]().toSummaryAST(this, columnSetting, this.runtimeFilters);
    return this.deparse(ast);
  };

  _proto.targetList = function targetList() {
    if (this.ast) {
      return [(0, _helpers.ResTarget)((0, _helpers.ColumnRef)((0, _helpers.AStar)()))];
    }

    if (!this.full) {
      return _lodash["default"].compact(this.columnSettings.enabledColumns.map(function (column) {
        if (column.element && !column.rawColumn) {
          return null;
        }

        var columnAlias = column.columnName;

        if (column.join) {
          columnAlias = [column.join.alias, column.columnName].join('_');
        }

        return (0, _helpers.ResTarget)((0, _helpers.ColumnRef)(column.columnName, column.source || 'records'), columnAlias);
      }));
    }

    var timeZoneCast = function timeZoneCast(columnRef) {
      return (0, _helpers.FuncCall)([(0, _helpers.StringValue)('pg_catalog'), (0, _helpers.StringValue)('timezone')], [(0, _helpers.AConst)((0, _helpers.StringValue)('UTC')), columnRef]);
    };

    var timeZoneFormat = (0, _helpers.AConst)((0, _helpers.StringValue)('YYYY-MM-DD"T"HH24:MI:SS"Z"'));
    var recordKeyColumns = [];
    var joinedColumns = []; // The "subJoinColumns" are joins that need to happen in the inner sub-select from Converter.
    // We don't need to join them in the outer part.

    var subJoinColumns = this.joinColumnsWithSorting;

    for (var _iterator = this.schema._rawColumns, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref4;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref4 = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref4 = _i.value;
      }

      var column = _ref4;

      if (column.name === '_record_key') {
        recordKeyColumns.push((0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_record_key'), 'record_key'));
        recordKeyColumns.push((0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_record_sequence'), 'record_sequence'));
        break;
      }
    }

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

    if (this.schema.recordSeriesColumn) {
      var _alias2 = this.schema.recordSeriesColumn.join.alias;

      if (subJoinColumns.indexOf(this.schema.recordSeriesColumn) === -1) {
        joinedColumns.push((0, _helpers.ResTarget)((0, _helpers.ColumnRef)('rrule', _alias2), 'rrule'));
      } else {
        joinedColumns.push((0, _helpers.ResTarget)((0, _helpers.ColumnRef)(_alias2 + '.rrule'), 'rrule'));
      }
    }

    if (this.repeatableKey) {
      return [(0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_record_status'), 'record_status'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_version'), 'version'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_child_record_id'), 'id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_record_id'), 'record_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_parent_id'), 'parent_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_index'), 'index'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)([(0, _helpers.StringValue)('pg_catalog'), (0, _helpers.StringValue)('date_part')], [(0, _helpers.AConst)((0, _helpers.StringValue)('epoch')), timeZoneCast((0, _helpers.ColumnRef)('_server_created_at'))]), 'created_at'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)([(0, _helpers.StringValue)('pg_catalog'), (0, _helpers.StringValue)('date_part')], [(0, _helpers.AConst)((0, _helpers.StringValue)('epoch')), timeZoneCast((0, _helpers.ColumnRef)('_server_updated_at'))]), 'updated_at'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)([(0, _helpers.StringValue)('pg_catalog'), (0, _helpers.StringValue)('date_part')], [(0, _helpers.AConst)((0, _helpers.StringValue)('epoch')), timeZoneCast((0, _helpers.ColumnRef)('_created_at'))]), 'client_created_at'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)([(0, _helpers.StringValue)('pg_catalog'), (0, _helpers.StringValue)('date_part')], [(0, _helpers.AConst)((0, _helpers.StringValue)('epoch')), timeZoneCast((0, _helpers.ColumnRef)('_updated_at'))]), 'client_updated_at'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_created_by_id'), 'created_by_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_updated_by_id'), 'updated_by_id'), (0, _helpers.ResTarget)((0, _helpers.TypeCast)((0, _helpers.TypeName)('text'), (0, _helpers.AConst)((0, _helpers.StringValue)(this.form.id))), 'form_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_record_project_id'), 'record_project_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_record_assigned_to_id'), 'record_assigned_to_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_form_values'), 'form_values'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_latitude'), 'latitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_longitude'), 'longitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_edited_duration'), 'edited_duration'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_updated_duration'), 'updated_duration'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_created_duration'), 'created_duration'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_changeset_id'), 'changeset_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_created_latitude'), 'created_latitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_created_longitude'), 'created_longitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_created_altitude'), 'created_altitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_created_horizontal_accuracy'), 'created_horizontal_accuracy'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_updated_latitude'), 'updated_latitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_updated_longitude'), 'updated_longitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_updated_altitude'), 'updated_altitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_updated_horizontal_accuracy'), 'updated_horizontal_accuracy')].concat(!this.schema.hasRecordSeriesID ? [] : [(0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_record_series_id'), 'record_series_id')], joinedColumns);
    }

    return [(0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_status'), 'status'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_version'), 'version'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_record_id'), 'id'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)('to_char', [timeZoneCast((0, _helpers.ColumnRef)('_server_created_at')), timeZoneFormat]), 'created_at'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)('to_char', [timeZoneCast((0, _helpers.ColumnRef)('_server_updated_at')), timeZoneFormat]), 'updated_at'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)('to_char', [timeZoneCast((0, _helpers.ColumnRef)('_created_at')), timeZoneFormat]), 'client_created_at'), (0, _helpers.ResTarget)((0, _helpers.FuncCall)('to_char', [timeZoneCast((0, _helpers.ColumnRef)('_updated_at')), timeZoneFormat]), 'client_updated_at'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_created_by_id'), 'created_by_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_updated_by_id'), 'updated_by_id'), (0, _helpers.ResTarget)((0, _helpers.TypeCast)((0, _helpers.TypeName)('text'), (0, _helpers.AConst)((0, _helpers.StringValue)(this.form.id))), 'form_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_project_id'), 'project_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_assigned_to_id'), 'assigned_to_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_form_values'), 'form_values'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_latitude'), 'latitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_longitude'), 'longitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_altitude'), 'altitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_speed'), 'speed'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_course'), 'course'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_horizontal_accuracy'), 'horizontal_accuracy'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_vertical_accuracy'), 'vertical_accuracy'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_edited_duration'), 'edited_duration'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_updated_duration'), 'updated_duration'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_created_duration'), 'created_duration'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_changeset_id'), 'changeset_id'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_created_latitude'), 'created_latitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_created_longitude'), 'created_longitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_created_altitude'), 'created_altitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_created_horizontal_accuracy'), 'created_horizontal_accuracy'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_updated_latitude'), 'updated_latitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_updated_longitude'), 'updated_longitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_updated_altitude'), 'updated_altitude'), (0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_updated_horizontal_accuracy'), 'updated_horizontal_accuracy')].concat(!this.schema.hasRecordSeriesID ? [] : [(0, _helpers.ResTarget)((0, _helpers.ColumnRef)('_record_series_id'), 'record_series_id')], recordKeyColumns, joinedColumns);
  };

  _proto.fromClause = function fromClause(_ref5) {
    var applySort = _ref5.applySort,
        pageSize = _ref5.pageSize,
        pageIndex = _ref5.pageIndex,
        boundingBox = _ref5.boundingBox,
        searchFilter = _ref5.searchFilter;
    var ast = applySort ? this.toRawAST({
      sort: this.sortClause,
      pageSize: pageSize,
      pageIndex: pageIndex,
      boundingBox: boundingBox,
      searchFilter: searchFilter
    }) : this.toRawAST({
      boundingBox: boundingBox,
      searchFilter: searchFilter
    });
    var baseQuery = (0, _helpers.RangeSubselect)(ast, (0, _helpers.Alias)('records'));

    if (this.ast) {
      return [baseQuery];
    } // The "subJoinColumns" are joins that need to happen in the inner sub-select from Converter.
    // We don't need to join them in the outer part.


    if (this.schema.createdByColumn) {
      baseQuery = _converter["default"].joinClause(baseQuery, this.schema.createdByColumn.join);
    }

    if (this.schema.updatedByColumn) {
      baseQuery = _converter["default"].joinClause(baseQuery, this.schema.updatedByColumn.join);
    }

    if (this.schema.assignedToColumn) {
      baseQuery = _converter["default"].joinClause(baseQuery, this.schema.assignedToColumn.join);
    }

    if (this.schema.projectColumn) {
      baseQuery = _converter["default"].joinClause(baseQuery, this.schema.projectColumn.join);
    }

    if (this.schema.recordSeriesColumn) {
      baseQuery = _converter["default"].joinClause(baseQuery, this.schema.recordSeriesColumn.join);
    }

    return [baseQuery];
  };

  _proto.toHumanDescription = function toHumanDescription() {
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
      for (var _iterator2 = description, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref6;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref6 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref6 = _i2.value;
        }

        var desc = _ref6;

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
    } // if ((description = this.filter.toHumanDescription())) {
    //   parts.push(description);
    // }


    if (description = this.sorting.toHumanDescription()) {
      parts.push(description);
    }

    return parts.join(', ');
  };

  _proto.setup = function setup() {
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

      _converter["default"].duplicateResTargetWithExactName(this, this.ast.SelectStmt.targetList, geometryColumn, '__geometry');
    }
  };

  _createClass(Query, [{
    key: "ast",
    get: function get() {
      return this._ast;
    }
  }, {
    key: "form",
    get: function get() {
      return this._form;
    }
  }, {
    key: "repeatableKey",
    get: function get() {
      return this._repeatableKey;
    }
  }, {
    key: "schema",
    get: function get() {
      return this._schema;
    }
  }, {
    key: "filter",
    get: function get() {
      return this._filter;
    }
  }, {
    key: "sorting",
    get: function get() {
      return this._sorting;
    }
  }, {
    key: "columnSettings",
    get: function get() {
      return this._columnSettings;
    }
  }, {
    key: "dateFilter",
    get: function get() {
      return this._dateFilter;
    }
  }, {
    key: "statusFilter",
    get: function get() {
      return this._statusFilter;
    }
  }, {
    key: "changesetFilter",
    get: function get() {
      return this._changesetFilter;
    }
  }, {
    key: "projectFilter",
    get: function get() {
      return this._projectFilter;
    }
  }, {
    key: "assignmentFilter",
    get: function get() {
      return this._assignmentFilter;
    }
  }, {
    key: "options",
    get: function get() {
      return this._options;
    }
  }, {
    key: "full",
    get: function get() {
      return this._full;
    }
  }, {
    key: "hasFilter",
    get: function get() {
      return this.statusFilter.hasFilter || this.projectFilter.hasFilter || this.assignmentFilter.hasFilter || this.changesetFilter.hasFilter || this.columnSettings.columns.find(function (o) {
        return o.hasFilter;
      }) || this.searchFilter || this.dateFilter.isValid || this.filter.expressions.find(function (o) {
        return o.isValid;
      }) || this.sorting.hasSort;
    }
  }, {
    key: "joinColumns",
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
    key: "referencedColumns",
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
    key: "joinColumnsWithSorting",
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
    key: "defaultDateField",
    get: function get() {
      return this.repeatableKey ? '_updated_at' : '_server_updated_at';
    }
  }, {
    key: "boundingBox",
    set: function set(box) {
      this._boundingBox = box;
    },
    get: function get() {
      return this._boundingBox;
    }
  }, {
    key: "searchFilter",
    get: function get() {
      return this._searchFilter || '';
    },
    set: function set(filter) {
      this._searchFilter = filter;
    }
  }, {
    key: "runtimeFilters",
    get: function get() {
      return {
        boundingBox: this.boundingBox,
        searchFilter: this.searchFilter,
        dateFilter: this.dateFilter
      };
    }
  }, {
    key: "sortClause",
    get: function get() {
      var _this = this;

      if (this.sorting.isEmpty) {
        return this.systemSortClause;
      } // always add the record ID to the sorting so it's stable across executions


      var sorts = this.sorting.expressions.map(function (sort) {
        var direction = sort.direction === 'desc' ? 2 : 1;

        if (_this.ast) {
          return [(0, _helpers.SortBy)((0, _helpers.ColumnRef)(sort.column.id, sort.column.source), direction, 0)];
        }

        return [(0, _helpers.SortBy)((0, _helpers.ColumnRef)(sort.column.columnName, sort.column.source || 'records'), direction, 0), (0, _helpers.SortBy)((0, _helpers.ColumnRef)('_record_id', 'records'), direction, 0)];
      });
      return _lodash["default"].flatten(sorts);
    }
  }, {
    key: "systemSortClause",
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
    key: "outerSortClause",
    get: function get() {
      return [(0, _helpers.SortBy)((0, _helpers.ColumnRef)('__row_number'), 1, 0)];
    }
  }]);

  return Query;
}();

exports["default"] = Query;
//# sourceMappingURL=query.js.map