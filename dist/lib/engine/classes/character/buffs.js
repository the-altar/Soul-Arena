"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buffs = void 0;
const enums_1 = require("../../enums");
class Buffs {
    constructor() {
        this.invulnerability = {
            toFriendly: false,
            toHarmful: false,
            toSkillClass: new Set(),
            toSpecificSkill: new Set(),
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
        if (this.invulnerability.toSkillClass.has(enums_1.SkillClassType.Any))
            return true;
        if (this.invulnerability.toHarmful && skill.isHarmful)
            return true;
        if (this.invulnerability.toFriendly && !skill.isHarmful)
            return true;
        if (this.invulnerability.toSkillClass.has(skill.class))
            return true;
        if (this.invulnerability.toSpecificSkill.has(skill.getId()))
            return true;
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
        this.invulnerability.toSpecificSkill.clear();
        this.invulnerability.toSkillClass.clear();
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