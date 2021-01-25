"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillStack = void 0;
class SkillStack {
    constructor() {
        this.skills = {};
    }
    add(id, caster) {
        this.skills[`${id}-${caster}`] = true;
    }
    remove(id, caster) {
        delete this.skills[`${id}-${caster}`];
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