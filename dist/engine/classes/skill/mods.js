"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillMods = void 0;
class SkillMods {
    constructor(params) {
        if (params) {
            this.targetMod = params.targetMod;
        }
        else {
            this.targetMod = null;
        }
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