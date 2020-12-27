"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IgnoreEffects = exports.EffectRemoval = void 0;
const base_1 = require("./base");
const z_helpers_1 = require("./z.helpers");
class EffectRemoval extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.harmful = data.harmful || false;
        this.friendly = data.friendly || false;
        this.specificEffect = data.specificEffect;
        this.specificSkillType = data.specificSkillType || false;
        this.specificSkillId = data.specificSkillId;
    }
    functionality(char, origin) {
        if (this.harmful)
            this.removeHarmfulEffects(char);
        else if (this.friendly)
            this.removeFriendlyEffects(char);
        else if (this.specificSkillId)
            this.removeSpecificSkill(char);
    }
    generateToolTip() {
        if (this.harmful) {
            this.message = "Harmful effects affecting this character will be removed";
        }
        else if (this.friendly) {
            this.message =
                "Friendly effects affecting this character will be removed";
        }
        else {
            this.message = "Effects affecting this character will be removed";
        }
    }
    removeHarmfulEffects(char) {
        if (char.getDebuffs().ignoreBenefitialEffects)
            return;
        const skills = this.arenaReference.getActiveSkills();
        for (const skill of skills) {
            let wasRemoved = false;
            for (const effect of skill.effects) {
                if (!z_helpers_1.isHarmful(effect.getType()))
                    continue;
                wasRemoved = reduceTargets(effect, char, this.arenaReference);
            }
            if (wasRemoved)
                skill.removeCharFromTargets(char);
        }
    }
    removeFriendlyEffects(char) {
        if (char.getBuffs().ignoreHarmfulEffects.status)
            return;
        const skills = this.arenaReference.getActiveSkills();
        for (const skill of skills) {
            let wasRemoved = false;
            for (const effect of skill.effects) {
                if (z_helpers_1.isHarmful(effect.getType()))
                    continue;
                wasRemoved = reduceTargets(effect, char, this.arenaReference);
            }
            if (wasRemoved)
                skill.removeCharFromTargets(char);
        }
    }
    removeSpecificSkill(char) {
        const skills = this.arenaReference.getActiveSkills();
        for (const skill of skills) {
            if (skill.getId() !== this.specificSkillId)
                continue;
            for (const effect of skill.effects) {
                reduceTargets(effect, char, this.arenaReference);
            }
            skill.removeCharFromTargets(char);
        }
    }
}
exports.EffectRemoval = EffectRemoval;
function reduceTargets(arr, char, world) {
    let targetList = arr.getTargets();
    for (let i = targetList.length - 1; i >= 0; i--) {
        const target = world.getCharactersByIndex([targetList[i]])[0];
        if (target.getId() === char.getId()) {
            targetList.splice(i, 1);
            return true;
        }
    }
    return false;
}
class IgnoreEffects extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.harmful = data.harmful || false;
        this.friendly = data.friendly || false;
        this.includeDamage = data.includeDamage || false;
    }
    functionality(char, origin) {
        if (this.harmful) {
            if (char.getDebuffs().ignoreBenefitialEffects)
                return;
            char.getBuffs().ignoreHarmfulEffects = {
                status: true,
                includeDamage: this.includeDamage,
            };
        }
        if (this.friendly) {
            if (char.getBuffs().ignoreHarmfulEffects.status)
                return;
            char.getDebuffs().ignoreBenefitialEffects = true;
        }
    }
    generateToolTip() {
        let extra;
        this.includeDamage ? (extra = "") : (extra = " except damage");
        if (this.harmful && this.friendly) {
            this.message = `This character will ignore all effects` + extra;
        }
        else if (this.harmful) {
            this.message = `This character will ignore all harmful effects` + extra;
        }
        else if (this.friendly) {
            this.message = `This character will ignore all friendly effects`;
        }
    }
}
exports.IgnoreEffects = IgnoreEffects;
//# sourceMappingURL=effectRemoval.js.map