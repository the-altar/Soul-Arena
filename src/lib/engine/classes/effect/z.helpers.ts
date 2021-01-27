import { triggerAsyncId } from "async_hooks";
import { effectType } from "../../enums";

export const isHarmful = function (
  EffectType: effectType,
  exceptDamage?: boolean
): boolean {
  switch (EffectType) {
    case effectType.Damage: {
      if (exceptDamage) return false;
      return true;
    }
    case effectType.DamageReduction:
      return true;
    case effectType.EnergyRemoval:
      return true;
    case effectType.EnergySteal:
      return true;
    case effectType.EnergyRemoval:
      return true;
    case effectType.HealthDrain:
      return true;
    case effectType.Stun:
      return true;
    case effectType.IncreaseDamageTaken:
      return true;
    case effectType.CooldownIncreasal:
      return true;
    case effectType.IgnoreInvulnerability:
      return true;
    case effectType.IncreaseTargetSkillDuration:
      return true;
    case effectType.None:
      return true;
    default:
      return false;
  }
};

export const isFriendly = function (EffectType: effectType): boolean {
  switch (EffectType) {
    case effectType.Healing:
      return true;
    case effectType.DestructibleDefense:
      return true;
    case effectType.AbsorbDamage:
      return true;
    case effectType.CooldownReduction:
      return true;
    case effectType.EnergyGain:
      return true;
    case effectType.IncreaseCasterSkillDuration:
      return true;
    case effectType.Invulnerability:
      return true;
    case effectType.DecreaseDamageTaken:
      return true;
    case effectType.ResetCooldown:
      return true;
    default:
      return false;
  }
};
