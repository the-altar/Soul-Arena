"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillMods = void 0;
const logger_1 = require("../../../logger");
const enums_1 = require("../../enums");
class SkillMods {
    constructor(data) {
        this.targetMod = data.targetMod || null;
        this.increaseDuration = data.increaseDuration || 0;
        this.costReplacement = data.costReplacement || null;
        this.costChange = data.costChange || {
            [enums_1.ReiatsuTypes.Hakuda]: 0,
            [enums_1.ReiatsuTypes.Kidou]: 0,
            [enums_1.ReiatsuTypes.Random]: 0,
            [enums_1.ReiatsuTypes.Reiryoku]: 0,
            [enums_1.ReiatsuTypes.Zanpakutou]: 0,
        };
        this.meta = {
            cost: null,
            class: null,
            targetMode: null,
            persistence: null,
            baseCooldown: null,
            requiresSkillOnTarget: [],
            cannotBeUsedOnTargetOf: [],
        };
    }
    setTargetMod(target) {
        this.targetMod = target;
    }
    getTargetMod() {
        return this.targetMod;
    }
    setByAttribute(data, charId) {
        this.meta = JSON.parse(JSON.stringify(data));
        this.meta.requiresSkillOnTarget = this.meta.requiresSkillOnTarget.map((e) => {
            return `${e}-${charId}`;
        });
        this.meta.cannotBeUsedOnTargetOf = this.meta.cannotBeUsedOnTargetOf.map((e) => {
            return `${e}-${charId}`;
        });
    }
    getAttrValue(attr) {
        try {
            return this.meta[attr];
        }
        catch (e) {
            logger_1.log.error(e);
            return null;
        }
    }
    clearMods() {
        this.targetMod = null;
        this.increaseDuration = 0;
        this.costReplacement = null;
        this.costChange = {
            [enums_1.ReiatsuTypes.Hakuda]: 0,
            [enums_1.ReiatsuTypes.Kidou]: 0,
            [enums_1.ReiatsuTypes.Random]: 0,
            [enums_1.ReiatsuTypes.Reiryoku]: 0,
            [enums_1.ReiatsuTypes.Zanpakutou]: 0,
        };
        this.meta = {
            cost: null,
            class: null,
            targetMode: null,
            persistence: null,
            baseCooldown: null,
            requiresSkillOnTarget: [],
            cannotBeUsedOnTargetOf: [],
        };
    }
}
exports.SkillMods = SkillMods;
//# sourceMappingURL=mods.js.map