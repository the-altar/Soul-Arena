"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buffs = void 0;
const enums_1 = require("../../enums");
class Buffs {
    constructor() {
        this.cannotBeKilled = false;
        this.invulnerability = {
            toFriendly: false,
            toHarmful: false,
            toSkillClass: {
                [enums_1.SkillClassType.Any]: false,
                [enums_1.SkillClassType.Affliction]: false,
                [enums_1.SkillClassType.Physical]: false,
                [enums_1.SkillClassType.Reiatsu]: false,
                [enums_1.SkillClassType.Strategic]: false,
            },
            toSpecificSkill: {},
        };
        this.cooldownReduction = { ofAllSkills: 0, ofSkillId: {} };
        this.decreaseDamageTaken = {
            byDamage: {},
            bySkillClass: {},
            bySkillId: {},
        };
        this.damageIncreasal = { byDamage: {}, bySkillClass: {}, bySkillId: {} };
        this.absorbDamage = {};
        this.destructibleDefense = {};
        this.ignoreHarmfulEffects = {
            status: false,
            includeDamage: false,
        };
    }
    isInvulnerable(skill, effect) {
        if (this.invulnerability.toSkillClass[enums_1.SkillClassType.Any]) {
            //log.info("Character is invulnerable to ANY skill class");
            return true;
        }
        if (this.invulnerability.toHarmful && skill.isHarmful()) {
            //log.info("Character is invulnerable to HARMFUL skills");
            return true;
        }
        if (this.invulnerability.toFriendly && !skill.isHarmful()) {
            //log.info("Character is invulnerable to FRIENDLY skills");
            return true;
        }
        if (this.invulnerability.toSkillClass[skill.class]) {
            /*log.info(
              `Character is invulnerable to ${SkillClassType[skill.class]} skills`
            );*/
            return true;
        }
        if (this.invulnerability.toSpecificSkill[skill.getId()]) {
            //log.info(`Character is invulnerable to an specific skill`);
            return true;
        }
    }
    setAbsorbDamage(params) {
        const { skillType, damageType, value } = params;
        if (this.absorbDamage[skillType] === undefined) {
            this.absorbDamage[skillType] = {
                [damageType]: value,
            };
        }
        else {
            this.absorbDamage[skillType][damageType] += value;
        }
    }
    getAbsorbDamage(params) {
        const { skillType, damageType } = params;
        const res = {
            conversionRate: 0,
            hasBeenAbsorbed: false,
        };
        if (this.absorbDamage[enums_1.SkillClassType.Any] !== undefined) {
            const t = this.absorbDamage[enums_1.SkillClassType.Any][enums_1.DamageType.True] || 0;
            res.conversionRate +=
                (this.absorbDamage[enums_1.SkillClassType.Any][damageType] || 0) + t;
            res.hasBeenAbsorbed = true;
        }
        if (skillType !== enums_1.SkillClassType.Any) {
            if (this.absorbDamage[skillType] !== undefined) {
                const t = this.absorbDamage[skillType][enums_1.DamageType.True] || 0;
                if (this.absorbDamage[skillType][damageType] !== undefined) {
                    res.conversionRate += this.absorbDamage[skillType][damageType] || 0;
                    res.hasBeenAbsorbed = true;
                }
                if (t > 0)
                    res.hasBeenAbsorbed = true;
                res.conversionRate += t;
            }
        }
        return res;
    }
    validateDD() {
        for (const k in this.destructibleDefense) {
            if (this.destructibleDefense[k].value <= 0) {
                delete this.destructibleDefense[k];
            }
        }
    }
    clearCooldownReduction() {
        this.cooldownReduction.ofAllSkills = 0;
        this.cooldownReduction.ofSkillId = {};
    }
    clearInvulnerability() {
        this.invulnerability.toFriendly = false;
        this.invulnerability.toHarmful = false;
        this.invulnerability.toSpecificSkill = {};
        this.invulnerability.toSkillClass = {};
    }
    clearHarmfulInvulnerability() {
        this.invulnerability.toHarmful = false;
    }
    clearDamageIncreasal() {
        this.damageIncreasal = { byDamage: {}, bySkillClass: {}, bySkillId: {} };
    }
    clearDecreaseDamageTaken() {
        this.decreaseDamageTaken = {
            byDamage: {},
            bySkillClass: {},
            bySkillId: {},
        };
    }
    clearAbsorbDamage() {
        this.absorbDamage = {};
    }
    getDestructibleDefense() {
        return this.destructibleDefense;
    }
    clearIgnoreHarmfulEffects() {
        this.ignoreHarmfulEffects = {
            status: false,
            includeDamage: false,
        };
    }
}
exports.Buffs = Buffs;
//# sourceMappingURL=buffs.js.map