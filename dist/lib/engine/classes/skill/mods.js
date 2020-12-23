"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillMods = void 0;
const enums_1 = require("../../enums");
class SkillMods {
    constructor(data) {
        this.targetMod = data.targetMod || null;
        this.increaseDuration = data.increaseDuration || 0;
        this.costChange = data.costChange || {
            [enums_1.ReiatsuTypes.Hakuda]: 0,
            [enums_1.ReiatsuTypes.Kidou]: 0,
            [enums_1.ReiatsuTypes.Random]: 0,
            [enums_1.ReiatsuTypes.Reiryoku]: 0,
            [enums_1.ReiatsuTypes.Zanpakutou]: 0,
        };
    }
    setTargetMod(target) {
        this.targetMod = target;
    }
    getTargetMod() {
        return this.targetMod;
    }
    clearMods() {
        this.targetMod = null;
        this.costChange = {
            [enums_1.ReiatsuTypes.Hakuda]: 0,
            [enums_1.ReiatsuTypes.Kidou]: 0,
            [enums_1.ReiatsuTypes.Random]: 0,
            [enums_1.ReiatsuTypes.Reiryoku]: 0,
            [enums_1.ReiatsuTypes.Zanpakutou]: 0,
        };
    }
}
exports.SkillMods = SkillMods;
//# sourceMappingURL=mods.js.map