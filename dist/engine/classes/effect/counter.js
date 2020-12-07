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
    }
    functionality(target, origin, world) {
        if (this.isDefensive)
            this.DefensiveCounter(target, origin, world);
        else
            this.OffensiveCounter(target, origin, world);
    }
    OffensiveCounter(target, origin, world) {
        const temp = world.getTempSkills();
        for (let i = temp.length - 1; i >= 0; i--) {
            const cordinates = temp[i];
            const char = world.getCharactersByIndex([cordinates.caster])[0];
            const skill = char.getRealSkillByIndex(cordinates.skill);
            if (this.value === 0)
                return;
            if (skill.uncounterable)
                return;
            if ((this.counterType === enums_1.SkillClassType.Any ||
                skill.class == this.counterType) &&
                char.getId() === target.getId()) {
                temp.splice(i, 1);
                char.addNotification({
                    msg: "This character has been countered",
                    id: origin.getId(),
                    skillpic: origin.skillpic,
                    skillName: origin.name,
                });
                this.value--;
            }
        }
    }
    DefensiveCounter(target, origin, world) {
        const temp = world.getTempSkills().reverse();
        for (let i = temp.length - 1; i >= 0; i--) {
            if (this.value === 0)
                return;
            const cordinates = temp[i];
            const char = world.getCharactersByIndex([cordinates.caster])[0];
            const skill = char.getRealSkillByIndex(cordinates.skill);
            if (skill.uncounterable)
                continue;
            if (this.counterType === enums_1.SkillClassType.Any ||
                skill.class === this.counterType) {
                for (const t of cordinates.targets) {
                    const sufferer = world.getCharactersByIndex([t])[0];
                    if (sufferer.getId() === target.getId()) {
                        temp[i].cancelled = true;
                        char.addNotification({
                            msg: "This character has been countered",
                            id: origin.getId(),
                            skillpic: origin.skillpic,
                            skillName: origin.name,
                        });
                        this.value--;
                        break;
                    }
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
        this.message = "Skills used on this character will be countered";
    }
}
exports.Counter = Counter;
//# sourceMappingURL=counter.js.map