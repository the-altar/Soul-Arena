import { Character } from "../character";
import {
  effectType,
  effectTargetBehavior,
  activationType,
  PlayerPhase,
  triggerClauseType,
  ControlType,
  SkillClassType,
} from "../../enums";
import { Arena } from "../../arena";
import { Skill } from "../skill";
import { isHarmful, isFriendly } from "./z.helpers";
import { effectFactory } from "./index";
import { log } from "../../../logger";

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
  protected message: string;
  public triggerRate: number;
  public altTriggerRate: number;
  protected disabled?: boolean;
  protected increaseDurationByAlliesAlive: boolean;
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
  public ignoresInvulnerability: boolean;
  public triggerLinkedEffects: Array<{
    id: Number;
    self: boolean;
    victim: boolean;
    target: boolean;
    condition: triggerClauseType;
  }>;
  constructor(data: any, caster: number) {
    this.value = data.value;
    this.tick = 0;
    this.message = data.message || null;
    this.duration = data.duration || 1;
    this.increaseDurationByAlliesAlive =
      data.increaseDurationByAlliesAlive || null;
    this.infinite = data.infinite || false;
    this.delay = data.delay || 0;
    this.disabled = data.disabled || false;
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
    this.id = data.id;
    this.stackLimit = data.stackLimit || 0;
    this.gameId =
      data.gameId || Math.floor(Math.random() * (0 - 99999) + 99999);
    this.message = data.message;
    this.triggerLinkedEffects = data.triggerLinkedEffects || [];
    this.mods = data.mods || {
      increment: {
        value: data.increment || 0,
        isMultiplier: data.isMultiplier || false,
      },
    };
    this.ignoresInvulnerability = data.ignoresInvulnerability || false;
    this.arenaReference = data.arenaReference || null;
  }

  public setArenaReference(world: Arena) {
    this.arenaReference = world;
  }

  public functionality(char: Character, origin?: Skill) {
    if (!this.triggerLinkedEffects.length) return;

    for (const linked of this.triggerLinkedEffects) {
      switch (linked.condition) {
        case triggerClauseType.IfTargeted:
          {
            for (const temp of this.arenaReference.tempQueue) {
              if (temp.targets.includes(char.myIndex)) {
                //log.info(`Apply linked effect on ${temp.caster}`);
                this.applyLinkedEffects(
                  origin,
                  this.caster,
                  [temp.caster],
                  [char.myIndex],
                  1
                );
              }
            }
          }
          break;

        case triggerClauseType.IfTargetedByHarmfulSkill:
          {
            for (const temp of this.arenaReference.tempQueue) {
              const skill = this.arenaReference.characters[temp.caster].skills[
                temp.skill
              ];

              if (temp.targets.includes(char.myIndex) && skill.isHarmful()) {
                log.info(
                  `xxx APPLY ${
                    skill.name
                  } harmful status: ${skill.isHarmful()} on ${char.name}`
                );
                this.applyLinkedEffects(
                  origin,
                  this.caster,
                  [temp.caster],
                  [char.myIndex],
                  1
                );
              }
            }
          }
          break;
        case triggerClauseType.UsesANewSkill:
          {
            for (const temp of this.arenaReference.tempQueue) {
              if (temp.caster === char.myIndex) {
                this.applyLinkedEffects(
                  origin,
                  this.caster,
                  [temp.caster],
                  [char.myIndex],
                  1
                );
                break;
              }
            }
          }
          break;

        case triggerClauseType.UsesANewNonStrategicSkill:
          {
            for (const temp of this.arenaReference.tempQueue) {
              const skill = this.arenaReference.characters[temp.caster].skills[
                temp.skill
              ];
              if (
                temp.caster === char.myIndex &&
                skill.class !== SkillClassType.Strategic
              ) {
                this.applyLinkedEffects(
                  origin,
                  this.caster,
                  [temp.caster],
                  [char.myIndex],
                  1
                );
                break;
              }
            }
          }
          break;
      }
    }
  }

  public setAltValue(value: number) {
    this.altValue = value;
  }

  public extendDuration(val: number) {
    this.duration += val;
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

  public shouldApply() {
    const triggerRate = Math.floor(Math.random() * 101);
    if (
      triggerRate <= this.triggerRate &&
      this.delay <= 0 &&
      (this.tick % 2 === PlayerPhase.MyTurn || this.compulsory)
    )
      this.activate = true;
    else this.activate = false;
  }

  public getActivationType(): activationType {
    return this.activationType;
  }

  public progressTurn() {
    if (this.delay <= 0) this.duration--;
    else {
      this.delay--;
    }

    if (this.duration <= 0 && !this.infinite) this.terminate = true;
    else if (this.targets.length === 0) this.terminate = true;

    if (this.terminate) this.effectConclusion();
  }

  public execute(origin: Skill) {
    const t: Array<number> = [];
    try {
      //log.info("xxxxxx ", this.targets)
      if (!this.triggered) {
      }
      switch (this.behavior) {
        case effectTargetBehavior.Default:
          {
            for (const i of this.targets) {
              //log.info("X BEFORE > ", this.targets)
              const char = this.arenaReference.getCharactersByIndex([i])[0];
              //log.info(`xxxxxxxxxx referenced: ${char.name} at index: ${i}`)
              this.activateOnTarget(char, origin, t, i);
              //log.info("X AFTER > ", this.targets)
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

        case effectTargetBehavior.IfAllyIncludingSelf:
          {
            const { char } = this.arenaReference.findCharacterById(this.caster);
            this.activateOnTarget(char, origin, t, char.myIndex);
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
            //log.info(this.targets)
            let index = 1;
            if (this.targets.length < 2 && !this.triggered) break;
            if (this.triggered) index = 0;
            const char = this.arenaReference.getCharactersByIndex([
              this.targets[index],
            ])[0];
            this.activateOnTarget(char, origin, t, this.targets[index]);
          }
          break;

        case effectTargetBehavior.Third:
          {
            let index = 2;
            if (this.targets.length < 3 && !this.triggered) break;
            if (this.triggered) index = 0;
            const char = this.arenaReference.getCharactersByIndex([
              this.targets[index],
            ])[0];
            this.activateOnTarget(char, origin, t, this.targets[index]);
          }
          break;
      }

      if (this.mods.increment.isMultiplier && this.mods.increment.value)
        this.value *= this.mods.increment.value;
      else if (this.mods.increment.value)
        this.value += this.mods.increment.value;

      this.setTargets(t);
    } catch (e) {
      log.error(e);
      this.setTargets(t);
    }
  }

  public getType(): effectType {
    return this.type;
  }

  public generateToolTip(triggered?: number) {
    this.message = this.message || null;
  }

  private activateOnTarget(
    char: Character,
    origin: Skill,
    targetList: Array<number>,
    charIndex: number
  ) {
    char.skillStack.add(origin.getId(), this.caster);
    if ((!this.triggered || this.activate) && !char.addEffectStack(this)) {
      return;
    }

    if (
      origin.persistence === ControlType.Control &&
      !this.ignoresInvulnerability &&
      char.isInvulnerable(origin)
    )
      return;
    targetList.push(charIndex);
    if (!this.ignoresInvulnerability && char.isInvulnerable(origin)) return;
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
  // this is only activated once when the effect is applied for the first time
  public activateTrigger(char: Character, origin?: Skill) {
    if (this.triggered) return;
    this.triggered = true;

    if (this.increaseDurationByAlliesAlive) {
      for (const ally of this.arenaReference
        .findCharacterById(this.caster)
        .char.getAllies()) {
        if (!this.arenaReference.characters[ally].isKnockedOut())
          this.duration = this.duration + 2;
      }
    }

    const extendEffect = char.getDebuffs().increaseSkillDuration[
      origin.getId()
    ];
    if (extendEffect && extendEffect.except.includes(this.id) === false) {
      this.duration = this.duration + (extendEffect.value || 0);
    }
  }

  public getPublicData() {
    const publicData = { ...this };
    delete publicData.arenaReference;

    return { ...publicData };
  }

  public apply(char: Character, origin: Skill) {}

  applyLinkedEffects(
    origin: Skill,
    caster: number,
    victims: Array<number>,
    targets: Array<number>,
    times?: number
  ) {
    for (const trigger of this.triggerLinkedEffects) {
      log.info(`xxxx LINKED EFFECT under: `, trigger);
      for (const effect of origin.inactiveEffects) {
        log.info("xxxxxx disabled id ", effect.id);
        if (effect.id !== trigger.id) continue;
        const nEffect = effectFactory(effect, effect.caster);
        log.info(`xxxxx new effect: ${nEffect.id}`);
        if (trigger.self) {
          log.info("xxxxxx trigger under self");
          nEffect.triggerRate = 100;
          nEffect.setTargets([caster]);
        } else if (trigger.victim) {
          log.info("xxxxxx trigger under victim", nEffect);
          nEffect.triggerRate = 100;
          nEffect.setTargets(victims);
        } else if (trigger.target) {
          log.info("xxxxxx trigger under target");
          nEffect.triggerRate = 100;
          nEffect.setTargets(targets);
        }
        nEffect.value *= times || 1;
        origin.effects.push(nEffect);
      }
    }
  }
}
