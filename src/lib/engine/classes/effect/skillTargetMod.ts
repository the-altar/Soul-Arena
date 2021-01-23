import { Effect } from "./base";
import { PlayerPhase, ReiatsuTypes, targetType } from "../../enums";
import { Character } from "../character";
import { Skill } from "../skill";
import { log } from "../../../logger";

export class SkillTargetMod extends Effect {
  private newTarget: targetType;
  private targetSpecificSkill: boolean;
  private specificSkillIndex: number;
  private affectedSkill: Skill;

  constructor(data: any, caster: any) {
    super(data, caster);
    this.newTarget = data.newTarget;
    this.targetSpecificSkill = data.targetSpecificSkill || false;
    this.specificSkillIndex = data.specificSkillIndex || -1;
  }

  public functionality(char: Character, origin: Skill) {
    const s = char.getRealSkillById(this.specificSkillIndex);
    if (this.targetSpecificSkill) {
      s.setTargetMod(this.newTarget);
    } else {
      const skills = char.getSkills();
      for (const skill of skills) {
        skill.setTargetMod(this.newTarget);
      }
    }
    this.affectedSkill = s;
  }

  public generateToolTip() {
    this.message = generateMessage(
      this.specificSkillIndex,
      this.newTarget,
      this.affectedSkill.name
    );
  }

  effectConclusion() {
    this.affectedSkill.mods.setTargetMod(null);
  }

  public getPublicData() {
    const publicData = { ...this };
    delete publicData.arenaReference;
    delete publicData.affectedSkill;

    return publicData;
  }
}

export class SkillCostChange extends Effect {
  private reiatsuCostType: ReiatsuTypes;
  private specificSkillTarget: number;
  private targetedSkillName: string;

  constructor(data: any, caster: any) {
    super(data, caster);
    this.reiatsuCostType = data.reiatsuCostType;
    this.specificSkillTarget = data.specificSkillTarget;
    this.targetedSkillName = "";
  }

  public functionality(char: Character, origin: Skill) {
    if (this.specificSkillTarget) {
      for (const s of char.skills) {
        if (s.getId() === this.specificSkillTarget) {
          s.mods.costChange[this.reiatsuCostType] += this.value;
          this.targetedSkillName = s.name;
          break;
        }
      }
    } else {
      for (const s of char.skills) {
        s.mods.costChange[this.reiatsuCostType] += this.value;
      }
    }
  }

  generateToolTip() {
    let operation = "";
    let value = this.value;

    if (this.value > 0) {
      operation = "more";
    } else {
      operation = "less";
      value *= -1;
    }

    if (!this.specificSkillTarget) {
      this.message = `This character's skills will cost ${value} ${operation} ${
        ReiatsuTypes[this.reiatsuCostType]
      } reiatsu`;
    } else {
      this.message = `'${
        this.targetedSkillName
      }' will cost ${value} ${operation} ${
        ReiatsuTypes[this.reiatsuCostType]
      } reiatsu`;
    }
  }

  public getPublicData() {
    const publicData = { ...this };
    delete publicData.arenaReference;
    return publicData;
  }
}

export class ReplaceSkillCost extends Effect {
  private reiatsuReplacement: Array<ReiatsuTypes>;
  private specificSkillTarget: number;
  private targetedSkillName: string;

  constructor(data: any, caster: any) {
    super(data, caster);
    this.reiatsuReplacement = data.reiatsuReplacement;
    this.specificSkillTarget = data.specificSkillTarget;
    this.targetedSkillName = "";
  }

  public functionality(char: Character, origin: Skill) {
    if (this.specificSkillTarget) {
      for (const s of char.skills) {
        if (s.getId() === this.specificSkillTarget) {
          s.mods.costReplacement = this.reiatsuReplacement;
          this.targetedSkillName = s.name;
          break;
        }
      }
    } else {
      for (const s of char.skills) {
        s.mods.costReplacement = this.reiatsuReplacement;
      }
    }
  }

