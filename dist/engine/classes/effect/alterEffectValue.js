"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisableEffects = exports.EnableEffects = exports.AlterEffectValue = void 0;
const base_1 = require("./base");
class AlterEffectValue extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.targetSkillId = data.targetSkillId || false;
        this.effectType = data.effectType;
        this.anyEffect = data.anyEffect || false;
        this.anySkill = data.anySkill || false;
        this.targetSkillName = "";
        this.incrementVal = data.incrementVal || 0;
        this.changedEffects = [];
        this.applied = data.applied || false;
    }
    functionality(char, origin, world) {
        if (this.applied)
            return;
        for (const skill of char.getSkills()) {
            if (!this.anySkill && skill.getId() !== this.targetSkillId)
                continue;
            for (const effect of skill.effects) {
                if (!this.anyEffect && this.effectType !== effect.getType())
                    continue;
                let originalIncrement = effect.mods.increment.value;
                let originalAltValue = effect.getAltValue();
                effect.setAltValue(this.value);
                effect.mods.increment.value = this.incrementVal;
                this.changedEffects.push({
                    effect,
                    originalAltValue,
                    originalIncrement,
                });
            }
            this.targetSkillName = skill.name;
        }
        this.applied = true;
    }
    generateToolTip() {
        if (!this.anySkill) {
            this.message = `${this.targetSkillName} has been altered`;
        }
        else {
            this.message = "This character's skills have been altered";
        }
    }
    effectConclusion() {
        for (const payload of this.changedEffects) {
            payload.effect.setAltValue(payload.originalAltValue);
            payload.effect.mods.increment.value = payload.originalIncrement;
        }
    }
    getPublicData() {
        const publicData = Object.assign({}, this);
        delete publicData.arenaReference;
        delete publicData.changedEffects;
        return Object.assign({}, publicData);
    }
}
exports.AlterEffectValue = AlterEffectValue;
class EnableEffects extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.effectsId = data.effectsId;
        this.parentSkillId = data.parentSkillId;
    }
    functionality(char, origin) {
        if (this.hasBeenApplied)
            return;
        const targetedSkill = char.findSkillById(this.parentSkillId);
        for (const e of targetedSkill.inactiveEffects) {
            if (this.effectsId.includes(e.id)) {
                e.triggerRate = 100;
                targetedSkill.effects.push(e);
            }
        }
        this.targetedSkill = targetedSkill;
        this.hasBeenApplied = true;
    }
    generateToolTip() {
        this.message =
            this.message || `'${this.targetedSkill.name}' has been improved`;
    }
    effectConclusion() {
        for (let i = this.targetedSkill.effects.length - 1; i >= 0; i--) {
            const e = this.targetedSkill.effects[i];
            if (this.effectsId.includes(e.id)) {
                e.triggerRate = -1;
                this.targetedSkill.effects.splice(i, 1);
            }
        }
    }
    getPublicData() {
        const publicData = Object.assign({}, this);
        delete publicData.arenaReference;
        delete publicData.targetedSkill;
        return Object.assign({}, publicData);
    }
}
exports.EnableEffects = EnableEffects;
class DisableEffects extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.effectsId = data.effectsId;
        this.parentSkillId = data.parentSkillId;
    }
    functionality(char, origin) {
        if (this.hasBeenApplied)
            return;
        const targetedSkill = char.findSkillById(this.parentSkillId);
        for (const e of targetedSkill.effects) {
            if (this.effectsId.includes(e.id)) {
                e.triggerRate = -1;
            }
        }
        this.targetedSkill = targetedSkill;
        this.hasBeenApplied = true;
    }
    generateToolTip() {
        this.message = null;
    }
    effectConclusion() {
        for (let i = this.targetedSkill.effects.length - 1; i >= 0; i--) {
            const e = this.targetedSkill.effects[i];
            if (this.effectsId.includes(e.id)) {
                e.triggerRate = 100;
            }
        }
    }
    getPublicData() {
        const publicData = Object.assign({}, this);
        delete publicData.arenaReference;
        delete publicData.targetedSkill;
        return Object.assign({}, publicData);
    }
}
exports.DisableEffects = DisableEffects;
//# sourceMappingURL=alterEffectValue.js.map