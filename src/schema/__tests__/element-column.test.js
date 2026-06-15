import { Record, StatusValue } from '@fulcrumapp/fulcrum-core';
import ElementColumn from '../element-column.js';

describe('ElementColumn status handling', () => {
  const statusElement = {
    key: 'status_key',
    label: 'Status',
    dataName: 'status',
    isStatusElement: true,
  };

  it('returns the statusValue for Record instances', () => {
    const feature = Object.create(Record.prototype);
    Object.defineProperty(feature, 'statusValue', {
      value: 'record-status-value',
      configurable: true,
    });

    const column = new ElementColumn({ element: statusElement });

    expect(column.valueFrom(feature)).toBe('record-status-value');
  });

  it('creates a StatusValue for non-Record features', () => {
    const feature = { recordStatus: 'open' };
    const column = new ElementColumn({ element: statusElement });

    const value = column.valueFrom(feature);

    expect(value).toBeInstanceOf(StatusValue);
  });
});
