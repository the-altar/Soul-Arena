import { Character } from "../character";
import {
  targetType,
  activationType,
  Types,
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
  public effects: Array<Effect>;
  private targetChoices: { [x: string]: Array<number> };
  private id: number;
  public caster: number;
  public turnCost: Array<number>;
  private arenaReference: Arena;

  constructor(data: any, caster: number, world: Arena) {
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
    this.turnCost = [data.turnCost || data.cost];
    data.effects = data.effects.sort((a: any, b: any) => {
      return (b.priority || 0) - (a.priority || 0);
    });
    for (const e of data.effects) {
      const built = effectFactory(e, caster);
      built.setArenaReference(this.arenaReference);
      if (built.triggerRate > 0) this.effects.push(built);
      else {
        this.inactiveEffects.push(built);
      }
    }

    if (data.inactiveEffects) {
      for (const e of data.inactiveEffects) {
        const built = effectFactory(e, caster);
        built.setArenaReference(this.arenaReference);
        this.inactiveEffects.push(built);
      }
    }
  }

  public isDisabled(): boolean {
    return this.disabled;
  }

  public validateCost(energyPool: Array<number>) {
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
    for (const effect of this.effects) {
      effect.tick++;
      effect.shouldApply();
      effect.execute(this);
      effect.generateToolTip();
    }
  }

  public executeInitEffects() {
    for (const effect of this.effects) {
      effect.tick++;
      effect.shouldApply();
      effect.extendDuration(this.mods.increaseDuration);
      effect.setTargets(this.targets);
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

  public areTargetsValidated(world: Arena) {
    for (let i = this.targets.length - 1; i >= 0; i--) {
      const c = world.getCharactersByIndex([this.targets[i]])[0];
      if (c.isKnockedOut()) {
        this.targets.splice(i, 1);
      }
    }

    if (this.targets.length === 0) return false;
    return true;
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
    for (const i in this.cost) {
      this.turnCost[i] = Math.max(this.cost[i] + this.mods.costChange[i], 0);
    }
  }
}
