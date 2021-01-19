import { Effect } from "./base";
import { SkillClassType, effectType, PlayerPhase } from "../../enums";
import { Character } from "../character";
import { Arena } from "../../arena";
import { Skill } from "..";
import { log } from "../../../logger";
import { time } from "console";

export class Counter extends Effect {
  private counterType: SkillClassType;
  private counterEffectType: effectType;
  private counterSkillType: SkillClassType;
  private harmfulSkillsOnly: boolean;
  private isDefensive: boolean;
  private applyPerTrigger: boolean;

  constructor(data: any, caster: number) {
    super(data, caster);
    this.tick = 0;
    this.isDefensive = data.isDefensive || false;
    this.counterType = data.counterType || false;
    this.counterEffectType = data.counterEffectType || false;
    this.applyPerTrigger = data.applyPerTrigger || true;
  }

  public functionality(target: Character, origin: Skill) {
    let isTriggered: {
      activated: boolean;
      indexes: Array<number>;
      times: number;
    };

    if (this.isDefensive) {
      if (target.getDebuffs().ignoreBenefitialEffects) return;
      isTriggered = this.DefensiveCounter(target, origin);
    } else {
      if (target.getBuffs().ignoreHarmfulEffects.status) return;
      isTriggered = this.OffensiveCounter(target, origin);
    }

    if (isTriggered.activated) {
      const casterIndex = this.arenaReference.findCharacterById(this.caster)
        .index;
      const casterChar = this.arenaReference.findCharacterById(this.caster)
        .char;
      const targetsIndex = isTriggered.indexes;
      this.applyLinkedEffects(
        origin,
        casterIndex,
        targetsIndex,
        isTriggered.times
      );
    }
  }

  private OffensiveCounter(target: Character, origin: Skill) {
    const temp = this.arenaReference.getTempSkills();
    const indexes: Array<number> = [];

    let hasCountered = { activated: false, indexes, times: 0 };

    for (let i = temp.length - 1; i >= 0; i--) {
      const cordinates = temp[i];
      const caster = this.arenaReference.getCharactersByIndex([
        cordinates.caster,
      ])[0];
      const skill = caster.getRealSkillByIndex(cordinates.skill);
      if (this.value === 0) return hasCountered;
      if (skill.uncounterable) continue;

      if (
        (this.counterType === SkillClassType.Any ||
          skill.class == this.counterType ||
          (this.counterType === SkillClassType.NonStrategic &&
            skill.class !== SkillClassType.Strategic)) &&
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
        hasCountered.times++;
        hasCountered.indexes.push(cordinates.caster);
        this.value--;
      }
    }

    return hasCountered;
  }

  private DefensiveCounter(target: Character, origin: Skill) {
    const temp = this.arenaReference.getTempSkills().reverse();
    const indexes: Array<number> = [];

    let hasCountered = { activated: false, indexes, times: 0 };

    for (let i = temp.length - 1; i >= 0; i--) {
      if (this.value === 0) return hasCountered;
      const cordinates = temp[i];
      const char = this.arenaReference.getCharactersByIndex([
        cordinates.caster,
      ])[0];
      const skill = char.getRealSkillByIndex(cordinates.skill);
      if (skill.uncounterable) continue;

      if (
        this.counterType === SkillClassType.Any ||
        skill.class == this.counterType ||
        (this.counterType === SkillClassType.NonStrategic &&
          skill.class !== SkillClassType.Strategic)
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
            hasCountered.times++;
            hasCountered.indexes.push(cordinates.caster);
            break;
          }
        }
      }
    }

    return hasCountered;
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
    let extra = "";
    switch (this.counterType) {
      case SkillClassType.Reiatsu:
        {
          extra = "reiatsu ";
        }
        break;
      case SkillClassType.Physical:
        {
          extra = "physical ";
        }
        break;
      case SkillClassType.Strategic:
        {
          extra = "strategic ";
        }
        break;
      case SkillClassType.Affliction:
        {
          extra = "affliction ";
        }
        break;
      case SkillClassType.NonStrategic: {
        extra = "non-strategic ";
      }
    }
    if (this.value === 1 && this.DefensiveCounter) {
      this.message = `The first new ${extra}skill used on this character will be countered`;
      return;
    } else if (this.DefensiveCounter) {
      this.message =
        "New " + extra + "skills used on this character will be countered";
      return;
    } else {
      if (this.value === 1) {
        this.message = `The first new ${extra}skill used by this character will be countered`;
      } else {
        this.message = `New ${extra}skills used by this character will be countered`;
      }
    }
  }
}
