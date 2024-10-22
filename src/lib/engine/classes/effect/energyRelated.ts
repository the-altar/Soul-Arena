import { Effect } from "./base";
import {
  activationType,
  CostTypes,
  ReiatsuTypes,
  triggerClauseType,
} from "../../enums";
import { Character } from "../character";
import { Skill } from "../skill";
import { Player } from "../player";

export class EnergyGain extends Effect {
  energyType: CostTypes;
  constructor(data: any, caster: number) {
    super(data, caster);
    this.energyType = data.energyType;
  }

  public functionality(char: Character, origin: Skill) {
    if (char.getDebuffs().ignoreBenefitialEffects) return;
    const p = this.arenaReference.findPlayerByCharacterIndex(this.caster);
    let index: number;
    if (this.energyType === CostTypes.Random)
      index = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
    else index = this.energyType;
    p.increaseEnergyPool(index, this.value);
  }

  public generateToolTip() {
    if (this.triggerClause !== triggerClauseType.None && !this.triggered) {
      switch (this.triggerClause) {
        case triggerClauseType.onKnockOut: {
          this.message = `If Knocked out a PP gain effect will be triggered`;
        }
      }
    } else {
      this.message = `This character will gain ${this.value} extra reiatsu`;
    }
  }
}

export class EnergyRemoval extends Effect {
  energyType: ReiatsuTypes;
  constructor(data: any, caster: number) {
    super(data, caster);
    this.energyType = data.energyType;
  }

  public functionality(char: Character, origin: Skill) {
    if (char.getBuffs().ignoreHarmfulEffects.status) return;
    const p = this.arenaReference.findPlayerByChar(char);

    if (this.triggerClause === triggerClauseType.IfTargeted) {
      for (const cordinate of this.arenaReference.tempQueue) {
        const isTargeted = this.arenaReference
          .getCharacterIdByIndexes(cordinate.targets)
          .includes(char.getId());
        const targetedBy = this.arenaReference.characters[
          cordinate.caster
        ].skills[cordinate.skill].getId();
        if (isTargeted && origin.getId() !== targetedBy)
          this.apply(null, null, p);
      }
    } else {
      this.apply(null, null, p);
    }
  }

  public generateToolTip() {
    if (this.triggerClause === triggerClauseType.None) {
      this.message = `This character will lose ${this.value} ${
        ReiatsuTypes[this.energyType]
      } reiatsu`;
    } else if (this.triggerClause === triggerClauseType.IfTargeted) {
      this.message = `If this character is targeted by a new skill they'll lose ${
        this.value
      } ${ReiatsuTypes[this.energyType]} reiatsu`;
    }
  }

  public apply(char: Character, origin: Skill, p?: Player) {
    let index: number;
    if (this.energyType === ReiatsuTypes.Random && p.getEnergyPool()[4] > 0) {
      do {
        index = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
      } while (p.getEnergyPool()[index] === 0);
    } else index = this.energyType;
    p.decreaseEnergyPool(index, this.value);
  }
}

export class EnergySteal extends Effect {
  energyType: ReiatsuTypes;
  constructor(data: any, caster: number) {
    super(data, caster);
    this.energyType = data.energyType;
  }

  public functionality(char: Character, origin: Skill) {
    if (char.getBuffs().ignoreHarmfulEffects.status) return;
    const p = this.arenaReference.findPlayerByChar(char);

    if (this.triggerClause === triggerClauseType.IfTargeted) {
      for (const cordinate of this.arenaReference.tempQueue) {
        const isTargeted = this.arenaReference
          .getCharacterIdByIndexes(cordinate.targets)
          .includes(char.getId());
        const targetedBy = this.arenaReference.characters[
          cordinate.caster
        ].skills[cordinate.skill].getId();
        if (isTargeted && origin.getId() !== targetedBy)
          this.apply(null, origin, p);
      }
    } else {
      this.apply(null, origin, p);
    }
  }

  public generateToolTip() {
    if (this.triggerClause === triggerClauseType.None) {
      this.message = `This character will have ${this.value} ${
        ReiatsuTypes[this.energyType]
      } reiatsu stolen`;
    } else if (this.triggerClause === triggerClauseType.IfTargeted) {
      this.message = `If this character is targeted by a new skill they'll have ${
        this.value
      } ${ReiatsuTypes[this.energyType]} reiatsu stolen`;
    }
  }

  public apply(char: Character, origin: Skill, p?: Player) {
    let index: number;
    const casterP = this.arenaReference.findPlayerByChar(
      origin.casterReference
    );

    if (this.energyType === ReiatsuTypes.Random && p.getEnergyPool()[4] > 0) {
      do {
        index = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
      } while (p.getEnergyPool()[index] === 0);
    } else index = this.energyType;
    p.decreaseEnergyPool(index, this.value);
    p.increaseEnergyPool(index, this.value);
  }
}
