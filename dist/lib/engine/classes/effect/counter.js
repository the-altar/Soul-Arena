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
        this.applyPerTrigger = data.applyPerTrigger || true;
    }
    functionality(target, origin) {
        let isTriggered;
        if (this.isDefensive) {
            if (target.getDebuffs().ignoreBenefitialEffects)
                return;
            isTriggered = this.DefensiveCounter(target, origin);
        }
        else {
            if (target.getBuffs().ignoreHarmfulEffects.status)
                return;
            isTriggered = this.OffensiveCounter(target, origin);
        }
        if (isTriggered.activated) {
            const casterIndex = this.arenaReference.findCharacterById(this.caster)
                .index;
            const casterChar = this.arenaReference.findCharacterById(this.caster)
                .char;
            const targetsIndex = isTriggered.indexes;
            this.applyLinkedEffects(origin, casterIndex, targetsIndex, isTriggered.times);
        }
    }
    OffensiveCounter(target, origin) {
        const temp = this.arenaReference.getTempSkills();
        const indexes = [];
        let hasCountered = { activated: false, indexes, times: 0 };
        for (let i = temp.length - 1; i >= 0; i--) {
            if (temp[i].cancelled)
                continue;
            const cordinates = temp[i];
            const caster = this.arenaReference.getCharactersByIndex([
                cordinates.caster,
            ])[0];
            const skill = caster.getRealSkillByIndex(cordinates.skill);
            if (this.value === 0)
                return hasCountered;
            if (skill.uncounterable)
                continue;
            if ((this.counterType === enums_1.SkillClassType.Any ||
                skill.class == this.counterType ||
                (this.counterType === enums_1.SkillClassType.NonStrategic &&
                    skill.class !== enums_1.SkillClassType.Strategic)) &&
                caster.getId() === target.getId()) {
                temp[i].cancelled = true;
                caster.addNotification({
                    msg: "This character has been countered",
                    id: origin.getId(),
                    skillpic: origin.skillpic,
                    skillName: origin.name,
                });
                hasCountered.activated = true;
                hasCountered.times++;
                hasCountered.indexes.push(cordinates.caster);
                this.value--;
            }
        }
        return hasCountered;
    }
    DefensiveCounter(target, origin) {
        const temp = this.arenaReference.getTempSkills().reverse();
        const indexes = [];
        let hasCountered = { activated: false, indexes, times: 0 };
        for (let i = temp.length - 1; i >= 0; i--) {
            if (this.value === 0)
                return hasCountered;
            if (temp[i].cancelled)
                continue;
            const cordinates = temp[i];
            const char = this.arenaReference.getCharactersByIndex([
                cordinates.caster,
            ])[0];
            const skill = char.getRealSkillByIndex(cordinates.skill);
            if (skill.uncounterable)
                continue;
            if (this.counterType === enums_1.SkillClassType.Any ||
                skill.class == this.counterType ||
                (this.counterType === enums_1.SkillClassType.NonStrategic &&
                    skill.class !== enums_1.SkillClassType.Strategic)) {
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
                        hasCountered.times++;
                        hasCountered.indexes.push(cordinates.caster);
                        break;
                    }
                }
            }
        }
        return hasCountered;
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
        let extra = "";
        if (this.message)
            return;
        switch (this.counterType) {
            case enums_1.SkillClassType.Reiatsu:
                {
                    extra = "reiatsu ";
                }
                break;
            case enums_1.SkillClassType.Physical:
                {
                    extra = "physical ";
                }
                break;
            case enums_1.SkillClassType.Strategic:
                {
                    extra = "strategic ";
                }
                break;
            case enums_1.SkillClassType.Affliction:
                {
                    extra = "affliction ";
                }
                break;
            case enums_1.SkillClassType.NonStrategic: {
                extra = "non-strategic ";
            }
        }
        if (this.value === 1 && this.DefensiveCounter) {
            this.message = `The first new ${extra}skill used on this character will be countered`;
            return;
        }
        else if (this.DefensiveCounter) {
            this.message =
                "New " + extra + "skills used on this character will be countered";
            return;
        }
        else {
            if (this.value === 1) {
                this.message = `The first new ${extra}skill used by this character will be countered`;
            }
            else {
                this.message = `New ${extra}skills used by this character will be countered`;
            }
        }
    }
}
exports.Counter = Counter;
//# sourceMappingURL=counter.js.map