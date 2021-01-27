import { Character } from "../character";
import {
  targetType,
  activationType,
  SkillClassType,
  triggerClauseType,
  ControlType,
} from "../../enums";
import { effectFactory } from "../effect";
import { targetSetter } from "./targetValidationFactory";
import { Effect } from "../effect/base";
import { Arena } from "../../arena";
import { SkillMods } from "./mods";
import { log } from "../../../logger";

export class Skill {
  public banner: string;
  public cost: Array<number>;
  public disabled?: boolean;
  public skillpic: string;
  public name: string;
  private description: string;
  public class: SkillClassType;
  public persistence: ControlType;
  public inactiveEffects: Array<Effect>;
  private cooldown: number;
  private baseCooldown: number;
  private harmful: boolean;
  public mods: SkillMods;
  private targets: Array<number>;
  public uncounterable: boolean;
  private targetMode: targetType;
  public requiresSkillOnTarget: Array<string>;
  public effects: Array<Effect>;
  private casterReference: Character;
  private targetChoices: { [x: string]: Array<number> };
  private id: number;
  public caster: number;
  private turnCost: Array<number>;
  public ignoresInvulnerability: boolean;
  private arenaReference: Arena;

  constructor(
    data: any,
    caster: number,
    world: Arena,
    casterReference: Character
  ) {
    this.caster = data.caster;
    this.banner = data.banner;
    this.cooldown = 0 || data.startCooldown;
    this.skillpic = data.skillpic;
    this.persistence = data.persistence;
    this.name = data.name;
    this.uncounterable = data.uncounterable || false;
    this.disabled = data.disabled || false;
    this.description = data.description;
    this.cost = data.cost;
    this.class = data.class;
    this.baseCooldown = data.baseCooldown;
    this.targetMode = data.targetMode;
    this.targetChoices = data.targetChoices || {};
    this.effects = [];
    this.inactiveEffects = [];
    this.mods = new SkillMods(data.mods || {});
    this.id = data.id;
    this.harmful = data.harmful || false;
    this.arenaReference = world;
    this.casterReference = casterReference;
    this.turnCost = this.cost.slice();
    this.ignoresInvulnerability = data.ignoresInvulnerability || false;

    try {
      for (const e of data.effects) {
        const built = effectFactory(e, caster);
        built.setArenaReference(this.arenaReference);
        if (built.triggerRate > 0) this.effects.push(built);
        else {
          this.inactiveEffects.push(built);
        }
      }
      // This here for when the skill gets copied and all inactive effects have already been parsed
      // and need to be rebuilt (the first loop won't include them)
      if (data.inactiveEffects) {
        for (const e of data.inactiveEffects) {
          const built = effectFactory(e, caster);
          built.setArenaReference(this.arenaReference);
          this.inactiveEffects.push(built);
        }
      }

      if (data.requiresSkillOnTarget) {
        this.requiresSkillOnTarget = data.requiresSkillOnTarget.map(
          (e: any) => {
            return `${e}-${caster}`;
          }
        );
      } else {
        this.requiresSkillOnTarget = [];
      }
    } catch (e) {
      log.error(e);
      this.inactiveEffects = [];
      this.requiresSkillOnTarget = [];
    }
  }

  public isDisabled(): boolean {
    return this.disabled;
  }

  public validateCost(energyPool: Array<number>) {
    try {
      const totalPool = energyPool[4];
      let totalCost = this.turnCost.reduce((ca, cv) => ca + cv);

      for (let i = 0; i <= 4; i++) {
        if (this.turnCost[i] > energyPool[i]) {
          this.disabled = true;
          return;
        }
      }
      if (totalCost > totalPool) {
        this.disabled = true;
        return;
      }
    } catch (e) {
      log.error(e);
    }
  }

  public enable() {
    this.disabled = false;
  }

  public disable() {
    this.disabled = true;
  }

  public resetCooldown() {
    this.cooldown = 0;
  }

