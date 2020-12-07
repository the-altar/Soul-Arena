import { Effect } from "./base";
import { SkillClassType, effectType, PlayerPhase } from "../../enums";
import { Character } from "../character";
import { Arena } from "../../arena";
import { Skill } from "..";

export class Counter extends Effect {
  private counterType: SkillClassType;
  private counterEffectType: effectType;
  private isDefensive: boolean;

  constructor(data: any, caster: number) {
    super(data, caster);
    this.tick = 0;
    this.isDefensive = data.isDefensive || false;
    this.counterType = data.counterType || false;
    this.counterEffectType = data.counterEffectType || false;
  }

  public functionality(target: Character, origin: Skill, world?: Arena) {
    if (this.isDefensive) this.DefensiveCounter(target, origin, world);
    else this.OffensiveCounter(target, origin, world);
  }

  private OffensiveCounter(target: Character, origin: Skill, world?: Arena) {
    const temp = world.getTempSkills();

    for (let i = temp.length - 1; i >= 0; i--) {
      const cordinates = temp[i];
      const char = world.getCharactersByIndex([cordinates.caster])[0];
      const skill = char.getRealSkillByIndex(cordinates.skill);
      if (this.value === 0) return;
      if (skill.uncounterable) return;

      if (
        (this.counterType === SkillClassType.Any ||
          skill.class == this.counterType) &&
        char.getId() === target.getId()
      ) {
        temp.splice(i, 1);
        char.addNotification({
          msg: "This character has been countered",
          id: origin.getId(),
          skillpic: origin.skillpic,
          skillName: origin.name,
        });
        this.value--;
      }
    }
  }

  private DefensiveCounter(target: Character, origin: Skill, world?: Arena) {
    const temp = world.getTempSkills().reverse();

    for (let i = temp.length - 1; i >= 0; i--) {
      if (this.value === 0) return;
      const cordinates = temp[i];
      const char = world.getCharactersByIndex([cordinates.caster])[0];
      const skill = char.getRealSkillByIndex(cordinates.skill);
      if (skill.uncounterable) continue;

      if (
        this.counterType === SkillClassType.Any ||
        skill.class === this.counterType
      ) {
        for (const t of cordinates.targets) {
          const sufferer = world.getCharactersByIndex([t])[0];
          if (sufferer.getId() === target.getId()) {
            temp[i].cancelled = true;
            char.addNotification({
              msg: "This character has been countered",
              id: origin.getId(),
              skillpic: origin.skillpic,
              skillName: origin.name,
            });
            this.value--;
            break;
          }
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
    this.message = "Skills used on this character will be countered";
  }
}
