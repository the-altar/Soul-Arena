"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillMods = void 0;
const logger_1 = require("../../../logger");
class SkillMods {
    constructor(data) {
        logger_1.log.info(data);
        this.targetMod = data.targetMod || null;
        this.increaseDuration = data.increaseDuration || 0;
    }
    setTargetMod(target) {
        this.targetMod = target;
    }
    getTargetMod() {
        return this.targetMod;
    }
    clearTargetMod() {
        this.targetMod = null;
    }
}
exports.SkillMods = SkillMods;
//# sourceMappingURL=mods.js.map