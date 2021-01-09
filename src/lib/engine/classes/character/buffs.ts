import {
  Types,
  BuffTypes,
  DamageType,
  SkillClassType,
  effectType,
} from "../../enums";
import { Effect } from "../effect";
import { Skill } from "../skill";

export interface iBuffParams {
  value?: number;
  buffType: BuffTypes;
  skillType?: SkillClassType;
  specific?: number;
}

export class Buffs {
  invulnerability: {
    toFriendly: boolean;
    toHarmful: boolean;
    toSpecificSkill: Set<number>;
    toSkillClass: Set<number>;
  };

  cooldownReduction: {
    ofAllSkills: number;
    ofSkillId: {
      [x: number]: number;
    };
  };

  decreaseDamageTaken: { byDamage: any; bySkillClass: any; bySkillId: any };
  damageIncreasal: { byDamage: any; bySkillClass: any; bySkillId: any };
  absorbDamage: { [x: string]: { [x: string]: number } };
  destructibleDefense: { [x: string]: Effect };
  ignoreHarmfulEffects: {
    status: boolean;
    includeDamage: boolean;
  };

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

  public isInvulnerable(skill: Skill, effect?: Effect): boolean {
    if (this.invulnerability.toSkillClass.has(SkillClassType.Any)) return true;
    if (this.invulnerability.toHarmful && skill.isHarmful) return true;
    if (this.invulnerability.toFriendly && !skill.isHarmful) return true;
    if (this.invulnerability.toSkillClass.has(skill.class)) return true;
    if (this.invulnerability.toSpecificSkill.has(skill.getId())) return true;
  }

  public setAbsorbDamage(params: {
    skillType: Types;
    value: number;
    damageType: DamageType;
  }) {
    const { skillType, damageType, value } = params;
    if (this.absorbDamage[skillType] === undefined) {
      this.absorbDamage[skillType] = {
        [damageType]: value,
      };
    } else {
      this.absorbDamage[skillType][damageType] += value;
    }
  }

  public getAbsorbDamage(params: {
    skillType: SkillClassType;
    damageType: DamageType;
  }) {
    const { skillType, damageType } = params;
    const res = {
      conversionRate: 0,
      hasBeenAbsorbed: false,
    };

    if (this.absorbDamage[SkillClassType.Any] !== undefined) {
      const t = this.absorbDamage[SkillClassType.Any][DamageType.True] || 0;
      res.conversionRate +=
        (this.absorbDamage[SkillClassType.Any][damageType] || 0) + t;
      res.hasBeenAbsorbed = true;
    }

    if (skillType !== SkillClassType.Any) {
      if (this.absorbDamage[skillType] !== undefined) {
        const t = this.absorbDamage[skillType][DamageType.True] || 0;
        if (this.absorbDamage[skillType][damageType] !== undefined) {
          res.conversionRate += this.absorbDamage[skillType][damageType] || 0;
          res.hasBeenAbsorbed = true;
        }
        if (t > 0) res.hasBeenAbsorbed = true;
        res.conversionRate += t;
      }
    }

    return res;
  }

  public validateDD() {
    for (const k in this.destructibleDefense) {
      if (this.destructibleDefense[k].value <= 0) {
        delete this.destructibleDefense[k];
      }
    }
  }

  public clearCooldownReduction() {
    this.cooldownReduction.ofAllSkills = 0;
    this.cooldownReduction.ofSkillId = {};
  }

  public clearInvulnerability() {
    this.invulnerability.toFriendly = false;
    this.invulnerability.toHarmful = false;
    this.invulnerability.toSpecificSkill.clear();
    this.invulnerability.toSkillClass.clear();
  }

  public clearDamageIncreasal() {
    this.damageIncreasal = { byDamage: {}, bySkillClass: {}, bySkillId: {} };
  }

  public clearDecreaseDamageTaken() {
    this.decreaseDamageTaken = {
      byDamage: {},
      bySkillClass: {},
      bySkillId: {},
    };
  }

  public clearAbsorbDamage() {
    this.absorbDamage = {};
  }
  public getDestructibleDefense() {
    return this.destructibleDefense;
  }
  public clearIgnoreHarmfulEffects() {
    this.ignoreHarmfulEffects = {
      status: false,
      includeDamage: false,
    };
  }
}
