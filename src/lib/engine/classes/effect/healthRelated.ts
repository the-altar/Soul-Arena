import { Character } from "..";
import { Arena } from "../../arena";
import { Damage } from "./damageRelated";
import { Effect } from "./base";
import { triggerClauseType, SkillClassType } from "../../enums";
import { Skill } from "../skill";

export class Healing extends Effect {
  constructor(data: any, caster: number) {
    super(data, caster);
  }

  public functionality(char: Character, origin: Skill) {
    if (char.getDebuffs().ignoreBenefitialEffects) return;
    const buff = char.buffs.increaseHealthHealed.bySkillId[origin.id] || 0;
    const hp = char.geHitPoints() + this.value + buff;
    char.setHitPoints(hp);
  }

  public generateToolTip() {
    if (this.triggerClause !== triggerClauseType.None && !this.triggered) {
      switch (this.triggerClause) {
        case triggerClauseType.onKnockOut: {
          this.message = `If Knocked out a healing effect will be triggered`;
        }
      }
    } else {
      if (this.delay > 0) {
        this.message = `After ${this.delay} turn(s) this character will heal ${this.value} health`;
      } else {
        this.message = `This character will heal ${this.value} health`;
      }
    }
  }
}

export class HealthDrain extends Damage {
  constructor(data: any, caster: number) {
    super(data, caster);
  }

  public functionality(character: Character, origin: Skill) {
    if (character.getBuffs().ignoreHarmfulEffects.status) return;
    const reduction = this.getDamageReductionFromCaster(
      this.caster,
      this,
      origin
    );
    let damage = this.value - reduction;
    if (damage < 0) damage = 0;

    const hp = character.geHitPoints() - Math.round(damage / 5) * 5;
    character.setHitPoints(hp);

    const { char } = this.arenaReference.findCharacterById(this.caster);
    if (char.isKnockedOut()) return;
    char.setHitPoints(char.geHitPoints() + Math.round(damage / 5) * 5);
  }

  public generateToolTip() {
    if (this.triggerClause !== triggerClauseType.None && !this.triggered) {
      switch (this.triggerClause) {
        case triggerClauseType.onKnockOut: {
          if (this.delay > 0) {
            this.message = `If Knocked out a healing effect will be triggered`;
          }
        }
      }
    } else {
      if (this.delay > 0) {
        this.message = `In ${this.delay} this character will have its health drained`;
      } else {
        this.message = `This character will be drained ${this.value} health`;
      }
    }
  }
}

export class IgnoreDeath extends Effect {
  constructor(data: any, caster: number) {
    super(data, caster);
  }

  public functionality(character: Character, origin: Skill) {
    if (character.getDebuffs().ignoreBenefitialEffects) return;
    character.getBuffs().cannotBeKilled = true;
  }

  public generateToolTip() {
    this.message = this.message || "This character cannot be killed";
  }
}

export class IncreaseHealthHealed extends Effect {
  private skillType: SkillClassType;
  private specificSkill: any;
  private specificSkillName: string;

  constructor(data: any, caster: number) {
    super(data, caster);
    this.skillType = data.skillType || false;
    this.specificSkill = data.specificSkill || false;
  }

  public functionality(char: Character, origin: Skill) {
    let blocked = false;
    blocked = char.getDebuffs().ignoreBenefitialEffects;
    const buff = char.getBuffs().increaseHealthHealed;

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
    }
  }

  public generateToolTip() {
    if (this.skillType) {
      this.message = `This character will be healed ${
        this.value
      } more health by ${SkillClassType[this.skillType]} skills`;
    } else if (this.specificSkill) {
      this.message = `'${this.specificSkillName}' will heal ${this.value} more health`;
    }
  }
}
