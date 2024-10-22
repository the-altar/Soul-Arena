import { Character } from "../character";
import {
  targetType,
  activationType,
  SkillClassType,
  triggerClauseType,
  ControlType,
  effectType,
} from "../../enums";
import { effectFactory } from "../effect";
import { targetSetter } from "./targetValidationFactory";
import { Effect } from "../effect/base";
import { Arena } from "../../arena";
import { SkillMods } from "./mods";
import { log } from "../../../logger";
import { isHarmful } from "../effect/z.helpers";

export class Skill {
  public banner: string;
  public cost: Array<number>;
  public disabled?: boolean;
  public skillpic: string;
  public name: string;
  public description: string;
  public class: SkillClassType;
  public persistence: ControlType;
  public inactiveEffects: Array<Effect>;
  public cooldown: number;
  public baseCooldown: number;
  public harmful: boolean;
  public mods: SkillMods;
  public targets: Array<number>;
  public uncounterable: boolean;
  public targetMode: targetType;
  public requiresSkillOnTarget: Array<string>;
  public cannotBeUsedOnTargetOf: Array<string>;
  public effects: Array<Effect>;
  public casterReference: Character;
  public targetChoices: { [x: string]: Array<number> };
  public interrupted: boolean;
  public id: number;
  public caster: number;
  public turnCost: Array<number>;
  public ignoresInvulnerability: boolean;
  public arenaReference: Arena;

  constructor(
    data: any,
    caster: number,
    world: Arena,
    casterReference: Character
  ) {
    this.caster = caster;
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
    this.interrupted = false;
    this.id = data.id;
    this.arenaReference = world;
    this.casterReference = casterReference;
    this.turnCost = this.cost.slice();
    this.ignoresInvulnerability = data.ignoresInvulnerability || false;

    try {
      //log.info(`xx BUILD ${this.name} `);
      for (const e of data.effects) {
        //log.info(`xxx EFFECT ${effectType[e.type]}`);
        const built = effectFactory(e, caster);
        built.setArenaReference(this.arenaReference);

        this.harmful = this.harmful || isHarmful(built.getType());
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

      if (data.cannotBeUsedOnTargetOf) {
        this.cannotBeUsedOnTargetOf = data.cannotBeUsedOnTargetOf.map(
          (e: any) => {
            return `${e}-${caster}`;
          }
        );
      } else {
        this.cannotBeUsedOnTargetOf = [];
      }
    } catch (e) {
      log.error(e);
      this.inactiveEffects = [];
      this.requiresSkillOnTarget = [];
      this.cannotBeUsedOnTargetOf = [];
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
    const targetMode: targetType =
      this.getTargetMod() ||
      this.mods.getAttrValue("targetMode") ||
      this.targetMode;

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
        case targetType.AllAny: {
          for (const opt of this.targetChoices.choice) {
            t.push(opt);
          }
          return t;
        }
        case targetType.AllAnyAndSelf: {
          for (const opt of this.targetChoices.choice) {
            t.push(opt);
          }
          t = t.concat(this.targetChoices.auto);
          return t;
        }
        case targetType.AllAnyExceptSelf: {
          for (const opt of this.targetChoices.choice) {
            t.push(opt);
          }
          return t;
        }
        case targetType.OneRandomEnemy_and_Self: {
          const index = this.targetChoices.choice[
            Math.floor(Math.random() * this.targetChoices.choice.length)
          ];
          t.concat(this.targetChoices.auto);
          t.push(index);
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
    //log.info(this.getTargetMod(), this.mods.meta.targetMode, this.targetMode);
    const targetMode: targetType =
      this.getTargetMod() || this.mods.meta.targetMode || this.targetMode;
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
      //log.info(`[${this.casterReference.name}]`, this.casterReference.getDebuffs().stun)
      if (this.casterReference.isStunned(this)) {
        if (this.persistence === ControlType.Action) {
          effect.tick++;
          continue;
        } else if (this.persistence === ControlType.Control)
          effect.terminate = true;
      }

      effect.shouldApply();
      //log.info("effect apply status: ", effect.activate, effect.tick);
      effect.execute(this);
      if (!effect.terminate) effect.generateToolTip();
      effect.tick++;
    }
  }

  public executeInitEffects() {
    //log.info("[GAME] Execute NEW effects")
    for (const effect of this.effects) {
      effect.extendDuration(this.mods.increaseDuration);
      if (!effect.getTargets().length) effect.setTargets(this.targets);

      if (this.casterReference.isStunned(this)) {
        if (this.persistence === ControlType.Action) {
          effect.tick++;
          continue;
        } else if (this.persistence === ControlType.Control)
          effect.terminate = true;
      }
      effect.shouldApply();
      effect.execute(this);
      effect.generateToolTip();
      effect.tick++;
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
        const chars = world.getCharactersByIndex(e.getTargets());
        for (const char of chars) {
          if (!e.isVisible()) {
            char.addNotification({
              id: origin.getId(),
              msg: "An effect has ended",
              skillName: origin.name,
              skillpic: origin.skillpic,
            });
          }
          char.effectStack.decrease(e.gameId);
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
    const skill = this.mods.replacedBy ? this.mods.replacedBy : this;
    const publicData = { ...skill };
    delete publicData.arenaReference;
    delete publicData.casterReference;
    delete publicData.effects;
    delete publicData.inactiveEffects;
    delete publicData.mods;

    const publicEffects = [];
    for (const e of skill.effects) {
      publicEffects.push(e.getPublicData());
    }
    return { ...publicData, effects: publicEffects };
  }

  public getCopyData() {
    const skill = this.mods.replacedBy ? this.mods.replacedBy : this;

    let publicSkill = { ...skill };
    delete publicSkill.casterReference;
    delete publicSkill.arenaReference;
    delete publicSkill.effects;
    delete publicSkill.inactiveEffects;

    const copyEffects = [];
    for (const effect of skill.effects) {
      copyEffects.push(effect.getPublicData());
    }

    const copyInactiveEffects = [];
    for (const effect of skill.inactiveEffects) {
      copyInactiveEffects.push(effect.getPublicData());
    }

    return {
      ...publicSkill,
      effects: copyEffects,
      inactiveEffects: copyInactiveEffects,
    };
  }

  public setTurnCost() {
    const t: Array<number> =
      this.mods.costReplacement || this.mods.getAttrValue("cost") || this.cost;
    for (const i in t) {
      this.turnCost[i] = Math.max(t[i] + this.mods.costChange[i], 0);
    }
  }
}