  public lowerCooldown(extra: number) {
    if (this.cooldown > 0) this.cooldown -= 1 + extra;
  }

  public startCooldown(extra: number) {
    this.cooldown = Math.max(1, this.baseCooldown + (1 + extra));
  }

  public getValidatedTargets(choice: number): Array<number> {
    let t: Array<number> = [];
    const targetMode = this.getTargetMod() || this.targetMode;

    try {
      switch (targetMode) {
        case targetType.Any: {
          t.push(choice);
          return t;
        }

        case targetType.Self: {
          t.push(choice);
          return t;
        }

        case targetType.OneEnemy: {
          t.push(choice);
          return t;
        }

        case targetType.OneAlly: {
          t.push(choice);
          return t;
        }

        case targetType.AllEnemies: {
          t.push(choice);
          for (const opt of this.targetChoices.choice) {
            if (opt !== choice) {
              t.push(opt);
            }
          }
          return t;
        }

        case targetType.AllAllies: {
          t.push(choice);
          for (const opt of this.targetChoices.choice) {
            if (opt !== choice) {
              t.push(opt);
            }
          }
          return t;
        }

        case targetType.OneEnemyAndAllAllies: {
          t.push(choice);
          t = t.concat(this.targetChoices.auto);
          return t;
        }

        case targetType.OneEnemyAndSelf: {
          t.push(choice);
          t = t.concat(this.targetChoices.auto);
          return t;
        }

        case targetType.OneAllyAndSelf: {
          t.push(choice);
          t = t.concat(this.targetChoices.auto);
          return t;
        }

        case targetType.AllEnemiesAndSelf: {
          t.push(choice);
          for (const opt of this.targetChoices.choice) {
            if (opt !== choice) {
              t.push(opt);
            }
          }
          t.concat(this.targetChoices.auto);
          return t;
        }

        case targetType.OneAllyOrSelf: {
          t.push(choice);
          return t;
        }

        case targetType.OneAllyOrSelfAndSelf: {
          t.push(choice);
          t = t.concat(this.targetChoices.auto);
          return t;
        }
      }
    } catch (e) {
      log.error(e);
    }
  }

  public validateCoolDown() {
    if (this.cooldown > 0) {
      this.disabled = true;
      return;
    }
  }

  public setTargetChoices(
    characters: Array<Character>,
    playerId: number,
    self?: number
  ) {
    const targetMode = this.getTargetMod() || this.targetMode;
    this.targetChoices = targetSetter(
      this,
      targetMode,
      characters,
      playerId,
      self
    );
  }

  public getTargetChoices(): { [x: string]: Array<number> } {
    return this.targetChoices;
  }

  public setTargets(targets: Array<number>) {
    this.targets = targets;
  }

  public removeCharFromTargets(char: Character) {
    for (let i = this.targets.length - 1; i >= 0; i--) {
      const targeted = this.arenaReference.getCharactersByIndex([
        this.targets[i],
      ])[0];

      if (targeted.getId() === char.getId()) {
        this.targets.splice(i, 1);
        break;
      }
    }
  }

  public getTargets(): Array<number> {
    return this.targets;
  }

  public executeEffects() {
    //log.info(`[GAME] Execute effects of ${this.casterReference.name}`);

    for (const effect of this.effects) {
      effect.tick++;
      //log.info(`[${this.casterReference.name}]`, this.casterReference.getDebuffs().stun)
      if (this.casterReference.isStunned(this)) {
        if (this.persistence === ControlType.Action) continue;
        else if (this.persistence === ControlType.Control)
          effect.terminate = true;
      }

      effect.shouldApply();
      effect.execute(this);
      if (!effect.terminate) effect.generateToolTip();
    }
  }

