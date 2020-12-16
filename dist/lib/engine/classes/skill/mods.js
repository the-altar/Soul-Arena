"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillMods = void 0;
class SkillMods {
    constructor(data) {
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