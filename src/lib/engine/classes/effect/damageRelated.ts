import { Effect } from "./base";
import {
  DamageType,
  BuffTypes,
  SkillClassType,
  triggerClauseType,
} from "../../enums";
import { Character } from "../character";
import { Skill } from "..";
import { log } from "../../../logger";
/**Deals damage */
export class Damage extends Effect {
  private damageType: DamageType;
  constructor(data: any, caster: number) {
    super(data, caster);
    this.damageType = data.damageType;
  }

  public functionality(char: Character, origin: Skill) {
    if (
      char.getBuffs().ignoreHarmfulEffects.status &&
      char.getBuffs().ignoreHarmfulEffects.includeDamage
    )
      return;
    switch (this.triggerClause) {
      case triggerClauseType.None:
        {
          this.apply(char, origin);
        }
        break;
      case triggerClauseType.IfAlliesUseASkill:
        {
          const allies = char.getAllies();
          for (const cord of this.arenaReference.tempQueue) {
            if (allies.includes(cord.caster)) {
              this.apply(char, origin);
            }
          }
        }
        break;
      default:
        this.apply(char, origin);
    }
  }

  protected getIncreasedDamageFromCaster(
    caster: number,
    effect: Damage,
    skill: Skill
  ): number {
    const effectCaster = this.arenaReference.findCharacterById(caster).char;

    const buff = effectCaster.getBuffs().damageIncreasal;
    const c = buff.byDamage[effect.damageType] || 0;
    const d = buff.bySkillId[skill.getId()] || 0;
    const e = buff.bySkillClass[skill.class] || 0;
    return c + d + e;
  }

  protected getDamageReductionFromCaster(
    caster: number,
    effect: Damage,
    skill: Skill
  ): number {
    const effectCaster = this.arenaReference.findCharacterById(caster).char;
    //log.info(`Damage reduction applied on ${effectCaster.name}`);
    //log.info("xxxxxx", effectCaster.getBuffs().ignoreHarmfulEffects);
    if (effectCaster.getBuffs().ignoreHarmfulEffects.status) return 0;
    const buff = effectCaster.getDebuffs().damageReduction;
    const c = buff.byDamage[effect.damageType] || 0;
    const d = buff.bySkillId[skill.getId()] || 0;
    const e = buff.bySkillClass[skill.class] || 0;
    return c + d + e;
  }

  protected getIncreasedDamageTaken(
    char: Character,
    effect: Damage,
    skill: Skill
  ): number {
    const c =
      char.getDebuffs().increaseDamageTaken.byDamage[effect.damageType] || 0;
    const d =
      char.getDebuffs().increaseDamageTaken.bySkillId[skill.getId()] || 0;
    const e =
      char.getDebuffs().increaseDamageTaken.bySkillClass[skill.class] || 0;
    return c + d + e;
  }

  protected getDecreaseDamageTaken(
    char: Character,
    effect: Damage,
    skill: Skill
  ) {
    const c =
      char.getBuffs().decreaseDamageTaken.byDamage[effect.damageType] || 0;
    const d = char.getBuffs().decreaseDamageTaken.bySkillId[skill.getId()] || 0;
    const e =
      char.getBuffs().decreaseDamageTaken.bySkillClass[skill.class] || 0;
    const f =
      char.getBuffs().decreaseDamageTaken.bySkillClass[SkillClassType.Any] || 0;
    return c + d + e + f;
  }

  protected destroyDestructibleDefense(char: Character, damage: number) {
    if (char.getDebuffs().ignoreBenefitialEffects) return damage;

    const dd_effect_list = char.getBuffs().destructibleDefense;
    if (damage <= 0) return;

    for (const key in dd_effect_list) {
      const dd_effect = dd_effect_list[key];
      const stack = dd_effect.value;
      dd_effect.value = Math.max(0, dd_effect.value - damage);
      damage = Math.max(0, damage - stack);
      if (damage === 0) return 0;
    }
    return damage;
  }

  public generateToolTip() {
    const damageVal = Number(this.altValue) || this.value;
    switch (this.triggerClause) {
      case triggerClauseType.None: {
        this.message = `This character will take ${damageVal} damage`;
        break;
      }
      case triggerClauseType.IfAlliesUseASkill: {
        this.message = `This character will take ${damageVal} damage if their allies use a new skill`;
      }
    }
  }

