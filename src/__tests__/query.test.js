import Query from '../query.js';
import { OperatorType } from '../operator.js';

const makeColumn = (id, attrs = {}) => ({
  id,
  name: id,
  columnName: id,
  isArray: false,
  isDate: false,
  isNumber: false,
  isSQL: true,
  toJSON: () => ({ id }),
  ...attrs,
});

const makeSchema = (columns) => ({
  columns,
  columnForFieldKey: (field) => columns.find((column) => column.id === field) || null,
  geometryColumns: [],
});

const makeQuery = (columnSettings) => {
  const nameColumn = makeColumn('name');
  const serverUpdatedAtColumn = makeColumn('_server_updated_at', { isDate: true });

  return new Query({
    schema: makeSchema([nameColumn, serverUpdatedAtColumn]),
    columns: columnSettings(nameColumn),
  });
};

describe('Query.hasFilter', () => {
  it.each([
    ['search', (column) => [{ column, search: 'alpha' }]],
    ['filter', (column) => [{ column, filter: { value: ['alpha'] } }]],
    ['expression', (column) => [{
      column,
      expression: {
        operator: OperatorType.TextContain.name,
        value: ['alpha'],
      },
    }]],
    ['range', (column) => [{
      column: makeColumn(column.id, { isNumber: true }),
      range: {
        value: [1, 5],
      },
    }]],
  ])('detects column-level %s filters', (_label, columnSettings) => {
    expect(makeQuery(columnSettings).hasFilter).toBe(true);
  });
});