export default class QueryOptions {
  constructor(attrs = {}) {
    this.timeZone = attrs.time_zone || null;
  }

  toJSON() {
    return {
      time_zone: this.timeZone
    };
  }
}
