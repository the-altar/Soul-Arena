"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterStack = void 0;
class CounterStack {
    constructor() {
        this.counter = {};
    }
    add(id) {
        this.counter[id] = (this.counter[id] || 0) + 1;
    }
    clearStack() {
        this.counter = {};
    }
    decrease(id) {
        if (!this.counter[id])
            return;
        this.counter[id] = Math.max(this.counter[id] - 1, 0);
    }
    count(id) {
        return this.counter[id] || 0;
    }
}
exports.CounterStack = CounterStack;
//# sourceMappingURL=counters.js.map