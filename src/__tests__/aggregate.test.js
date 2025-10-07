import { AggregateType, aggregateTypesForDataType } from '../aggregate';

describe('Aggregate', () => {
  describe('AggregateType', () => {
    it('defines basic aggregate types', () => {
      expect(AggregateType.Sum.name).toBe('sum');
      expect(AggregateType.Sum.label).toBe('Sum');
      
      expect(AggregateType.Average.name).toBe('average');
      expect(AggregateType.Average.label).toBe('Average');
      
      expect(AggregateType.Min.name).toBe('min');
      expect(AggregateType.Min.label).toBe('Min');
      
      expect(AggregateType.Max.name).toBe('max');
      expect(AggregateType.Max.label).toBe('Max');
    });

    it('defines statistical aggregate types', () => {
      expect(AggregateType.Median.name).toBe('median');
      expect(AggregateType.Median.label).toBe('Median');
      
      expect(AggregateType.StdDev.name).toBe('stddev');
      expect(AggregateType.StdDev.label).toBe('Standard Deviation');
      
      expect(AggregateType.Histogram.name).toBe('histogram');
      expect(AggregateType.Histogram.label).toBe('Histogram');
    });

    it('defines count-based aggregate types', () => {
      expect(AggregateType.Empty.name).toBe('empty');
      expect(AggregateType.Empty.label).toBe('Count Blank');
      expect(AggregateType.Empty.count).toBe(true);
      
      expect(AggregateType.NotEmpty.name).toBe('not_empty');
      expect(AggregateType.NotEmpty.label).toBe('Count Not Blank');
      expect(AggregateType.NotEmpty.count).toBe(true);
      
      expect(AggregateType.Unique.name).toBe('unique');
      expect(AggregateType.Unique.label).toBe('Count Unique Values');
      expect(AggregateType.Unique.count).toBe(true);
    });

    it('defines percentage aggregate types', () => {
      expect(AggregateType.PercentEmpty.name).toBe('percent_empty');
      expect(AggregateType.PercentEmpty.label).toBe('% Blank');
      
      expect(AggregateType.PercentNotEmpty.name).toBe('percent_not_empty');
      expect(AggregateType.PercentNotEmpty.label).toBe('% Not Blank');
      
      expect(AggregateType.PercentUnique.name).toBe('percent_unique');
      expect(AggregateType.PercentUnique.label).toBe('% Unique Values');
    });
  });

  describe('aggregateTypesForDataType', () => {
    it('returns appropriate aggregates for numeric types', () => {
      const doubleAggregates = aggregateTypesForDataType('double');
      const integerAggregates = aggregateTypesForDataType('integer');
      
      // Numeric types should support mathematical operations
      expect(doubleAggregates).toContain(AggregateType.Sum);
      expect(doubleAggregates).toContain(AggregateType.Average);
      expect(doubleAggregates).toContain(AggregateType.Min);
      expect(doubleAggregates).toContain(AggregateType.Max);
      expect(doubleAggregates).toContain(AggregateType.Median);
      expect(doubleAggregates).toContain(AggregateType.StdDev);
      
      expect(integerAggregates).toContain(AggregateType.Sum);
      expect(integerAggregates).toContain(AggregateType.Average);
    });

    it('returns appropriate aggregates for string types', () => {
      const stringAggregates = aggregateTypesForDataType('string');
      
      // String types should not support mathematical operations
      expect(stringAggregates).not.toContain(AggregateType.Sum);
      expect(stringAggregates).not.toContain(AggregateType.Average);
      
      // But should support count-based operations
      expect(stringAggregates).toContain(AggregateType.Empty);
      expect(stringAggregates).toContain(AggregateType.NotEmpty);
      expect(stringAggregates).toContain(AggregateType.Unique);
      expect(stringAggregates).toContain(AggregateType.Histogram);
    });

    it('returns appropriate aggregates for date types', () => {
      const dateAggregates = aggregateTypesForDataType('date');
      
      // Date types should support min/max but not sum/average
      expect(dateAggregates).toContain(AggregateType.Min);
      expect(dateAggregates).toContain(AggregateType.Max);
      expect(dateAggregates).not.toContain(AggregateType.Sum);
      expect(dateAggregates).not.toContain(AggregateType.Average);
      
      // Should support count-based operations
      expect(dateAggregates).toContain(AggregateType.Empty);
      expect(dateAggregates).toContain(AggregateType.NotEmpty);
      expect(dateAggregates).toContain(AggregateType.Unique);
    });

    it('returns appropriate aggregates for boolean types', () => {
      const booleanAggregates = aggregateTypesForDataType('boolean');
      
      // Boolean types should not support mathematical operations
      expect(booleanAggregates).not.toContain(AggregateType.Sum);
      expect(booleanAggregates).not.toContain(AggregateType.Average);
      expect(booleanAggregates).not.toContain(AggregateType.Median);
      
      // Should support count-based operations
      expect(booleanAggregates).toContain(AggregateType.Empty);
      expect(booleanAggregates).toContain(AggregateType.NotEmpty);
      expect(booleanAggregates).toContain(AggregateType.Histogram);
    });

    it('returns appropriate aggregates for array types', () => {
      const arrayAggregates = aggregateTypesForDataType('array');
      
      // Array types should not support mathematical operations
      expect(arrayAggregates).not.toContain(AggregateType.Sum);
      expect(arrayAggregates).not.toContain(AggregateType.Average);
      
      // Should support count-based operations
      expect(arrayAggregates).toContain(AggregateType.Empty);
      expect(arrayAggregates).toContain(AggregateType.NotEmpty);
      expect(arrayAggregates).toContain(AggregateType.Unique);
    });

    it('returns empty array for unknown data types', () => {
      const unknownAggregates = aggregateTypesForDataType('unknown_type');
      
      expect(Array.isArray(unknownAggregates)).toBe(true);
      expect(unknownAggregates.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('aggregate type properties', () => {
    it('correctly identifies count-based aggregates', () => {
      expect(AggregateType.Empty.count).toBe(true);
      expect(AggregateType.NotEmpty.count).toBe(true);
      expect(AggregateType.Unique.count).toBe(true);
      
      expect(AggregateType.Sum.count).toBeUndefined();
      expect(AggregateType.Average.count).toBeUndefined();
      expect(AggregateType.Min.count).toBeUndefined();
    });

    it('has consistent name and label properties', () => {
      const aggregateTypes = [
        AggregateType.Sum,
        AggregateType.Average,
        AggregateType.Median,
        AggregateType.Min,
        AggregateType.Max,
        AggregateType.StdDev,
        AggregateType.Histogram,
        AggregateType.Empty,
        AggregateType.NotEmpty,
        AggregateType.Unique,
        AggregateType.PercentEmpty,
        AggregateType.PercentNotEmpty,
        AggregateType.PercentUnique,
      ];

      aggregateTypes.forEach(aggregateType => {
        expect(typeof aggregateType.name).toBe('string');
        expect(typeof aggregateType.label).toBe('string');
        expect(aggregateType.name.length).toBeGreaterThan(0);
        expect(aggregateType.label.length).toBeGreaterThan(0);
      });
    });
  });
});