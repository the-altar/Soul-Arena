import { effectType, targetType } from "../../enums";
import {log} from "../../../logger"
export class SkillMods {
  private targetMod: targetType;

  public increaseDuration: number;

  constructor(data:any) {
    this.targetMod = data.targetMod || null;
    this.increaseDuration = data.increaseDuration || 0;
  }

  public setTargetMod(target: targetType) {
    this.targetMod = target;
  }

  public getTargetMod(): targetType {
    return this.targetMod;
  }

  public clearTargetMod() {
    this.targetMod = null;
  }
}
