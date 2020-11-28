import { Effect } from "./base";
import {
  BuffTypes,
  activationType,
  triggerClauseType,
  PlayerPhase,
} from "../../enums";
import { Character } from "../character";
import { Skill } from "../skill";

export class DestructibleDefense extends Effect {
  public targetChar: Character;
  public hasBeenApplied: boolean;
  constructor(data: any, caster: number) {
    super(data, caster);
    this.targetChar = null;
    this.hasBeenApplied = false;
  }

  public functionality(char: Character, origin: Skill) {
    //if (this.hasBeenApplied) {}
    char.getBuffs().destructibleDefense += this.value;
    this.targetChar = char;
    this.hasBeenApplied = true;
  }

  public progressTurn() {
    this.delay--;
    if (this.targetChar !== null) {
      this.value = Math.min(
        this.targetChar.getBuffs().destructibleDefense,
        this.value
      );
      this.targetChar.getBuffs().destructibleDefense = Math.max(
        0,
        this.targetChar.getBuffs().destructibleDefense - this.value
      );
    }
    this.generateToolTip()

    if (this.delay <= 0) this.duration--;
    /*  An even tick means it's your opponent's turn, odd means its yours.*/
    /*  The default behavior is for your skills to activate on odd ticks*/
    if (this.tick % 2 === PlayerPhase.MyTurn || this.compulsory) {
      this.activate = false;
    } else this.activate = true;

    if (this.duration < 0 && !this.infinite) this.terminate = true;
    else this.terminate = false;

    if (this.value <= 0) this.terminate = true;
    if (this.targets.length === 0) this.terminate = true;

    if (this.terminate) this.effectConclusion();
  }
  
  public generateToolTip() {
    this.message = `This character has ${this.value} destructible defense`;
  }

  shouldApply() {
    const triggerRate = Math.floor(Math.random() * 101);
    if (triggerRate <= this.triggerRate && this.delay <= 0)
      this.activate = true;
    else this.activate = false;
  }
}
