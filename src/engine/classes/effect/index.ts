import { effectType } from "../../enums";
import { Effect } from "./base";
import { IgnoreInvulnerability, Invulnerability } from "./invulnerability";
import {
  Damage,
  DamageReduction,
  IncreaseDamageTaken,
  DecreaseDamageTaken,
  DamageIncreasal,
  AbsorbDamage,
  IgnoreDecreaseDamageTaken,
} from "./damageRelated";
import { Healing, HealthDrain } from "./healthRelated";
import {
  CooldownReduction,
  CooldownIncreasal,
  ResetCooldown,
} from "./cooldownRelated";
import { EnergyGain, EnergyRemoval } from "./energyRelated";
import { Stun } from "./stunRelated";
import { SkillCostChange, SkillTargetMod } from "./skillTargetMod";
import { Counter } from "./counter";
import { EffectRemoval } from "./effectRemoval";
import {
  AlterEffectValue,
  DisableEffects,
  EnableEffects,
} from "./alterEffectValue";
import { DestructibleDefense } from "./destructibleDefense";

export * from "./base";

export const effectFactory = function (effect: any, caster: number): Effect {
  switch (effect.type) {
    case effectType.Damage: {
      return new Damage(effect, caster);
    }
    case effectType.Invulnerability: {
      return new Invulnerability(effect, caster);
    }
    case effectType.DamageReduction: {
      return new DamageReduction(effect, caster);
    }
    case effectType.CooldownReduction: {
      return new CooldownReduction(effect, caster);
    }
    case effectType.CooldownIncreasal: {
      return new CooldownIncreasal(effect, caster);
    }
    case effectType.Healing: {
      return new Healing(effect, caster);
    }
    case effectType.HealthDrain: {
      return new HealthDrain(effect, caster);
    }
    case effectType.EnergyGain: {
      return new EnergyGain(effect, caster);
    }
    case effectType.Stun: {
      return new Stun(effect, caster);
    }
    case effectType.SkillTargetMod: {
      return new SkillTargetMod(effect, caster);
    }
    case effectType.Counter: {
      return new Counter(effect, caster);
    }
    case effectType.IncreaseDamageTaken: {
      return new IncreaseDamageTaken(effect, caster);
    }
    case effectType.DecreaseDamageTaken: {
      return new DecreaseDamageTaken(effect, caster);
    }
    case effectType.EffectRemoval: {
      return new EffectRemoval(effect, caster);
    }
    case effectType.DamageIncreasal: {
      return new DamageIncreasal(effect, caster);
    }
    case effectType.AbsorbDamage: {
      return new AbsorbDamage(effect, caster);
    }
    case effectType.AlterEffectValue: {
      return new AlterEffectValue(effect, caster);
    }
    case effectType.EnergyRemoval: {
      return new EnergyRemoval(effect, caster);
    }
    case effectType.ResetCooldown: {
      return new ResetCooldown(effect, caster);
    }
    case effectType.DestructibleDefense: {
      return new DestructibleDefense(effect, caster);
    }
    case effectType.EnableEffects: {
      return new EnableEffects(effect, caster);
    }
    case effectType.SkillCostChange: {
      return new SkillCostChange(effect, caster);
    }
    case effectType.IgnoreDecreaseDamageTaken: {
      return new IgnoreDecreaseDamageTaken(effect, caster);
    }
    case effectType.IgnoreInvulnerability: {
      return new IgnoreInvulnerability(effect, caster);
    }
    case effectType.DisableEffects: {
      return new DisableEffects(effect, caster);
    }
    default: {
      return new Effect(effect, caster);
    }
  }
};
