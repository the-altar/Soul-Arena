import { Effect } from "./base";
import { effectType, ReiatsuTypes, targetType } from "../../enums";
import { Character } from "../character";
import { Arena } from "../../arena";
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

  public functionality(char: Character, origin: Skill, world?: Arena) {
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
    this.affectedSkill.mods.clearTargetMod();
  }
}

export class SkillCostChange extends Effect {
  private reiatsuCostType: ReiatsuTypes;
  private specificSkillTarget: number;
  private targetedSkills: Array<Skill>;

  constructor(data: any, caster: any) {
    super(data, caster);
    this.reiatsuCostType = data.reiatsuCostType;
    this.specificSkillTarget = data.specificSkillTarget;
    this.targetedSkills = [];
  }

  public functionality(char: Character, origin: Skill, world?: Arena) {
    if (this.specificSkillTarget) {
      for (const s of char.skills) {
        if (s.getId() === this.specificSkillTarget) {
          s.cost[this.reiatsuCostType] += this.value;
          this.targetedSkills.push(s);
          break;
        }
      }
    } else {
      for (const s of char.skills) {
        s.cost[this.reiatsuCostType] += this.value;
        this.targetedSkills.push(s);
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
        this.targetedSkills[0].name
      }' will cost ${value} ${operation} ${
        ReiatsuTypes[this.reiatsuCostType]
      } reiatsu`;
    }
  }

  effectConclusion() {
    for (const s of this.targetedSkills) {
      if (this.value > 0) s.cost[this.reiatsuCostType] -= this.value;
      else s.cost[this.reiatsuCostType] += this.value * -1;
    }
  }
}

export class IncreaseCasterSkillDuration extends Effect {
  private targetSkillId: number;
  private targetedSkillName: string;
  private skillReference: Skill;
  private noRepeat:boolean

  constructor(data: any, caster: number) {
    super(data, caster);
    this.targetSkillId = data.targetSkillId;
    this.noRepeat = false
  }

  functionality(char: Character, origin: Skill, world?: Arena) {
    if (this.noRepeat) return;
    this.noRepeat = true;
    const skill = char.getRealSkillById(this.targetSkillId);
    if (!skill) return;
    skill.mods.increaseDuration += this.value;
    this.skillReference = skill;
    this.targetedSkillName = skill.name;
    log.info(
      `Duration of ${skill.name} has been extended by ${skill.mods.increaseDuration}`
    );
  }

  generateToolTip() {
    if (this.targetedSkillName) {
      this.message = `'${this.targetedSkillName}' will last ${
        this.value / 2
      } additional turn`;
    }
  }

  effectConclusion() {
    log.info("EFFECT CONCLUSION");
    this.skillReference.mods.increaseDuration -= this.value;
  }
}

export class IncreaseTargetSkillDuration extends Effect {
  private targetSkillId: number;
  private targetedSkillName: string;
  private charReference: Character;
  private noRepeat:boolean

  constructor(data: any, caster: number) {
    super(data, caster);
    this.targetSkillId = data.targetSkillId;
  }

  functionality(char: Character, origin: Skill, world?: Arena) {
    if (this.noRepeat) return;
    this.noRepeat= true;
    const val = char.getDebuffs().increaseSkillDuration[this.targetSkillId];
    char.getDebuffs().increaseSkillDuration[this.targetSkillId] =
      (val || 0) + this.value;
    this.targetedSkillName = world
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
    delete this.charReference.getDebuffs().increaseSkillDuration[
      this.targetSkillId
    ];
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
