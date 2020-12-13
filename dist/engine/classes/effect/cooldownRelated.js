"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetCooldown = exports.CooldownReduction = exports.CooldownIncreasal = void 0;
const base_1 = require("./base");
const enums_1 = require("../../enums");
class CooldownIncreasal extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.specific = data.specific;
    }
    functionality(char, origin) {
        this.triggered = true;
        char.setDebuff({
            debuffType: enums_1.DebuffTypes.CooldownIncreasal,
            value: this.value,
            specific: this.specific
        });
    }
    generateToolTip() {
        if (this.delay > 0) {
            this.message = `Cooldown will be increased by ${this.value} if this character uses a skill in ${this.delay}`;
        }
        else {
            this.message = `If this character uses a skill its cooldown will be increased by ${this.value}`;
        }
    }
}
exports.CooldownIncreasal = CooldownIncreasal;
class CooldownReduction extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.ofSkillId = data.ofSkillId;
        this.ofAllSkills = data.ofAllSkills;
    }
    functionality(char, origin) {
        this.triggered = true;
        const cd = char.getBuffs().cooldownReduction;
        if (this.ofSkillId) {
            cd.ofSkillId[this.ofSkillId] = (cd.ofSkillId[this.ofSkillId] || 0) + this.value;
            this.skillName = char.findSkillById(this.ofSkillId).name;
        }
        else if (this.ofAllSkills)
            cd.ofAllSkills = this.value;
    }
    generateToolTip() {
        if (this.ofAllSkills) {
            this.message = `If this character uses a skill its ccooldown will be reduced by ${this.value}`;
        }
        else if (this.ofSkillId) {
            this.message = `'${this.skillName}' will have its cooldown reduced by ${this.value}`;
        }
    }
}
exports.CooldownReduction = CooldownReduction;
class ResetCooldown extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.specificSkill = data.specificSkill || false;
        this.skillId = data.skillId;
    }
    functionality(char, origin) {
        for (const skill of char.getSkills()) {
            if (this.specificSkill && this.skillId !== skill.getId())
                continue;
            skill.resetCooldown();
        }
    }
    generateToolTip() {
        this.message = "Active cooldowns will be reset";
    }
}
exports.ResetCooldown = ResetCooldown;
//# sourceMappingURL=cooldownRelated.js.map