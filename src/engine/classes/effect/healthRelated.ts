import { Character } from "..";
import { Arena } from "../../arena";
import { Damage } from "./damageRelated";
import { Effect } from "./base";
import { triggerClauseType } from "../../enums";
import { Skill } from "../skill";

export class Healing extends Effect {
  constructor(data: any, caster: number) {
    super(data, caster);
  }

  public functionality(char: Character, origin: Skill) {
    this.triggered = true;
    const hp = char.geHitPoints() + this.value;
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
    this.triggered = true;
    const reduction = this.getDamageReductionFromCaster(
      this.caster,
      this,
      origin,
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
