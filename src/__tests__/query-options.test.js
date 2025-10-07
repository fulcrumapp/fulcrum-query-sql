import QueryOptions from '../query-options';

describe('QueryOptions', () => {
  describe('constructor', () => {
    it('creates options with default values', () => {
      const options = new QueryOptions();
      
      expect(options.timeZone).toBeNull();
    });

    it('creates options with provided attributes', () => {
      const attrs = {
        time_zone: 'America/New_York',
      };
      
      const options = new QueryOptions(attrs);
      
      expect(options.timeZone).toBe('America/New_York');
    });

    it('handles empty object', () => {
      const options = new QueryOptions({});
      
      expect(options.timeZone).toBeNull();
    });

    it('handles undefined input', () => {
      const options = new QueryOptions(undefined);
      
      expect(options.timeZone).toBeNull();
    });
  });

  describe('timeZone property', () => {
    it('gets and sets timeZone correctly', () => {
      const options = new QueryOptions();
      
      expect(options.timeZone).toBeNull();
      
      options.timeZone = 'Europe/London';
      expect(options.timeZone).toBe('Europe/London');
      
      options.timeZone = 'UTC';
      expect(options.timeZone).toBe('UTC');
    });
  });

  describe('toJSON', () => {
    it('returns correct JSON representation', () => {
      const options = new QueryOptions({
        time_zone: 'Asia/Tokyo',
      });
      
      const json = options.toJSON();
      
      expect(json).toEqual({
        time_zone: 'Asia/Tokyo',
      });
    });

    it('returns JSON with null when no timezone is set', () => {
      const options = new QueryOptions();
      
      const json = options.toJSON();
      
      expect(json).toEqual({
        time_zone: null,
      });
    });

    it('maintains consistency between input and output format', () => {
      const originalAttrs = {
        time_zone: 'America/Los_Angeles',
      };
      
      const options = new QueryOptions(originalAttrs);
      const json = options.toJSON();
      
      expect(json.time_zone).toBe(originalAttrs.time_zone);
    });
  });
});