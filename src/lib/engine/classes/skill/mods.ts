import { effectType, targetType, ReiatsuTypes } from "../../enums";
export class SkillMods {
  private targetMod: targetType;
  public increaseDuration: number;
  public costReplacement: Array<ReiatsuTypes>;
  public costChange: {
    [x: number]: number;
  };

  constructor(data: any) {
    this.targetMod = data.targetMod || null;
    this.increaseDuration = data.increaseDuration || 0;
    this.costReplacement = null;
    this.costChange = data.costChange || {
      [ReiatsuTypes.Hakuda]: 0,
      [ReiatsuTypes.Kidou]: 0,
      [ReiatsuTypes.Random]: 0,
      [ReiatsuTypes.Reiryoku]: 0,
      [ReiatsuTypes.Zanpakutou]: 0,
    };
  }

  public setTargetMod(target: targetType) {
    this.targetMod = target;
  }

  public getTargetMod(): targetType {
    return this.targetMod;
  }

  public clearMods() {
    this.targetMod = null;
    this.costChange = {
      [ReiatsuTypes.Hakuda]: 0,
      [ReiatsuTypes.Kidou]: 0,
      [ReiatsuTypes.Random]: 0,
      [ReiatsuTypes.Reiryoku]: 0,
      [ReiatsuTypes.Zanpakutou]: 0,
    };
    this.costReplacement = null;
  }
}
