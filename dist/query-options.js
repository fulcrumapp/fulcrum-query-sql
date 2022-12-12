"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryOptions {
    constructor(attrs = {}) {
        this.timeZone = attrs.time_zone || null;
    }
    toJSON() {
        return {
            time_zone: this.timeZone
        };
    }
}
exports.default = QueryOptions;
//# sourceMappingURL=query-options.js.map