  generateToolTip() {
    this.message = "Costs have been replaced";
  }
}

export class IncreaseCasterSkillDuration extends Effect {
  private targetSkillId: number;
  private targetedSkillName: string;
  private skillReference: Skill;
  private noRepeat: boolean;

  constructor(data: any, caster: number) {
    super(data, caster);
    this.targetSkillId = data.targetSkillId;
    this.noRepeat = false;
  }

  functionality(char: Character, origin: Skill) {
    if (char.getDebuffs().ignoreBenefitialEffects) {
      this.noRepeat = false;
      if (!this.targetedSkillName) {
        this.targetedSkillName = char.findSkillById(this.targetSkillId).name;
      } else {
        this.effectConclusion();
      }
      return;
    }

    if (this.noRepeat) return;
    this.noRepeat = true;
    const skill = char.getRealSkillById(this.targetSkillId);
    if (!skill) return;
    skill.mods.increaseDuration += this.value;
    this.skillReference = skill;
    this.targetedSkillName = skill.name;
  }

  generateToolTip() {
    if (this.targetedSkillName) {
      this.message = `'${this.targetedSkillName}' will last ${
        this.value / 2
      } additional turn`;
    }
  }

  effectConclusion() {
    if (!this.skillReference) return;
    if (!this.skillReference.mods) return;
    this.skillReference.mods.increaseDuration -= this.value;
  }

  public getPublicData() {
    const publicData = { ...this };
    delete publicData.arenaReference;
    delete publicData.skillReference;

    return { ...publicData };
  }
}

// Increase duration of a skill when used on a specific target ONLY!
export class IncreaseTargetSkillDuration extends Effect {
  private targetSkillId: number;
  private targetedSkillName: string;
  private effectsId: Array<number>;
  private charReference: Character;
  private noRepeat: boolean;

  constructor(data: any, caster: number) {
    super(data, caster);
    this.targetSkillId = data.targetSkillId;
    this.effectsId = data.effectsId || [];
  }

  functionality(char: Character, origin: Skill) {
    if (char.getBuffs().ignoreHarmfulEffects.status) {
      this.noRepeat = false;
      if (!this.targetedSkillName) {
        this.targetedSkillName = this.arenaReference
          .findCharacterById(this.caster)
          .char.findSkillById(this.targetSkillId).name;
      }
      this.charReference = char;
      this.effectConclusion();
      return;
    }

    if (this.noRepeat) return;
    this.noRepeat = true;
    const val = char.getDebuffs().increaseSkillDuration[this.targetSkillId] || {
      value: 0,
      except: [],
    };
    char.getDebuffs().increaseSkillDuration[this.targetSkillId] = {
      value: (val.value || 0) + this.value,
      except: this.effectsId,
    };
    this.targetedSkillName = this.arenaReference
      .findCharacterById(this.caster)
      .char.findSkillById(this.targetSkillId).name;
    this.charReference = char;
  }

  generateToolTip() {
    if (this.targetedSkillName) {
      this.message = `'${this.targetedSkillName}' will last ${
        this.value / 2
      } additional turn if used on this character`;
    }
  }

  effectConclusion() {
    if (!this.charReference) return;
    delete this.charReference.getDebuffs().increaseSkillDuration[
      this.targetSkillId
    ];
  }

  public getPublicData() {
    const publicData = { ...this };
    delete publicData.arenaReference;
    delete publicData.charReference;

    return { ...publicData };
  }
}

function generateMessage(
  specificIndex: number,
  tType: targetType,
  skill: string
) {
  let m = "";
  switch (tType) {
    case targetType.AllAllies:
      {
        m = "all allies";
      }
      break;
    case targetType.OneEnemy:
      {
        m = "one enemy";
      }
      break;
    case targetType.AllEnemies: {
      m = "all enemies";
    }
  }

  if (!specificIndex) return `This character's skills will now target ${m}'`;
  else return `This character will now target ${m} with ${skill}`;
}
