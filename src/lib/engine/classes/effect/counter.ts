import { Effect } from "./base";
import { SkillClassType, effectType, PlayerPhase } from "../../enums";
import { Character } from "../character";
import { Arena } from "../../arena";
import { Skill } from "..";
import { log } from "../../../logger";

export class Counter extends Effect {
  private counterType: SkillClassType;
  private counterEffectType: effectType;
  private isDefensive: boolean;
  private triggerOnCounter: Array<{
    id: Number;
    self: boolean;
    victim: boolean;
    target: boolean;
  }>;

  constructor(data: any, caster: number) {
    super(data, caster);
    this.tick = 0
    this.isDefensive = data.isDefensive || false;
    this.counterType = data.counterType || false;
    this.counterEffectType = data.counterEffectType || false;
    this.triggerOnCounter = data.triggerOnCounter || [];
  }

  public functionality(target: Character, origin: Skill) {
    let isTriggered: { activated: boolean; indexes: Array<number> };

    if (this.isDefensive)
      isTriggered = this.DefensiveCounter(target, origin);
    else isTriggered = this.OffensiveCounter(target, origin);

    if (isTriggered.activated) {
      const casterIndex = this.arenaReference.findCharacterById(this.caster).index;
      const casterChar = this.arenaReference.findCharacterById(this.caster).char
      const targetsIndex = isTriggered.indexes;
      this.applyLinkedEffects(origin, casterIndex, targetsIndex);
    }
  }

  private OffensiveCounter(target: Character, origin: Skill) {
    const temp = this.arenaReference.getTempSkills();
    const indexes: Array<number> = [];

    let hasCountered = { activated: false, indexes };

    for (let i = temp.length - 1; i >= 0; i--) {
      const cordinates = temp[i];
      const caster = this.arenaReference.getCharactersByIndex([cordinates.caster])[0];
      const skill = caster.getRealSkillByIndex(cordinates.skill);
      if (this.value === 0) return hasCountered;
      if (skill.uncounterable) continue;

      if (
        (this.counterType === SkillClassType.Any ||
          skill.class == this.counterType) &&
        caster.getId() === target.getId()
      ) {
        temp.splice(i, 1);
        caster.addNotification({
          msg: "This character has been countered",
          id: origin.getId(),
          skillpic: origin.skillpic,
          skillName: origin.name,
        });
        hasCountered.activated = true;
        hasCountered.indexes.push(cordinates.caster);
        this.value--;
      }
    }

    return hasCountered;
  }

  private DefensiveCounter(target: Character, origin: Skill) {
    const temp = this.arenaReference.getTempSkills().reverse();
    const indexes: Array<number> = [];

    let hasCountered = { activated: false, indexes };

    for (let i = temp.length - 1; i >= 0; i--) {
      if (this.value === 0) return hasCountered;
      const cordinates = temp[i];
      const char = this.arenaReference.getCharactersByIndex([cordinates.caster])[0];
      const skill = char.getRealSkillByIndex(cordinates.skill);
      if (skill.uncounterable) continue;

      if (
        this.counterType === SkillClassType.Any ||
        skill.class === this.counterType
      ) {
        for (const t of cordinates.targets) {
          const sufferer = this.arenaReference.getCharactersByIndex([t])[0];
          if (sufferer.getId() === target.getId()) {
            temp[i].cancelled = true;
            char.addNotification({
              msg: "This character has been countered",
              id: origin.getId(),
              skillpic: origin.skillpic,
              skillName: origin.name,
            });
            this.value--;
            hasCountered.activated = true;
            hasCountered.indexes.push(cordinates.caster);
            break;
          }
        }
      }
    }

    return hasCountered;
  }

  applyLinkedEffects(origin: Skill, caster: number, targets: Array<number>) {
    for (const trigger of this.triggerOnCounter) {
      for (const effect of origin.inactiveEffects) {
        if (effect.id !== trigger.id) continue;

        if (trigger.self) {
          effect.triggerRate = 100;
          effect.setTargets([caster]);
          origin.effects.push(effect);
        }
      }
    }
  }

  public progressTurn() {
    this.delay--;
    if (this.delay <= 0) this.duration--;
    /*  An even tick means it's your opponent's turn, odd means its yours.*/
    /*  The default behavior is for your skills to activate on odd ticks*/
    if (this.tick % 2 === PlayerPhase.MyTurn) {
      this.activate = false;
    } else this.activate = true;

    if (this.duration < 0 && !this.infinite) this.terminate = true;
    else if (this.targets.length === 0) this.terminate = true;
    else if (this.value === 0) this.terminate = true;
    else this.terminate = false;

    if (this.terminate) this.effectConclusion();
  }

  generateToolTip() {
    if(this.value === 1 && this.DefensiveCounter) {
      this.message = `The first new skill used on this character will be countered`
    }
    else if(this.value === 1 && this.OffensiveCounter){
      this.message = `The first new skill used by this character will be countered`
    }
    else if (this.OffensiveCounter) {
      this.message = "New skills used on this character will be countered"
    }
    else if (this.DefensiveCounter) {
      this.message = "New skills used by this character will be countered"
    }
  }
  
}