  public executeInitEffects() {
    //log.info("[GAME] Execute NEW effects")
    for (const effect of this.effects) {
      effect.tick++;
      effect.extendDuration(this.mods.increaseDuration);
      if (!effect.getTargets().length) effect.setTargets(this.targets);

      if (this.casterReference.isStunned(this)) {
        if (this.persistence === ControlType.Action) continue;
        else if (this.persistence === ControlType.Control)
          effect.terminate = true;
      }
      effect.shouldApply();
      effect.execute(this);
      effect.generateToolTip();
    }
  }

  public getCost(): Array<number> {
    return this.turnCost;
  }

  public getSkillEffectsActivation(): { [x: string]: number } {
    let checker: { [x: string]: number } = {};

    for (const effect of this.effects) {
      checker[effect.getActivationType()] = effect.getActivationType();
    }

    return checker;
  }

  public tickEffectsDuration(world: Arena, origin: Skill) {
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const effect = this.effects[i];
      if (
        (this.casterReference.isStunned(this) &&
          this.persistence === ControlType.Control) ||
        (this.casterReference.isKnockedOut() &&
          (this.persistence === ControlType.Control ||
            this.persistence === ControlType.Action))
      )
        effect.terminate = true;

      effect.progressTurn();
      if (effect.terminate) {
        const e = this.effects.splice(i, 1)[0];

        if (!e.isVisible()) {
          const chars = world.getCharactersByIndex(e.getTargets());

          for (const char of chars) {
            char.addNotification({
              id: origin.getId(),
              msg: "An effect has ended",
              skillName: origin.name,
              skillpic: origin.skillpic,
            });
          }
        }
      }
    }

    if (this.effects.length === 0) return true;
    return false;
  }

  public areTargetsValidated() {
    //log.info(`xxx [${this.name}] - targets status`)
    for (let i = this.targets.length - 1; i >= 0; i--) {
      const c = this.arenaReference.getCharactersByIndex([this.targets[i]])[0];
      //log.info(`Validating: [${c.name}] - ${c.isInvulnerable(this)}`)
      if (
        c.isKnockedOut() ||
        (c.isInvulnerable(this) && this.persistence === ControlType.Control)
      ) {
        this.targets.splice(i, 1);
      }
    }

    if (this.targets.length === 0) return false;
    return true;
  }

  public isCancelled() {
    /*log.info(
      `[${
        this.casterReference.name
      }] - stunned: ${this.casterReference.isStunned(this)}`
    );**/
    if (
      this.persistence === ControlType.Control &&
      this.casterReference.isStunned(this)
    )
      return true;
    return false;
  }

  public setTargetMod(target: targetType) {
    this.mods.setTargetMod(target);
  }

  public getTargetMod() {
    return this.mods.getTargetMod();
  }

  public clearMods() {
    this.mods.clearMods();
  }

  public getId(): number {
    return this.id;
  }

  public isHarmful(): boolean {
    return this.harmful;
  }

  public getPublicData() {
    const publicData = { ...this };
    delete publicData.arenaReference;
    delete publicData.casterReference;
    delete publicData.effects;
    delete publicData.inactiveEffects;
    delete publicData.mods;

    const publicEffects = [];
    for (const e of this.effects) {
      publicEffects.push(e.getPublicData());
    }
    return { ...publicData, effects: publicEffects };
  }

  public getCopyData() {
    const publicSkill = { ...this };
    delete publicSkill.casterReference;
    delete publicSkill.arenaReference;
    delete publicSkill.effects;
    delete publicSkill.inactiveEffects;

    const copyEffects = [];
    for (const effect of this.effects) {
      copyEffects.push(effect.getPublicData());
    }

    const copyInactiveEffects = [];
    for (const effect of this.inactiveEffects) {
      copyInactiveEffects.push(effect.getPublicData());
    }

    return {
      ...publicSkill,
      effects: copyEffects,
      inactiveEffects: copyInactiveEffects,
    };
  }

  public setTurnCost() {
    const t = this.mods.costReplacement || this.cost;
    for (const i in t) {
      this.turnCost[i] = Math.max(t[i] + this.mods.costChange[i], 0);
    }
  }
}
