"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillStack = void 0;
class SkillStack {
    constructor() {
        this.skills = {};
    }
    add(id) {
        this.skills[id] = true;
    }
    remove(id) {
        delete this.skills[id];
    }
    clearStack() {
        this.skills = {};
    }
    isTargetOf(ids) {
        for (const id of ids) {
            if (this.skills[id])
                return true;
        }
        return false;
    }
}
exports.SkillStack = SkillStack;
//# sourceMappingURL=skillstack.js.map