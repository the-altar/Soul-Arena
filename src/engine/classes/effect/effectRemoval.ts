import { Effect } from "./base";
import { effectType, Types } from "../../enums";
import { Character } from "../character";
import { Skill } from "..";
import { Arena } from "../../arena";
import { isHarmful } from "./z.helpers";

export class EffectRemoval extends Effect {
  private harmful: boolean;
  private friendly: boolean;
  private specificSkillType: Types;
  private specificEffect: effectType;
  private specificSkillId: number;

  constructor(data: any, caster: number) {
    super(data, caster);
    this.harmful = data.harmful || false;
    this.friendly = data.friendly || false;
    this.specificEffect = data.specificEffect;
    this.specificSkillType = data.specificSkillType || false;
    this.specificSkillId = data.specificSkillId;
  }

  public functionality(char: Character, origin: Skill) {
    if (this.harmful) this.removeHarmfulEffects(char);
    else if (this.friendly) this.removeFriendlyEffects(char);
    else if (this.specificSkillId) this.removeSpecificSkill(char);
  }

  public generateToolTip() {
    if (this.harmful) {
      this.message = "Harmful effects affecting this character will be removed";
    } else if (this.friendly) {
      this.message =
        "Friendly effects affecting this character will be removed";
    } else {
      this.message = "Effects affecting this character will be removed";
    }
  }

  removeHarmfulEffects(char: Character) {
    const skills = this.arenaReference.getActiveSkills();
    for (const skill of skills) {
      let wasRemoved = false;
      for (const effect of skill.effects) {
        if (!isHarmful(effect.getType())) continue;
        wasRemoved = reduceTargets(effect, char, this.arenaReference);
      }
      if (wasRemoved) skill.removeCharFromTargets(char);
    }
  }

  removeFriendlyEffects(char: Character) {
    const skills = this.arenaReference.getActiveSkills();
    for (const skill of skills) {
      let wasRemoved = false;
      for (const effect of skill.effects) {
        if (isHarmful(effect.getType())) continue;
        wasRemoved = reduceTargets(effect, char, this.arenaReference);
      }
      if (wasRemoved) skill.removeCharFromTargets(char);
    }
  }

  removeSpecificSkill(char: Character) {
    const skills = this.arenaReference.getActiveSkills();
    for (const skill of skills) {
      if (skill.getId() !== this.specificSkillId) continue;
      for (const effect of skill.effects) {
        reduceTargets(effect, char, this.arenaReference);
      }
      skill.removeCharFromTargets(char);
    }
  }
}

function reduceTargets(arr: Skill | Effect, char: Character, world: Arena) {
  let targetList = arr.getTargets();

  for (let i = targetList.length - 1; i >= 0; i--) {
    const target = world.getCharactersByIndex([targetList[i]])[0];
    if (target.getId() === char.getId()) {
      targetList.splice(i, 1);
      return true;
    }
  }

  return false;
}
