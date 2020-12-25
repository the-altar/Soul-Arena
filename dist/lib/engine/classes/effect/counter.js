"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Counter = void 0;
const base_1 = require("./base");
const enums_1 = require("../../enums");
class Counter extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.tick = 0;
        this.isDefensive = data.isDefensive || false;
        this.counterType = data.counterType || false;
        this.counterEffectType = data.counterEffectType || false;
        this.triggerOnCounter = data.triggerOnCounter || [];
    }
    functionality(target, origin) {
        let isTriggered;
        if (this.isDefensive)
            isTriggered = this.DefensiveCounter(target, origin);
        else
            isTriggered = this.OffensiveCounter(target, origin);
        if (isTriggered.activated) {
            const casterIndex = this.arenaReference.findCharacterById(this.caster).index;
            const casterChar = this.arenaReference.findCharacterById(this.caster).char;
            const targetsIndex = isTriggered.indexes;
            this.applyLinkedEffects(origin, casterIndex, targetsIndex);
        }
    }
    OffensiveCounter(target, origin) {
        const temp = this.arenaReference.getTempSkills();
        const indexes = [];
        let hasCountered = { activated: false, indexes };
        for (let i = temp.length - 1; i >= 0; i--) {
            const cordinates = temp[i];
            const caster = this.arenaReference.getCharactersByIndex([cordinates.caster])[0];
            const skill = caster.getRealSkillByIndex(cordinates.skill);
            if (this.value === 0)
                return hasCountered;
            if (skill.uncounterable)
                continue;
            if ((this.counterType === enums_1.SkillClassType.Any ||
                skill.class == this.counterType) &&
                caster.getId() === target.getId()) {
                temp.splice(i, 1);
                caster.addNotification({
                    msg: "This character has been countered",
                    id: origin.getId(),
                    skillpic: origin.skillpic,
                    skillName: origin.name,
                });
                hasCountered.activated = true;
                hasCountered.indexes.push(cordinates.caster);
                this.value--;
            }
        }
        return hasCountered;
    }
    DefensiveCounter(target, origin) {
        const temp = this.arenaReference.getTempSkills().reverse();
        const indexes = [];
        let hasCountered = { activated: false, indexes };
        for (let i = temp.length - 1; i >= 0; i--) {
            if (this.value === 0)
                return hasCountered;
            const cordinates = temp[i];
            const char = this.arenaReference.getCharactersByIndex([cordinates.caster])[0];
            const skill = char.getRealSkillByIndex(cordinates.skill);
            if (skill.uncounterable)
                continue;
            if (this.counterType === enums_1.SkillClassType.Any ||
                skill.class === this.counterType) {
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
                        hasCountered.indexes.push(cordinates.caster);
                        break;
                    }
                }
            }
        }
        return hasCountered;
    }
    applyLinkedEffects(origin, caster, targets) {
        for (const trigger of this.triggerOnCounter) {
            for (const effect of origin.inactiveEffects) {
                if (effect.id !== trigger.id)
                    continue;
                if (trigger.self) {
                    effect.triggerRate = 100;
                    effect.setTargets([caster]);
                    origin.effects.push(effect);
                }
            }
        }
    }
    progressTurn() {
        this.delay--;
        if (this.delay <= 0)
            this.duration--;
        /*  An even tick means it's your opponent's turn, odd means its yours.*/
        /*  The default behavior is for your skills to activate on odd ticks*/
        if (this.tick % 2 === enums_1.PlayerPhase.MyTurn) {
            this.activate = false;
        }
        else
            this.activate = true;
        if (this.duration < 0 && !this.infinite)
            this.terminate = true;
        else if (this.targets.length === 0)
            this.terminate = true;
        else if (this.value === 0)
            this.terminate = true;
        else
            this.terminate = false;
        if (this.terminate)
            this.effectConclusion();
    }
    generateToolTip() {
        if (this.value === 1 && this.DefensiveCounter) {
            this.message = `The first new skill used on this character will be countered`;
        }
        else if (this.value === 1 && this.OffensiveCounter) {
            this.message = `The first new skill used by this character will be countered`;
        }
        else if (this.OffensiveCounter) {
            this.message = "New skills used on this character will be countered";
        }
        else if (this.DefensiveCounter) {
            this.message = "New skills used by this character will be countered";
        }
    }
}
exports.Counter = Counter;
//# sourceMappingURL=counter.js.map