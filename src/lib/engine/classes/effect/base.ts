import { Character } from "../character";
import {
  effectType,
  effectTargetBehavior,
  activationType,
  PlayerPhase,
  triggerClauseType,
} from "../../enums";
import { Arena } from "../../arena";
import { Skill } from "../skill";
import { isHarmful, isFriendly } from "./z.helpers";

export class Effect {
  protected arenaReference: Arena;
  public value: number;
  protected altValue: number | null;
  public tick: number;
  protected duration: number;
  protected delay?: number;
  public mods: {
    increment: {
      value: number;
      isMultiplier: boolean;
    };
  };
  protected linked?: boolean;
  protected message: string;
  public triggerRate: number;
  public altTriggerRate: number;
  protected disabled?: boolean;
  protected triggered: boolean;
  protected isInvisible: boolean;
  protected behavior?: effectTargetBehavior;
  protected activationType: activationType;
  protected triggerClause: triggerClauseType;
  protected compulsory: boolean;
  protected type: effectType;
  protected caster: number;
  protected targets: Array<number>;
  public terminate: boolean;
  protected terminateSkill: boolean;
  public infinite: boolean;
  public activate: boolean;
  public id: number;
  public gameId: number;
  public stackLimit: number;

  constructor(data: any, caster: number) {
    this.value = data.value;
    this.tick = 1;
    this.message = data.message || null;
    this.duration = data.duration || 1;
    this.infinite = data.infinite || false;
    this.delay = data.delay || 0;
    this.disabled = data.disabled || false;
    this.linked = data.linked || false;
    this.isInvisible = data.isInvisible || false;
    this.type = data.type;
    this.caster = caster;
    this.triggered = false;
    this.triggerRate = data.triggerRate || 100;
    this.compulsory = data.compulsory || false;
    this.triggerClause = data.triggerClause || triggerClauseType.None;
    this.behavior = data.behavior || effectTargetBehavior.Default;
    this.targets = [];
    this.activate = data.activate || true;
    this.activationType = data.activationType || activationType.Immediate;
    this.altValue = data.altValue || null;
    this.linked = data.linked || null;
    this.id = data.id;
    this.stackLimit = data.stackLimit || 0;
    this.gameId =
      data.gameId || Math.floor(Math.random() * (0 - 99999) + 99999);
    this.message = data.message;
    this.mods = data.mods || {
      increment: {
        value: data.increment || 0,
        isMultiplier: data.isMultiplier || false,
      },
    };
  }

  public setArenaReference(world: Arena) {
    this.arenaReference = world;
  }
  public functionality(char: Character, origin?: Skill) {
    console.log("This does nothing!");
    return;
  }

  public setAltValue(value: number) {
    this.altValue = value;
  }

  public setIncrement(value: number) {
    this.mods.increment.value = value;
  }

  public getAltValue(): number {
    return this.altValue;
  }

  public setTargets(targets: Array<number>) {
    this.targets = targets;
  }

  public extendDuration(val: number) {
    this.duration += val;
  }

  public shouldApply() {
    const triggerRate = Math.floor(Math.random() * 101);
    if (
      triggerRate <= this.triggerRate &&
      this.delay <= 0 &&
      (this.tick % 2 !== PlayerPhase.MyTurn || this.compulsory)
    )
      this.activate = true;
    else this.activate = false;
  }

  public getActivationType(): activationType {
    return this.activationType;
  }

  public progressTurn() {
    this.delay--;
    if (this.delay <= 0) this.duration--;
    /*  An even tick means it's your opponent's turn, odd means its yours.*/
    /*  The default behavior is for your skills to activate on odd ticks*/
    if (this.tick % 2 === PlayerPhase.MyTurn) {
      this.activate = false;
    } else this.activate = true;

    if (this.duration <= 0 && !this.infinite) this.terminate = true;
    else if (this.targets.length === 0) this.terminate = true;

    if (this.terminate) this.effectConclusion();
  }

