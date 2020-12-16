"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHarmful = void 0;
const enums_1 = require("../../enums");
exports.isHarmful = function (EffectType) {
    switch (EffectType) {
        case enums_1.effectType.Damage: return true;
        case enums_1.effectType.EnergyRemoval: return true;
        case enums_1.effectType.EnergySteal: return true;
        case enums_1.effectType.EnergyRemoval: return true;
        case enums_1.effectType.HealthDrain: return true;
        case enums_1.effectType.Stun: return true;
        case enums_1.effectType.IncreaseDamageTaken: return true;
        case enums_1.effectType.CooldownIncreasal: return true;
        case enums_1.effectType.None: return true;
        default: return false;
    }
};
//# sourceMappingURL=z.helpers.js.map