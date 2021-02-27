import { log } from "../../../logger";
import { BuffTypes, DamageType, SkillClassType, effectType } from "../../enums";
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
    toSpecificSkill: {
      [x: string]: boolean;
    };
    toSkillClass: {
      [x: string]: boolean;
    };
  };

  cooldownReduction: {
    ofAllSkills: number;
    ofSkillId: {
      [x: number]: number;
    };
  };

  increaseHealthHealed: { bySkillClass: any; bySkillId: any };
  cannotBeKilled: boolean;
  decreaseDamageTaken: { byDamage: any; bySkillClass: any; bySkillId: any };
  damageIncreasal: { byDamage: any; bySkillClass: any; bySkillId: any };
  absorbDamage: { [x: string]: { [x: string]: number } };
  destructibleDefense: { [x: string]: Effect };
  ignoreHarmfulEffects: {
    status: boolean;
    includeDamage: boolean;
  };

  constructor() {
    this.cannotBeKilled = false;
    this.invulnerability = {
      toFriendly: false,
      toHarmful: false,
      toSkillClass: {
        [SkillClassType.Any]: false,
        [SkillClassType.Affliction]: false,
        [SkillClassType.Physical]: false,
        [SkillClassType.Reiatsu]: false,
        [SkillClassType.Strategic]: false,
      },
      toSpecificSkill: {},
    };
    this.increaseHealthHealed = {
      bySkillClass: {},
      bySkillId: {},
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
    if (this.invulnerability.toSkillClass[SkillClassType.Any]) {
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

  public setAbsorbDamage(params: {
    skillType: SkillClassType;
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
    this.invulnerability.toSpecificSkill = {};
    this.invulnerability.toSkillClass = {};
  }

  public clearHarmfulInvulnerability() {
    this.invulnerability.toHarmful = false;
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
    this.increaseHealthHealed = {
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
