import { log } from "../../../logger";
import { Skill } from "./index";
import { effectType, targetType, ReiatsuTypes, ControlType } from "../../enums";
export class SkillMods {
  private targetMod: targetType;
  public increaseDuration: number;
  public costReplacement: Array<ReiatsuTypes>;
  public costChange: {
    [x: number]: number;
  };
  public replacedBy: Skill;
  public meta: {
    [x: string]: any;
  };

  constructor(data: any) {
    this.targetMod = data.targetMod || null;
    this.increaseDuration = data.increaseDuration || 0;
    this.costReplacement = data.costReplacement || null;
    this.costChange = data.costChange || {
      [ReiatsuTypes.Hakuda]: 0,
      [ReiatsuTypes.Kidou]: 0,
      [ReiatsuTypes.Random]: 0,
      [ReiatsuTypes.Reiryoku]: 0,
      [ReiatsuTypes.Zanpakutou]: 0,
    };
    this.meta = {
      cost: null,
      class: null,
      targetMode: null,
      persistence: null,
      baseCooldown: null,
      requiresSkillOnTarget: [],
      cannotBeUsedOnTargetOf: [],
    };
    this.replacedBy = null
  }

  public setTargetMod(target: targetType) {
    this.targetMod = target;
  }

  public getTargetMod(): targetType {
    return this.targetMod;
  }

  public setByAttribute(data: any, charId: number) {
    this.meta = JSON.parse(JSON.stringify(data));
    this.meta.requiresSkillOnTarget = this.meta.requiresSkillOnTarget.map(
      (e: any) => {
        return `${e}-${charId}`;
      }
    );
    this.meta.cannotBeUsedOnTargetOf = this.meta.cannotBeUsedOnTargetOf.map(
      (e: any) => {
        return `${e}-${charId}`;
      }
    );
  }

  public getAttrValue(attr: string) {
    try {
      return this.meta[attr];
    } catch (e) {
      log.error(e);
      return null;
    }
  }

  public clearMods() {
    this.targetMod = null;
    this.increaseDuration = 0;
    this.costReplacement = null;
    this.costChange = {
      [ReiatsuTypes.Hakuda]: 0,
      [ReiatsuTypes.Kidou]: 0,
      [ReiatsuTypes.Random]: 0,
      [ReiatsuTypes.Reiryoku]: 0,
      [ReiatsuTypes.Zanpakutou]: 0,
    };
    this.meta = {
      cost: null,
      class: null,
      targetMode: null,
      persistence: null,
      baseCooldown: null,
      requiresSkillOnTarget: [],
      cannotBeUsedOnTargetOf: [],
    };
  }
}
