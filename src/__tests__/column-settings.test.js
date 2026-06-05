import ColumnSettings from '../column-settings.js';

// Minimal column stub that satisfies ColumnSettingsItem requirements
const makeColumn = (id) => ({ id, isDate: false, isNumber: false, toJSON: () => ({ id }) });

// Minimal schema stub with the columns ColumnSettings.constructor expects
const makeSchema = (...ids) => ({
  columns: ids.map(makeColumn),
});

const makeColumnSettings = (...ids) => new ColumnSettings(makeSchema(...ids), null);

describe('ColumnSettings.move()', () => {
  it('moves an item from one index to another', () => {
    const cs = makeColumnSettings('a', 'b', 'c');
    const ids = () => cs.columns.map((c) => c.column.id);

    expect(ids()).toEqual(['a', 'b', 'c']);

    cs.move(0, 2);
    expect(ids()).toEqual(['b', 'c', 'a']);
  });

  it('moves an item backward', () => {
    const cs = makeColumnSettings('a', 'b', 'c');
    cs.move(2, 0);
    expect(cs.columns.map((c) => c.column.id)).toEqual(['c', 'a', 'b']);
  });

  it('is a no-op when from === to', () => {
    const cs = makeColumnSettings('a', 'b', 'c');
    cs.move(1, 1);
    expect(cs.columns.map((c) => c.column.id)).toEqual(['a', 'b', 'c']);
  });

  it('is a no-op when from is negative', () => {
    const cs = makeColumnSettings('a', 'b', 'c');
    cs.move(-1, 0);
    expect(cs.columns.map((c) => c.column.id)).toEqual(['a', 'b', 'c']);
  });

  it('is a no-op when from is out of bounds', () => {
    const cs = makeColumnSettings('a', 'b', 'c');
    cs.move(5, 0);
    expect(cs.columns.map((c) => c.column.id)).toEqual(['a', 'b', 'c']);
  });

  it('is a no-op when to is negative', () => {
    const cs = makeColumnSettings('a', 'b', 'c');
    cs.move(0, -1);
    expect(cs.columns.map((c) => c.column.id)).toEqual(['a', 'b', 'c']);
  });

  it('is a no-op when to is out of bounds', () => {
    const cs = makeColumnSettings('a', 'b', 'c');
    cs.move(0, 5);
    expect(cs.columns.map((c) => c.column.id)).toEqual(['a', 'b', 'c']);
  });

  it('does not insert undefined when from is invalid', () => {
    const cs = makeColumnSettings('a', 'b', 'c');
    cs.move(99, 0);
    expect(cs.columns).toHaveLength(3);
    expect(cs.columns.every((c) => c !== undefined)).toBe(true);
  });

  it('handles a single-element list without crashing', () => {
    const cs = makeColumnSettings('a');
    cs.move(0, 0);
    expect(cs.columns.map((c) => c.column.id)).toEqual(['a']);
  });

  it('handles an empty list without crashing', () => {
    const cs = makeColumnSettings();
    expect(() => cs.move(0, 0)).not.toThrow();
    expect(cs.columns).toHaveLength(0);
  });
});
