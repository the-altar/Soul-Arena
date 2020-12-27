import { Effect } from "./base";
import {
  BuffTypes,
  activationType,
  triggerClauseType,
  PlayerPhase,
} from "../../enums";
import { Character } from "../character";
import { Skill } from "../skill";

/**Destructible defense must be destroyed before dealing damage. A bit more complex */
export class DestructibleDefense extends Effect {
  private noRepeat:boolean
  public uniqueId: number;

  constructor(data: any, caster: number) {
    super(data, caster);
    this.noRepeat = false;
  }

  public functionality(char: Character, origin: Skill) {
    if (this.noRepeat) return;
    this.uniqueId = Date.now() + Math.random();
    this.noRepeat = true;
    char.getBuffs().destructibleDefense[this.uniqueId] = this;
  }

  public progressTurn() {
    this.delay--;
    this.generateToolTip();

    if (this.delay <= 0) this.duration--;
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

  effectConclusion(){
    this.value = 0
  }
}
