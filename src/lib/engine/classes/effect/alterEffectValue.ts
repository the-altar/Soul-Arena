import { Effect } from "./base";
import { effectType, SkillClassType, Types } from "../../enums";
import { Character } from "../character";
import { Skill } from "..";
import { Arena } from "../../arena";
import { log } from "../../../logger";
export class AlterEffectValue extends Effect {
  private anyEffect: boolean;
  private anySkill: boolean;
  private targetSkillId: number | boolean;
  private effectType: effectType | boolean;
  private targetSkillName: string;
  private incrementVal: number;
  public applied: boolean;
  private changedEffects: Array<{
    effect: Effect;
    originalAltValue: number;
    originalIncrement: number;
  }>;

  constructor(data: any, caster: number) {
    super(data, caster);
    this.targetSkillId = data.targetSkillId || false;
    this.effectType = data.effectType;
    this.anyEffect = data.anyEffect || false;
    this.anySkill = data.anySkill || false;
    this.targetSkillName = "";
    this.incrementVal = data.incrementVal || 0;
    this.changedEffects = [];
    this.applied = data.applied || false;
  }

  public functionality(char: Character, origin: Skill, world?: Arena) {
    if (this.applied) return;

    for (const skill of char.getSkills()) {
      if (!this.anySkill && skill.getId() !== this.targetSkillId) continue;
      for (const effect of skill.effects) {
        if (!this.anyEffect && this.effectType !== effect.getType()) continue;

        let originalIncrement = effect.mods.increment.value;
        let originalAltValue = effect.getAltValue();

        effect.setAltValue(this.value);
        effect.mods.increment.value = this.incrementVal;
        this.changedEffects.push({
          effect,
          originalAltValue,
          originalIncrement,
        });
      }

      this.targetSkillName = skill.name;
    }

    this.applied = true;
  }

  public generateToolTip() {
    if (!this.anySkill) {
      this.message = `${this.targetSkillName} has been altered`;
    } else {
      this.message = "This character's skills have been altered";
    }
  }

  protected effectConclusion() {
    for (const payload of this.changedEffects) {
      payload.effect.setAltValue(payload.originalAltValue);
      payload.effect.mods.increment.value = payload.originalIncrement;
    }
  }

  public getPublicData() {
    const publicData = { ...this };
    delete publicData.arenaReference;
    delete publicData.changedEffects;

    return { ...publicData };
  }
}

export class EnableEffects extends Effect {
  private effectsId: Array<number>;
  private parentSkillId: number;
  private targetedSkill: Skill;
  private hasBeenApplied: boolean;
  private skillName: string;

  constructor(data: any, caster: number) {
    super(data, caster);
    this.effectsId = data.effectsId;
    this.parentSkillId = data.parentSkillId;
  }

  functionality(char: Character, origin: Skill) {
    if (char.getDebuffs().ignoreBenefitialEffects) {
      if (!this.hasBeenApplied) {
        this.skillName = char.findSkillById(this.parentSkillId).name;
        return;
      }
      this.effectConclusion();
      this.hasBeenApplied = false;
      return;
    }

    if (this.hasBeenApplied) return;

    const targetedSkill = char.findSkillById(this.parentSkillId);
    for (const e of targetedSkill.inactiveEffects) {
      if (this.effectsId.includes(e.id)) {
        e.triggerRate = 100;
        targetedSkill.effects.push(e);
      }
    }
    this.skillName = targetedSkill.name;
    this.targetedSkill = targetedSkill;
    this.hasBeenApplied = true;
  }

  generateToolTip() {
    this.message = this.message || `'${this.skillName}' has been improved`;
  }

  effectConclusion() {
    if (!this.targetedSkill) return;
    for (let i = this.targetedSkill.effects.length - 1; i >= 0; i--) {
      const e = this.targetedSkill.effects[i];
      if (this.effectsId.includes(e.id)) {
        e.triggerRate = -1;
        this.targetedSkill.effects.splice(i, 1);
      }
    }
  }

  public getPublicData() {
    const publicData = { ...this };
    delete publicData.arenaReference;
    delete publicData.targetedSkill;

    return { ...publicData };
  }
}

export class DisableEffects extends Effect {
  private effectsId: Array<number>;
  private parentSkillId: number;
  private targetedSkill: Skill;
  private hasBeenApplied: boolean;

  constructor(data: any, caster: number) {
    super(data, caster);
    this.effectsId = data.effectsId;
    this.parentSkillId = data.parentSkillId;
  }

  functionality(char: Character, origin: Skill) {
    if (this.hasBeenApplied) return;

    const targetedSkill = char.findSkillById(this.parentSkillId);
    for (const e of targetedSkill.effects) {
      if (this.effectsId.includes(e.id)) {
        e.triggerRate = -1;
      }
    }
    this.targetedSkill = targetedSkill;
    this.hasBeenApplied = true;
  }

  generateToolTip() {
    this.message = null;
  }

  effectConclusion() {
    for (let i = this.targetedSkill.effects.length - 1; i >= 0; i--) {
      const e = this.targetedSkill.effects[i];
      if (this.effectsId.includes(e.id)) {
        e.triggerRate = 100;
      }
    }
  }

  public getPublicData() {
    const publicData = { ...this };
    delete publicData.arenaReference;
    delete publicData.targetedSkill;
    return { ...publicData };
  }
}
