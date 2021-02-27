"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Effect = void 0;
const enums_1 = require("../../enums");
const index_1 = require("./index");
const logger_1 = require("../../../logger");
class Effect {
    constructor(data, caster) {
        this.value = data.value;
        this.tick = data.tick || 0;
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
        this.triggerClause = data.triggerClause || enums_1.triggerClauseType.None;
        this.behavior = data.behavior || enums_1.effectTargetBehavior.Default;
        this.targets = [];
        this.activate = data.activate || true;
        this.activationType = data.activationType || enums_1.activationType.Immediate;
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
    setArenaReference(world) {
        this.arenaReference = world;
    }
    functionality(char, origin) {
        if (!this.triggerLinkedEffects.length)
            return;
        for (let i = 0; i < this.triggerLinkedEffects.length; i++) {
            const linked = this.triggerLinkedEffects[i];
            switch (linked.condition) {
                case enums_1.triggerClauseType.IfTargeted:
                    {
                        for (const temp of this.arenaReference.tempQueue) {
                            if (temp.targets.includes(char.myIndex)) {
                                //log.info(`Apply linked effect on ${temp.caster}`);
                                this.applyLinkedEffects(origin, this.caster, [temp.caster], [char.myIndex], 1, i);
                            }
                        }
                    }
                    break;
                case enums_1.triggerClauseType.IfTargetedByHarmfulSkill:
                    {
                        for (const temp of this.arenaReference.tempQueue) {
                            const skill = this.arenaReference.characters[temp.caster].skills[temp.skill];
                            if (temp.targets.includes(char.myIndex) && skill.isHarmful()) {
                                logger_1.log.info(`xxx APPLY ${skill.name} harmful status: ${skill.isHarmful()} on ${char.name}`);
                                this.applyLinkedEffects(origin, this.caster, [temp.caster], [char.myIndex], 1, i);
                            }
                        }
                    }
                    break;
                case enums_1.triggerClauseType.UsesANewSkill:
                    {
                        for (const temp of this.arenaReference.tempQueue) {
                            if (temp.caster === char.myIndex) {
                                this.applyLinkedEffects(origin, this.caster, [temp.caster], [char.myIndex], 1, i);
                                break;
                            }
                        }
                    }
                    break;
                case enums_1.triggerClauseType.UsesANewNonStrategicSkill:
                    {
                        //log.info(this.arenaReference.tempQueue.length);
                        for (const temp of this.arenaReference.tempQueue) {
                            const skill = this.arenaReference.characters[temp.caster].skills[temp.skill];
                            if (temp.caster === char.myIndex &&
                                skill.class !== enums_1.SkillClassType.Strategic) {
                                this.applyLinkedEffects(origin, this.caster, [temp.caster], [char.myIndex], 1, i);
                                break;
                            }
                        }
                    }
                    break;
                case enums_1.triggerClauseType.BothAlliesAreDead: {
                    const count = origin.casterReference.getAllies().filter((c) => {
                        return this.arenaReference.characters[c].isKnockedOut();
                    });
                    if (count.length == 2) {
                        this.applyLinkedEffects(origin, this.caster, this.targets, [char.myIndex], 1, i);
                    }
                }
            }
        }
    }
    setAltValue(value) {
        this.altValue = value;
    }
    extendDuration(val) {
        this.duration += val;
    }
    setIncrement(value) {
        this.mods.increment.value = value;
    }
    getAltValue() {
        return this.altValue;
    }
    setTargets(targets) {
        this.targets = targets;
    }
    shouldApply() {
        const triggerRate = Math.floor(Math.random() * 101);
        if (triggerRate <= this.triggerRate &&
            this.delay <= 0 &&
            (this.tick % 2 === enums_1.PlayerPhase.MyTurn || this.compulsory))
            this.activate = true;
        else
            this.activate = false;
    }
    getActivationType() {
        return this.activationType;
    }
    progressTurn() {
        if (this.delay <= 0)
            this.duration--;
        else {
            this.delay--;
        }
        if (this.duration <= 0 && !this.infinite)
            this.terminate = true;
        else if (this.targets.length === 0)
            this.terminate = true;
        if (this.terminate)
            this.effectConclusion();
    }
    execute(origin) {
        const t = [];
        try {
            //log.info("xxxxxx ", this.targets)
            if (!this.triggered) {
            }
            switch (this.behavior) {
                case enums_1.effectTargetBehavior.Default:
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
                case enums_1.effectTargetBehavior.OnlyOne:
                    {
                        const char = this.arenaReference.getCharactersByIndex([
                            this.targets[0],
                        ])[0];
                        this.activateOnTarget(char, origin, t, this.targets[0]);
                    }
                    break;
                case enums_1.effectTargetBehavior.AllOthers:
                    {
                        const slice = this.targets.slice(1, this.targets.length);
                        for (const i of slice) {
                            const char = this.arenaReference.getCharactersByIndex([i])[0];
                            this.activateOnTarget(char, origin, t, i);
                        }
                    }
                    break;
                case enums_1.effectTargetBehavior.IfAlly:
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
                case enums_1.effectTargetBehavior.IfAllyIncludingSelf:
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
                case enums_1.effectTargetBehavior.IfEnemy:
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
                case enums_1.effectTargetBehavior.ifSelf:
                    {
                        const { char, index } = this.arenaReference.findCharacterById(this.caster);
                        this.activateOnTarget(char, origin, t, index);
                    }
                    break;
                case enums_1.effectTargetBehavior.First:
                    {
                        const char = this.arenaReference.getCharactersByIndex([
                            this.targets[0],
                        ])[0];
                        this.activateOnTarget(char, origin, t, this.targets[0]);
                    }
                    break;
                case enums_1.effectTargetBehavior.Second:
                    {
                        //log.info(this.targets)
                        let index = 1;
                        if (this.targets.length < 2 && !this.triggered)
                            break;
                        if (this.triggered)
                            index = 0;
                        const char = this.arenaReference.getCharactersByIndex([
                            this.targets[index],
                        ])[0];
                        this.activateOnTarget(char, origin, t, this.targets[index]);
                    }
                    break;
                case enums_1.effectTargetBehavior.Third:
                    {
                        let index = 2;
                        if (this.targets.length < 3 && !this.triggered)
                            break;
                        if (this.triggered)
                            index = 0;
                        const char = this.arenaReference.getCharactersByIndex([
                            this.targets[index],
                        ])[0];
                        this.activateOnTarget(char, origin, t, this.targets[index]);
                    }
                    break;
                case enums_1.effectTargetBehavior.OneRandomEnemy: {
                    let index;
                    if (this.triggered)
                        index = this.targets[0];
                    else {
                        const { char } = this.arenaReference.findCharacterById(this.caster);
                        let searching = true;
                        while (searching) {
                            const i = this.targets[Math.floor(Math.random() * this.targets.length)];
                            if (char.getEnemies().includes(i)) {
                                index = i;
                                searching = false;
                            }
                        }
                    }
                    this.activateOnTarget(this.arenaReference.characters[index], origin, t, index);
                }
            }
            if (this.mods.increment.isMultiplier && this.mods.increment.value)
                this.value *= this.mods.increment.value;
            else if (this.mods.increment.value)
                this.value += this.mods.increment.value;
            this.setTargets(t);
        }
        catch (e) {
            logger_1.log.error(e);
            this.setTargets(t);
        }
    }
    getType() {
        return this.type;
    }
    generateToolTip(triggered) {
        this.message = this.message || null;
    }
    activateOnTarget(char, origin, targetList, charIndex) {
        try {
            char.skillStack.add(origin.getId(), this.caster);
            if ((!this.triggered || this.activate) && !char.addEffectStack(this)) {
                return;
            }
            if (origin.persistence === enums_1.ControlType.Control &&
                !this.ignoresInvulnerability &&
                char.isInvulnerable(origin))
                return;
            targetList.push(charIndex);
            if (!this.ignoresInvulnerability && char.isInvulnerable(origin))
                return;
            if (char.isKnockedOut())
                return;
            this.activateTrigger(char, origin);
            if (!this.activate)
                return;
            this.functionality(char, origin);
        }
        catch (e) {
            logger_1.log.error(e);
        }
    }
    effectConclusion() { }
    getTargets() {
        return this.targets;
    }
    isVisible() {
        if (this.isInvisible)
            return false;
        return true;
    }
    // this is only activated once when the effect is applied for the first time
    activateTrigger(char, origin) {
        if (this.triggered)
            return;
        this.triggered = true;
        if (this.increaseDurationByAlliesAlive) {
            for (const ally of this.arenaReference
                .findCharacterById(this.caster)
                .char.getAllies()) {
                if (!this.arenaReference.characters[ally].isKnockedOut())
                    this.duration = this.duration + 2;
            }
        }
        const extendEffect = char.getDebuffs().increaseSkillDuration[origin.getId()];
        if (extendEffect && extendEffect.except.includes(this.id) === false) {
            this.duration = this.duration + (extendEffect.value || 0);
        }
    }
    getPublicData() {
        const publicData = Object.assign({}, this);
        delete publicData.arenaReference;
        return Object.assign({}, publicData);
    }
    apply(char, origin) { }
    applyLinkedEffects(origin, caster, victims, targets, times, linkIndex) {
        const trigger = this.triggerLinkedEffects[linkIndex];
        for (const effect of origin.inactiveEffects) {
            if (effect.id !== trigger.id) {
                //log.info("--> [REJECTED]", effect.id, trigger.id);
                continue;
            }
            const nEffect = index_1.effectFactory(effect, effect.caster);
            if (trigger.self) {
                logger_1.log.info("--> [trigger under self]");
                nEffect.triggerRate = 100;
                nEffect.setTargets([caster]);
            }
            else if (trigger.victim) {
                logger_1.log.info("--> [trigger under victim]");
                nEffect.triggerRate = 100;
                nEffect.setTargets(victims);
            }
            else if (trigger.target) {
                logger_1.log.info("--> [trigger under target]");
                nEffect.triggerRate = 100;
                nEffect.setTargets(targets);
            }
            nEffect.value *= times || 1;
            origin.effects.push(nEffect);
            logger_1.log.info();
        }
    }
}
exports.Effect = Effect;
//# sourceMappingURL=base.js.map