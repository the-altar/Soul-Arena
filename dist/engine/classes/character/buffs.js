"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buffs = void 0;
const enums_1 = require("../../enums");
class Buffs {
    constructor() {
        this.invulnerability = { toFriendly: false, toHarmful: false, toSkillClass: new Set(), toSpecificSkill: new Set() };
        this.cooldownReduction = { ofAllSkills: 0, ofSkillId: {} };
        this.decreaseDamageTaken = {};
        this.damageIncreasal = { byDamage: {}, bySkillClass: {}, bySkillId: {} };
        this.absorbDamage = {};
        this.destructibleDefense = 0;
    }
    isInvulnerable(skill, effect) {
        if (this.invulnerability.toHarmful && skill.isHarmful)
            return true;
        if (this.invulnerability.toFriendly && !skill.isHarmful)
            return true;
        if (this.invulnerability.toSkillClass.has(skill.class))
            return true;
        if (this.invulnerability.toSpecificSkill.has(skill.getId()))
            return true;
    }
    setDecreaseDamageTaken(params) {
        const { damageType, value, skillType } = params;
        if (this.decreaseDamageTaken[skillType] === undefined) {
            this.decreaseDamageTaken[skillType] = {
                [damageType]: value
            };
        }
        else {
            this.decreaseDamageTaken[skillType][damageType] += value;
        }
    }
    getDecreaseDamageTaken(params) {
        const { skillType, damageType } = params;
        const res = {
            decreased: 0,
            hasBeenDecreased: false
        };
        if (this.decreaseDamageTaken[enums_1.SkillClassType.Any] !== undefined) {
            res.decreased += this.decreaseDamageTaken[enums_1.SkillClassType.Any][damageType] || 0;
            res.decreased += this.decreaseDamageTaken[enums_1.SkillClassType.Any][enums_1.DamageType.True] || 0;
            res.hasBeenDecreased = true;
        }
        if (skillType !== enums_1.SkillClassType.Any) {
            if (this.decreaseDamageTaken[skillType] !== undefined) {
                res.decreased += this.decreaseDamageTaken[skillType][enums_1.DamageType.True] || 0;
                if (this.decreaseDamageTaken[skillType][damageType] !== undefined) {
                    res.decreased += this.decreaseDamageTaken[skillType][damageType] || 0;
                    res.hasBeenDecreased = true;
                }
            }
        }
        return res;
    }
    setAbsorbDamage(params) {
        const { skillType, damageType, value } = params;
        if (this.absorbDamage[skillType] === undefined) {
            this.absorbDamage[skillType] = {
                [damageType]: value
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
            hasBeenAbsorbed: false
        };
        if (this.absorbDamage[enums_1.SkillClassType.Any] !== undefined) {
            const t = this.absorbDamage[enums_1.SkillClassType.Any][enums_1.DamageType.True] || 0;
            res.conversionRate += (this.absorbDamage[enums_1.SkillClassType.Any][damageType] || 0) + t;
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
        this.decreaseDamageTaken = {};
    }
    clearAbsorbDamage() {
        this.absorbDamage = {};
    }
    clearDestructibleDefense() { }
    setDestructibleDefense(dd) {
        this.destructibleDefense += dd;
    }
    getDestructibleDefense() {
        return this.destructibleDefense;
    }
}
exports.Buffs = Buffs;
//# sourceMappingURL=buffs.js.map