  apply(char: Character, origin: Skill) {
    const reduction = this.getDamageReductionFromCaster(
      this.caster,
      this,
      origin
    );
    const increasalTaken = this.getIncreasedDamageTaken(char, this, origin);
    const increasalDealt = this.getIncreasedDamageFromCaster(
      this.caster,
      this,
      origin
    );
    let decreased = this.getDecreaseDamageTaken(char, this, origin);

    if (char.getDebuffs().ignoreDecreaseDamageTaken) decreased = 0;

    const { conversionRate } = char.getBuffs().getAbsorbDamage({
      skillType: origin.class,
      damageType: this.damageType,
    });

    let damage = Number(this.altValue) || this.value;
    damage = damage - (reduction + decreased - increasalTaken - increasalDealt);

    damage = this.destroyDestructibleDefense(char, damage);

    const absorbed = damage * (conversionRate / 100);
    const hp = char.geHitPoints() - damage + Math.round(absorbed / 5) * 5;
    char.setHitPoints(hp);
  }
}
/* [Debuff] Decrease the amount of damage dealt by a character*/
export class DamageReduction extends Effect {
  private skillType: SkillClassType;
  private damageType: DamageType;
  private specificSkill: any;
  private specificSkillName: string;

  constructor(data: any, caster: number) {
    super(data, caster);
    this.skillType = data.skillType || false;
    this.damageType = data.damageType || false;
    this.specificSkill = data.specificSkill || false;
  }

  public functionality(char: Character, origin: Skill) {
    let blocked = false;
    blocked = char.getBuffs().ignoreHarmfulEffects.status;
    const buff = char.getDebuffs().damageReduction;

    if (blocked) {
      if (this.specificSkill) {
        this.specificSkillName = this.arenaReference
          .findCharacterById(this.caster)
          .char.findSkillById(this.specificSkill).name;
      }
      return;
    }

    if (this.skillType) {
      buff.bySkillClass[this.skillType] =
        (buff.bySkillClass[this.skillType] || 0) + this.value;
    } else if (this.specificSkill) {
      buff.bySkillId[this.specificSkill] =
        (buff.bySkillId[this.specificSkill] || 0) + this.value;
      this.specificSkillName = this.arenaReference
        .findCharacterById(this.caster)
        .char.findSkillById(this.specificSkill).name;
    } else if (this.damageType) {
      buff.byDamage[this.damageType] =
        (buff.byDamage[this.damageType] || 0) + this.value;
    }
  }

  public generateToolTip() {
    if (this.skillType) {
      this.message = `This character will deal ${this.value} less damage with ${
        SkillClassType[this.skillType]
      } skills`;
    } else if (this.specificSkill) {
      this.message = `'${this.specificSkillName}' will deal ${this.value} less damage`;
    } else if (this.damageType) {
      this.message = `This character will deal ${this.value} less ${
        DamageType[this.damageType]
      } damage`;
    }
  }
}
/*[Buff] Increase the amount of damage dealt by a character */
export class DamageIncreasal extends Effect {
  private skillType: SkillClassType;
  private damageType: DamageType;
  private specificSkill: any;
  private specificSkillName: string;
  constructor(data: any, caster: number) {
    super(data, caster);
    this.skillType = data.skillType || false;
    this.damageType = data.damageType || false;
    this.specificSkill = data.specificSkill || false;
  }

  public functionality(char: Character, origin: Skill) {
    let blocked = char.getDebuffs().ignoreBenefitialEffects;
    const buff = char.getBuffs().damageIncreasal;

    if (blocked) {
      if (this.specificSkill)
        this.specificSkillName = this.arenaReference
          .findCharacterById(this.caster)
          .char.findSkillById(this.specificSkill).name;
      return;
    }

    if (this.skillType) {
      buff.bySkillClass[this.skillType] =
        (buff.bySkillClass[this.skillType] || 0) + this.value;
    } else if (this.specificSkill) {
      buff.bySkillId[this.specificSkill] =
        (buff.bySkillId[this.specificSkill] || 0) + this.value;
      this.specificSkillName = this.arenaReference
        .findCharacterById(this.caster)
        .char.findSkillById(this.specificSkill).name;
    } else if (this.damageType) {
      buff.byDamage[this.damageType] =
        (buff.byDamage[this.damageType] || 0) + this.value;
    }
  }

  public generateToolTip() {
    if (this.skillType) {
      this.message = `This character will deal ${this.value} more damage with ${
        SkillClassType[this.skillType]
      } skills`;
    } else if (this.specificSkill) {
      this.message = `'${this.specificSkillName}' will deal ${this.value} more damage`;
    } else if (this.damageType) {
      this.message = `This character will deal ${this.value} more ${
        DamageType[this.damageType]
      } damage`;
    }
  }
}
/*[Debuff] Increase amount of damage a character takes when targeted */
export class IncreaseDamageTaken extends Effect {
  private skillType: SkillClassType;
  private specificSkill: number;
  private damageType: DamageType;
  private specificSkillName: string;

  constructor(data: any, caster: number) {
    super(data, caster);
    this.skillType = data.skillType || false;
    this.damageType = data.damageType || false;
    this.specificSkill = data.specificSkill || false;
  }

