"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Effect = void 0;
const enums_1 = require("../../enums");
class Effect {
    constructor(data, caster) {
        this.value = data.value;
        this.tick = 1;
        this.message = data.message || null;
        this.duration = data.duration || 1;
        this.increaseDurationByAlliesAlive =
            data.increaseDurationByAlliesAlive || null;
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
        this.triggerClause = data.triggerClause || enums_1.triggerClauseType.None;
        this.behavior = data.behavior || enums_1.effectTargetBehavior.Default;
        this.targets = [];
        this.activate = data.activate || true;
        this.activationType = data.activationType || enums_1.activationType.Immediate;
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
    setArenaReference(world) {
        this.arenaReference = world;
    }
    functionality(char, origin) {
        console.log("This does nothing!");
        return;
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
            (this.tick % 2 !== enums_1.PlayerPhase.MyTurn || this.compulsory))
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
        /*  An even tick means it's your opponent's turn, odd means its yours.*/
        /*  The default behavior is for your skills to activate on odd ticks*/
        if (this.tick % 2 === enums_1.PlayerPhase.MyTurn) {
            this.activate = false;
        }
        else
            this.activate = true;
        if (this.duration <= 0 && !this.infinite)
            this.terminate = true;
        else if (this.targets.length === 0)
            this.terminate = true;
        if (this.terminate)
            this.effectConclusion();
    }
    execute(origin) {
        const t = [];
        //log.info("xxxxxx ", this.targets)
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
                    if (this.targets.length < 2)
                        break;
                    const char = this.arenaReference.getCharactersByIndex([
                        this.targets[1],
                    ])[0];
                    this.activateOnTarget(char, origin, t, this.targets[1]);
                }
                break;
            case enums_1.effectTargetBehavior.Third:
                {
                    if (this.targets.length < 3)
                        break;
                    const char = this.arenaReference.getCharactersByIndex([
                        this.targets[2],
                    ])[0];
                    this.activateOnTarget(char, origin, t, this.targets[2]);
                }
                break;
        }
        if (this.mods.increment.isMultiplier && this.mods.increment.value)
            this.value *= this.mods.increment.value;
        else if (this.mods.increment.value)
            this.value += this.mods.increment.value;
        this.setTargets(t);
    }
    getType() {
        return this.type;
    }
    generateToolTip(triggered) { }
    activateOnTarget(char, origin, targetList, charIndex) {
        if ((!this.triggered || this.activate) && !char.addEffectStack(this)) {
            return;
        }
        if (origin.persistence === enums_1.ControlType.Control &&
            char.isInvulnerable(origin))
            return;
        targetList.push(charIndex);
        if (char.isInvulnerable(origin))
            return;
        if (char.isKnockedOut())
            return;
        this.activateTrigger(char, origin);
        if (!this.activate)
            return;
        this.functionality(char, origin);
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
}
exports.Effect = Effect;
//# sourceMappingURL=base.js.map