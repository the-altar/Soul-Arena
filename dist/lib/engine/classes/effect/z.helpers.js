"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFriendly = exports.isHarmful = void 0;
const enums_1 = require("../../enums");
exports.isHarmful = function (EffectType, exceptDamage) {
    switch (EffectType) {
        case enums_1.effectType.Damage: {
            if (exceptDamage)
                return false;
            return true;
        }
        case enums_1.effectType.DamageReduction:
            return true;
        case enums_1.effectType.EnergyRemoval:
            return true;
        case enums_1.effectType.EnergySteal:
            return true;
        case enums_1.effectType.EnergyRemoval:
            return true;
        case enums_1.effectType.HealthDrain:
            return true;
        case enums_1.effectType.Stun:
            return true;
        case enums_1.effectType.IncreaseDamageTaken:
            return true;
        case enums_1.effectType.CooldownIncreasal:
            return true;
        case enums_1.effectType.IgnoreInvulnerability:
            return true;
        case enums_1.effectType.IncreaseTargetSkillDuration:
            return true;
        case enums_1.effectType.None:
            return true;
        default:
            return false;
    }
};
exports.isFriendly = function (EffectType) {
    switch (EffectType) {
        case enums_1.effectType.Healing:
            return true;
        case enums_1.effectType.DestructibleDefense:
            return true;
        case enums_1.effectType.AbsorbDamage:
            return true;
        case enums_1.effectType.CooldownReduction:
            return true;
        case enums_1.effectType.EnergyGain:
            return true;
        case enums_1.effectType.IncreaseCasterSkillDuration:
            return true;
        case enums_1.effectType.Invulnerability:
            return true;
        case enums_1.effectType.DecreaseDamageTaken:
            return true;
        case enums_1.effectType.ResetCooldown:
            return true;
        default:
            return false;
    }
};
//# sourceMappingURL=z.helpers.js.map