  public execute(origin: Skill) {
    const t: Array<number> = [];

    switch (this.behavior) {
      case effectTargetBehavior.Default:
        {
          for (const i of this.targets) {
            const char = this.arenaReference.getCharactersByIndex([i])[0];
            this.activateOnTarget(char, origin, t, i);
          }
        }
        break;

      case effectTargetBehavior.OnlyOne:
        {
          const char = this.arenaReference.getCharactersByIndex([
            this.targets[0],
          ])[0];
          this.activateOnTarget(char, origin, t, this.targets[0]);
        }
        break;

      case effectTargetBehavior.AllOthers:
        {
          const slice = this.targets.slice(1, this.targets.length);

          for (const i of slice) {
            const char = this.arenaReference.getCharactersByIndex([i])[0];
            this.activateOnTarget(char, origin, t, i);
          }
        }
        break;

      case effectTargetBehavior.IfAlly:
        {
          const { char } = this.arenaReference.findCharacterById(this.caster);
          const allies = char.getAllies();
          for (const i of this.targets) {
            if (allies.includes(i)) {
              const ally = this.arenaReference.getCharactersByIndex([i])[0];
              this.activateOnTarget(ally, origin, t, i);
            }
          }
        }
        break;

      case effectTargetBehavior.IfEnemy:
        {
          const { char } = this.arenaReference.findCharacterById(this.caster);
          const enemies = char.getEnemies();

          for (const i of enemies) {
            if (this.targets.includes(i)) {
              const enemy = this.arenaReference.getCharactersByIndex([i])[0];
              this.activateOnTarget(enemy, origin, t, i);
            }
          }
        }
        break;

      case effectTargetBehavior.ifSelf:
        {
          const { char, index } = this.arenaReference.findCharacterById(
            this.caster
          );
          this.activateOnTarget(char, origin, t, index);
        }
        break;

      case effectTargetBehavior.First:
        {
          const char = this.arenaReference.getCharactersByIndex([
            this.targets[0],
          ])[0];
          this.activateOnTarget(char, origin, t, this.targets[0]);
        }
        break;

      case effectTargetBehavior.Second:
        {
          if (this.targets.length < 2) break;
          const char = this.arenaReference.getCharactersByIndex([
            this.targets[1],
          ])[0];
          this.activateOnTarget(char, origin, t, this.targets[1]);
        }
        break;

      case effectTargetBehavior.Third:
        {
          if (this.targets.length < 3) break;
          const char = this.arenaReference.getCharactersByIndex([
            this.targets[2],
          ])[0];
          this.activateOnTarget(char, origin, t, this.targets[2]);
        }
        break;
    }

    if (this.mods.increment.isMultiplier && this.mods.increment.value)
      this.value *= this.mods.increment.value;
    else if (this.mods.increment.value) this.value += this.mods.increment.value;

    this.setTargets(t);
  }

  public getType(): effectType {
    return this.type;
  }

  public generateToolTip(triggered?: number) {}

  private activateOnTarget(
    char: Character,
    origin: Skill,
    targetList: Array<number>,
    charIndex: number
  ) {
    if ((!this.triggered || this.activate) && !char.addEffectStack(this)) {
      return;
    }
    targetList.push(charIndex);
    if (char.isInvulnerable(origin)) return;
    if (char.isKnockedOut()) return;
    this.activateTrigger(char, origin);
    if (!this.activate) return;
    this.functionality(char, origin);
  }

  protected effectConclusion() {}

  public getTargets() {
    return this.targets;
  }

  public isVisible(): boolean {
    if (this.isInvisible) return false;
    return true;
  }

  public activateTrigger(char: Character, origin?: Skill) {
    if (this.triggered) return;
    this.triggered = true;

    this.duration =
      this.duration +
      (char.getDebuffs().increaseSkillDuration[origin.getId()] || 0);
  }

  public getPublicData() {
    const publicData = { ...this };
    delete publicData.arenaReference;

    return { ...publicData };
  }

  public apply(char: Character, origin: Skill) {}
}
