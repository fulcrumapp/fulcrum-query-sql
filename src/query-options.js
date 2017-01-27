export default class QueryOptions {
  constructor(attrs = {}) {
    this._timeZone = attrs.time_zone || null;
  }

  toJSON() {
    return {
      time_zone: this.timeZone
    };
  }

  get timeZone() {
    return this._timeZone;
  }

  set timeZone(timeZone) {
    this._timeZone = timeZone;
  }
}
