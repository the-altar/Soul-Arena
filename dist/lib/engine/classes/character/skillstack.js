"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillStack = void 0;
const logger_1 = require("../../../logger");
class SkillStack {
    constructor() {
        this.skills = {};
    }
    add(id, caster) {
        this.skills[`${id}-${caster}`] = true;
    }
    remove(id, caster) {
        logger_1.log.info(`clear skill stack ${id}-${caster}`, this.skills);
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