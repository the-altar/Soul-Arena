"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EffectStack = void 0;
class EffectStack {
    constructor() {
        this.stack = {};
    }
    add(id) {
        this.stack[id] = (this.stack[id] || 0) + 1;
    }
    clearStack() {
        this.stack = {};
    }
    decrease(id) {
        this.stack[id]--;
    }
    count(id) {
        return this.stack[id] || 0;
    }
}
exports.EffectStack = EffectStack;
//# sourceMappingURL=effetStack.js.map