  public functionality(char: Character, origin: Skill) {
    let blocked = char.getBuffs().ignoreHarmfulEffects.status;

    if (blocked) {
      if (this.specificSkill)
        this.specificSkillName = this.arenaReference
          .findCharacterById(this.caster)
          .char.findSkillById(this.specificSkill).name;
      return;
    }

    const debuff = char.getDebuffs().increaseDamageTaken;

    if (this.skillType) {
      debuff.bySkillClass[this.skillType] =
        (debuff.bySkillClass[this.skillType] || 0) + this.value;
    } else if (this.specificSkill) {
      debuff.bySkillId[this.specificSkill] =
        (debuff.bySkillId[this.specificSkill] || 0) + this.value;
      this.specificSkillName = this.arenaReference
        .findCharacterById(this.caster)
        .char.findSkillById(this.specificSkill).name;
    } else if (this.damageType) {
      debuff.byDamage[this.damageType] =
        (debuff.byDamage[this.damageType] || 0) + this.value;
    }
  }

  public generateToolTip() {
    if (this.skillType) {
      this.message = `This character will take ${this.value} more damage from ${
        SkillClassType[this.skillType]
      } skills`;
    } else if (this.specificSkill) {
      this.message = `${this.specificSkillName} will deal ${this.value} more damage to this character`;
    } else if (this.damageType) {
      this.message = `${DamageType[this.damageType]} damage will deal ${
        this.value
      } more damage to this character`;
    }
  }
}
/*[Buff] Decrease amount of damage dealt to a character when targeted */
export class DecreaseDamageTaken extends Effect {
  private skillType: SkillClassType;
  private damageType: DamageType;

  constructor(data: any, caster: number) {
    super(data, caster);
    this.skillType = data.skillType;
    this.damageType = data.damageType;
  }

  public functionality(char: Character, origin: Skill) {
    if (char.getDebuffs().ignoreBenefitialEffects) return;
    if (char.getDebuffs().ignoreDecreaseDamageTaken) return;

    const dr = char.getBuffs().decreaseDamageTaken;
    if (dr.bySkillClass[SkillClassType.Any])
      dr.bySkillClass[SkillClassType.Any] += this.value;
    else dr.bySkillClass[SkillClassType.Any] = this.value;

    for (const linked of this.triggerLinkedEffects) {
      switch (linked.condition) {
        case triggerClauseType.IfTargeted:
          {
            for (const temp of this.arenaReference.tempQueue) {
              if (
                this.targets.filter((e) => {
                  return temp.targets.includes(e);
                }).length
              ) {
                log.info(`Apply linked effect on ${temp.caster}`);
                this.applyLinkedEffects(origin, this.caster, [temp.caster], 1);
              }
            }
          }
          break;

        case triggerClauseType.IfTargetedByHarmful:
          {
            for (const temp of this.arenaReference.tempQueue) {
              if (
                this.targets.filter((e) => {
                  return temp.targets.includes(e);
                }).length
              ) {
                this.applyLinkedEffects(origin, this.caster, [temp.caster], 1);
              }
            }
          }
          break;
      }
    }
    /*log.info(`### applied [REDUCE DAMAGE TAKEN] on ${char.name}`);
    log.info(
      `${char.getBuffs().decreaseDamageTaken.bySkillClass[SkillClassType.Any]}`
    );*/
  }

  public generateToolTip() {
    this.message = `This character has ${this.value} points of damage reduction`;
  }
}
/**[Buff] Convert damage into health at certain ratio */
export class AbsorbDamage extends Effect {
  private skillType: SkillClassType;
  private damageType: DamageType;

  constructor(data: any, caster: number) {
    super(data, caster);
    this.skillType = data.skillType;
    this.damageType = data.damageType;
  }

  public functionality(char: Character, origin: Skill) {
    if (char.getDebuffs().ignoreBenefitialEffects) return;
    char.setBuff({
      damageType: this.damageType,
      value: this.value,
      skillType: this.skillType,
      buffType: BuffTypes.AbsorbDamage,
      //class?: SkillClassType;
    });
  }

  public generateToolTip() {
    if (this.value === 100)
      this.message = `This character takes no damage from ${
        SkillClassType[this.skillType]
      } skills`;
    else
      this.message = `This character will be healed by ${
        SkillClassType[this.skillType]
      } skills`;
  }
}
/**[Debuff] Makes character unable to reduce damage taken */
export class IgnoreDecreaseDamageTaken extends Effect {
  constructor(data: any, caster: number) {
    super(data, caster);
  }
  functionality(char: Character, origin: Skill) {
    if (char.getDebuffs().ignoreBenefitialEffects) return;
    char.getDebuffs().ignoreDecreaseDamageTaken = true;
  }
  generateToolTip() {
    this.message = "This character cannot reduce damage";
  }
}
