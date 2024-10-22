import { DamageType, DebuffTypes, SkillClassType } from "../../enums";
import { Skill } from "../../classes/skill";

export interface iDebuffParams {
  damageType?: DamageType;
  skillType?: SkillClassType;
  value?: number;
  debuffType?: DebuffTypes;
  specific?: number;
}

export class Debuffs {
  damageReduction: { byDamage: any; bySkillClass: any; bySkillId: any };
  increaseDamageTaken: { byDamage: any; bySkillClass: any; bySkillId: any };
  cooldownIncreasal: { [x: string]: number };
  ignoreInvulnerability: boolean;
  ignoreDecreaseDamageTaken: boolean;
  increaseSkillDuration: {
    [x: string]: { value: number; except: Array<number> };
  };
  stun: { [x: string]: boolean };
  ignoreBenefitialEffects: boolean;

  constructor() {
    this.increaseDamageTaken = {
      byDamage: {},
      bySkillClass: {},
      bySkillId: {},
    };
    this.damageReduction = {
      byDamage: {},
      bySkillClass: {},
      bySkillId: {},
    };
    this.cooldownIncreasal = { any: 0 };
    this.ignoreInvulnerability = false;
    this.ignoreDecreaseDamageTaken = false;
    this.increaseSkillDuration = {};
    this.stun = {};
    this.ignoreBenefitialEffects = false;
  }

  public setCooldownIncreasal(params: iDebuffParams) {
    const { specific, value } = params;

    if (specific) {
      this.cooldownIncreasal[specific] =
        value + (0 || this.cooldownIncreasal[specific]);
    } else {
      this.cooldownIncreasal.any = value + this.cooldownIncreasal.any;
    }
  }

  public getCooldownIncreasal(params?: any) {
    let r = this.cooldownIncreasal.any;
    if (params === undefined) return r;
    if (params.specific) {
      if (this.cooldownIncreasal[params.specific])
        r += this.cooldownIncreasal[params.specific];
    }
    return r;
  }

  public isStunned(skill: Skill): boolean {
    if (
      this.stun[skill.persistence] ||
      this.stun[SkillClassType.Any] ||
      this.stun[skill.class]
    )
      return true;
    return false;
  }

  public clearDebuffs() {
    this.damageReduction = {
      byDamage: {},
      bySkillClass: {},
      bySkillId: {},
    };
    this.cooldownIncreasal = { any: 0 };
    this.increaseDamageTaken = {
      byDamage: {},
      bySkillClass: {},
      bySkillId: {},
    };
    this.ignoreDecreaseDamageTaken = false;
    this.ignoreInvulnerability = false;
    this.ignoreBenefitialEffects = false;
  }

  public clearStuns() {
    this.stun = {};
  }
}
