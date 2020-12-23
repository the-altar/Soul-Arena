import { Effect } from "./base";
import {
  DamageType,
  Types,
  BuffTypes,
  SkillClassType,
  triggerClauseType,
} from "../../enums";
import { Character } from "../character";
import { Skill } from "..";

export class Damage extends Effect {
  private damageType: DamageType;
  constructor(data: any, caster: number) {
    super(data, caster);
    this.damageType = data.damageType;
  }

  public functionality(char: Character, origin: Skill) {
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

  protected destroyDestructibleDefense(char: Character, damage: number) {
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
        this.message = `This character will take ${damageVal} damage if their allies use a new skill`
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

    let { decreased } = char.getBuffs().getDecreaseDamageTaken({
      damageType: this.damageType,
      skillType: origin.class,
    });

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
    const buff = char.getDebuffs().damageReduction;
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
    const buff = char.getBuffs().damageIncreasal;

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
      this.message = `${this.specificSkillName} will deal ${this.value} damage to this character`;
    } else if (this.damageType) {
      this.message = `${DamageType[this.damageType]} damage will deal ${
        this.value
      } more damage to this character`;
    }
  }
}

export class DecreaseDamageTaken extends Effect {
  private skillType: SkillClassType;
  private damageType: DamageType;

  constructor(data: any, caster: number) {
    super(data, caster);
    this.skillType = data.skillType;
    this.damageType = data.damageType;
  }

  public functionality(char: Character, origin: Skill) {
    char.setBuff({
      damageType: this.damageType,
      value: this.value,
      skillType: this.skillType,
      buffType: BuffTypes.DecreaseDamageTaken,
      //class?: SkillClassType;
    });
  }

  public generateToolTip() {
    this.message = `This character has ${this.value} points of damage reduction`;
  }
}

export class AbsorbDamage extends Effect {
  private skillType: Types;
  private damageType: DamageType;

  constructor(data: any, caster: number) {
    super(data, caster);
    this.skillType = data.skillType;
    this.damageType = data.damageType;
  }

  public functionality(char: Character, origin: Skill) {
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
        Types[this.skillType]
      } skills`;
    else
      this.message = `This character will be healed by ${
        Types[this.skillType]
      } skills`;
  }
}

export class IgnoreDecreaseDamageTaken extends Effect {
  constructor(data: any, caster: number) {
    super(data, caster);
  }
  functionality(char: Character, origin: Skill) {
    char.getDebuffs().ignoreDecreaseDamageTaken = true;
  }
  generateToolTip() {
    this.message = "This character cannot reduce damage";
  }
}
