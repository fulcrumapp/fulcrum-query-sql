import { Form } from '@fulcrumapp/fulcrum-core';
import FormSchema from '../form-schema.js';
import Query from '../query.js';

const form = new Form({
  id: 'histogram-form',
  elements: [
    {
      type: 'TextField',
      key: 'number',
      data_name: 'number',
      numeric: true,
    },
    {
      type: 'DateTimeField',
      key: 'date',
      data_name: 'date',
    },
  ],
});

const schema = new FormSchema(form, [
  { field: 'number', name: 'number', type: 'double' },
  { field: 'date', name: 'date', type: 'timestamp' },
  { name: '_server_updated_at', type: 'timestamp' },
], {}, { fullSchema: false });

describe('Query.toHistogramSQL', () => {
  it.each([
    ['numeric', 'number', 'number'],
    ['date', 'date', 'date'],
  ])('uses a valid upper bound for identical %s values', (_label, field, type) => {
    const column = schema.columnForFieldKey(field);
    const query = new Query({ form, schema, full: true });

    const sql = query.toHistogramSQL({
      column,
      bucketSize: 63,
      type,
    });

    expect(sql).toMatch(
      /width_bucket\([\s\S]*COALESCE\(nullif\("max_value", "min_value"\), \(\("min_value"\) \+ \(1\)\)\)/,
    );
  });
});
