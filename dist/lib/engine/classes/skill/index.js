"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = void 0;
const enums_1 = require("../../enums");
const effect_1 = require("../effect");
const targetValidationFactory_1 = require("./targetValidationFactory");
const mods_1 = require("./mods");
const logger_1 = require("../../../logger");
class Skill {
    constructor(data, caster, world, casterReference) {
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
        this.mods = new mods_1.SkillMods(data.mods || {});
        this.id = data.id;
        this.harmful = data.harmful || false;
        this.arenaReference = world;
        this.casterReference = casterReference;
        this.turnCost = this.cost.slice();
        this.ignoresInvulnerability = data.ignoresInvulnerability || false;
        try {
            for (const e of data.effects) {
                const built = effect_1.effectFactory(e, caster);
                built.setArenaReference(this.arenaReference);
                if (built.triggerRate > 0)
                    this.effects.push(built);
                else {
                    this.inactiveEffects.push(built);
                }
            }
            // This here for when the skill gets copied and all inactive effects have already been parsed
            // and need to be rebuilt (the first loop won't include them)
            if (data.inactiveEffects) {
                for (const e of data.inactiveEffects) {
                    const built = effect_1.effectFactory(e, caster);
                    built.setArenaReference(this.arenaReference);
                    this.inactiveEffects.push(built);
                }
            }
            if (data.requiresSkillOnTarget) {
                this.requiresSkillOnTarget = data.requiresSkillOnTarget.map((e) => {
                    return `${e}-${caster}`;
                });
            }
            else {
                this.requiresSkillOnTarget = [];
            }
        }
        catch (e) {
            logger_1.log.error(e);
            this.inactiveEffects = [];
            this.requiresSkillOnTarget = [];
        }
    }
    isDisabled() {
        return this.disabled;
    }
    validateCost(energyPool) {
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
        }
        catch (e) {
            logger_1.log.error(e);
        }
    }
    enable() {
        this.disabled = false;
    }
    disable() {
        this.disabled = true;
    }
    resetCooldown() {
        this.cooldown = 0;
    }
    lowerCooldown(extra) {
        if (this.cooldown > 0)
            this.cooldown -= 1 + extra;
    }
    startCooldown(extra) {
        this.cooldown = Math.max(1, this.baseCooldown + (1 + extra));
    }
    getValidatedTargets(choice) {
        let t = [];
        const targetMode = this.getTargetMod() || this.targetMode;
        try {
            switch (targetMode) {
                case enums_1.targetType.Any: {
                    t.push(choice);
                    return t;
                }
                case enums_1.targetType.Self: {
                    t.push(choice);
                    return t;
                }
                case enums_1.targetType.OneEnemy: {
                    t.push(choice);
                    return t;
                }
                case enums_1.targetType.OneAlly: {
                    t.push(choice);
                    return t;
                }
                case enums_1.targetType.AllEnemies: {
                    t.push(choice);
                    for (const opt of this.targetChoices.choice) {
                        if (opt !== choice) {
                            t.push(opt);
                        }
                    }
                    return t;
                }
                case enums_1.targetType.AllAllies: {
                    t.push(choice);
                    for (const opt of this.targetChoices.choice) {
                        if (opt !== choice) {
                            t.push(opt);
                        }
                    }
                    return t;
                }
                case enums_1.targetType.OneEnemyAndAllAllies: {
                    t.push(choice);
                    t = t.concat(this.targetChoices.auto);
                    return t;
                }
                case enums_1.targetType.OneEnemyAndSelf: {
                    t.push(choice);
                    t = t.concat(this.targetChoices.auto);
                    return t;
                }
                case enums_1.targetType.OneAllyAndSelf: {
                    t.push(choice);
                    t = t.concat(this.targetChoices.auto);
                    return t;
                }
                case enums_1.targetType.AllEnemiesAndSelf: {
                    t.push(choice);
                    for (const opt of this.targetChoices.choice) {
                        if (opt !== choice) {
                            t.push(opt);
                        }
                    }
                    t.concat(this.targetChoices.auto);
                    return t;
                }
                case enums_1.targetType.OneAllyOrSelf: {
                    t.push(choice);
                    return t;
                }
            }
        }
        catch (e) {
            logger_1.log.error(e);
        }
    }
    validateCoolDown() {
        if (this.cooldown > 0) {
            this.disabled = true;
            return;
        }
    }
    setTargetChoices(characters, playerId, self) {
        const targetMode = this.getTargetMod() || this.targetMode;
        this.targetChoices = targetValidationFactory_1.targetSetter(this, targetMode, characters, playerId, self);
    }
    getTargetChoices() {
        return this.targetChoices;
    }
    setTargets(targets) {
        this.targets = targets;
    }
    removeCharFromTargets(char) {
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
    getTargets() {
        return this.targets;
    }
    executeEffects() {
        //log.info(`[GAME] Execute effects of ${this.casterReference.name}`);
        for (const effect of this.effects) {
            effect.tick++;
            if (this.casterReference.isStunned(this)) {
                //log.info(`[STATUS] - STUNNED`);
                if (this.persistence === enums_1.ControlType.Action)
                    continue;
                else if (this.persistence === enums_1.ControlType.Control)
                    effect.terminate = true;
            }
            effect.shouldApply();
            effect.execute(this);
            if (!effect.terminate)
                effect.generateToolTip();
        }
    }
    executeInitEffects() {
        //log.info("[GAME] Execute NEW effects")
        for (const effect of this.effects) {
            effect.tick++;
            effect.shouldApply();
            effect.extendDuration(this.mods.increaseDuration);
            if (!effect.getTargets().length)
                effect.setTargets(this.targets);
            effect.execute(this);
            effect.generateToolTip();
        }
    }
    getCost() {
        return this.turnCost;
    }
    getSkillEffectsActivation() {
        let checker = {};
        for (const effect of this.effects) {
            checker[effect.getActivationType()] = effect.getActivationType();
        }
        return checker;
    }
    tickEffectsDuration(world, origin) {
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            if ((this.casterReference.isStunned(this) &&
                this.persistence === enums_1.ControlType.Control) ||
                (this.casterReference.isKnockedOut() &&
                    (this.persistence === enums_1.ControlType.Control ||
                        this.persistence === enums_1.ControlType.Action)))
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
        if (this.effects.length === 0)
            return true;
        return false;
    }
    areTargetsValidated() {
        //log.info(`xxx [${this.name}] - targets status`)
        for (let i = this.targets.length - 1; i >= 0; i--) {
            const c = this.arenaReference.getCharactersByIndex([this.targets[i]])[0];
            //log.info(`Validating: [${c.name}] - ${c.isInvulnerable(this)}`)
            if (c.isKnockedOut() ||
                (c.isInvulnerable(this) && this.persistence === enums_1.ControlType.Control)) {
                this.targets.splice(i, 1);
            }
        }
        if (this.targets.length === 0)
            return false;
        return true;
    }
    isCancelled() {
        /*log.info(
          `[${
            this.casterReference.name
          }] - stunned: ${this.casterReference.isStunned(this)}`
        );**/
        if (this.persistence === enums_1.ControlType.Control &&
            this.casterReference.isStunned(this))
            return true;
        return false;
    }
    setTargetMod(target) {
        this.mods.setTargetMod(target);
    }
    getTargetMod() {
        return this.mods.getTargetMod();
    }
    clearMods() {
        this.mods.clearMods();
    }
    getId() {
        return this.id;
    }
    isHarmful() {
        return this.harmful;
    }
    getPublicData() {
        const publicData = Object.assign({}, this);
        delete publicData.arenaReference;
        delete publicData.casterReference;
        delete publicData.effects;
        delete publicData.inactiveEffects;
        delete publicData.mods;
        const publicEffects = [];
        for (const e of this.effects) {
            publicEffects.push(e.getPublicData());
        }
        return Object.assign(Object.assign({}, publicData), { effects: publicEffects });
    }
    getCopyData() {
        const publicSkill = Object.assign({}, this);
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
        return Object.assign(Object.assign({}, publicSkill), { effects: copyEffects, inactiveEffects: copyInactiveEffects });
    }
    setTurnCost() {
        const t = this.mods.costReplacement || this.cost;
        for (const i in t) {
            this.turnCost[i] = Math.max(t[i] + this.mods.costChange[i], 0);
        }
    }
}
exports.Skill = Skill;
//# sourceMappingURL=index.js.map