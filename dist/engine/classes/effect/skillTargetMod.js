"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncreaseTargetSkillDuration = exports.IncreaseCasterSkillDuration = exports.SkillCostChange = exports.SkillTargetMod = void 0;
const base_1 = require("./base");
const enums_1 = require("../../enums");
const logger_1 = require("../../../logger");
class SkillTargetMod extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.newTarget = data.newTarget;
        this.targetSpecificSkill = data.targetSpecificSkill || false;
        this.specificSkillIndex = data.specificSkillIndex || -1;
    }
    functionality(char, origin, world) {
        const s = char.getRealSkillById(this.specificSkillIndex);
        if (this.targetSpecificSkill) {
            s.setTargetMod(this.newTarget);
        }
        else {
            const skills = char.getSkills();
            for (const skill of skills) {
                skill.setTargetMod(this.newTarget);
            }
        }
        this.affectedSkill = s;
    }
    generateToolTip() {
        this.message = generateMessage(this.specificSkillIndex, this.newTarget, this.affectedSkill.name);
    }
    effectConclusion() {
        this.affectedSkill.mods.clearTargetMod();
    }
}
exports.SkillTargetMod = SkillTargetMod;
class SkillCostChange extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.reiatsuCostType = data.reiatsuCostType;
        this.specificSkillTarget = data.specificSkillTarget;
        this.targetedSkills = [];
    }
    functionality(char, origin, world) {
        if (this.specificSkillTarget) {
            for (const s of char.skills) {
                if (s.getId() === this.specificSkillTarget) {
                    s.cost[this.reiatsuCostType] += this.value;
                    this.targetedSkills.push(s);
                    break;
                }
            }
        }
        else {
            for (const s of char.skills) {
                s.cost[this.reiatsuCostType] += this.value;
                this.targetedSkills.push(s);
            }
        }
    }
    generateToolTip() {
        let operation = "";
        let value = this.value;
        if (this.value > 0) {
            operation = "more";
        }
        else {
            operation = "less";
            value *= -1;
        }
        if (!this.specificSkillTarget) {
            this.message = `This character's skills will cost ${value} ${operation} ${enums_1.ReiatsuTypes[this.reiatsuCostType]} reiatsu`;
        }
        else {
            this.message = `'${this.targetedSkills[0].name}' will cost ${value} ${operation} ${enums_1.ReiatsuTypes[this.reiatsuCostType]} reiatsu`;
        }
    }
    effectConclusion() {
        for (const s of this.targetedSkills) {
            if (this.value > 0)
                s.cost[this.reiatsuCostType] -= this.value;
            else
                s.cost[this.reiatsuCostType] += this.value * -1;
        }
    }
}
exports.SkillCostChange = SkillCostChange;
class IncreaseCasterSkillDuration extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.targetSkillId = data.targetSkillId;
        this.noRepeat = false;
    }
    functionality(char, origin, world) {
        if (this.noRepeat)
            return;
        this.noRepeat = true;
        const skill = char.getRealSkillById(this.targetSkillId);
        if (!skill)
            return;
        skill.mods.increaseDuration += this.value;
        this.skillReference = skill;
        this.targetedSkillName = skill.name;
        logger_1.log.info(`Duration of ${skill.name} has been extended by ${skill.mods.increaseDuration}`);
    }
    generateToolTip() {
        if (this.targetedSkillName) {
            this.message = `'${this.targetedSkillName}' will last ${this.value / 2} additional turn`;
        }
    }
    effectConclusion() {
        logger_1.log.info("EFFECT CONCLUSION");
        this.skillReference.mods.increaseDuration -= this.value;
    }
}
exports.IncreaseCasterSkillDuration = IncreaseCasterSkillDuration;
class IncreaseTargetSkillDuration extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.targetSkillId = data.targetSkillId;
    }
    functionality(char, origin, world) {
        if (this.noRepeat)
            return;
        this.noRepeat = true;
        const val = char.getDebuffs().increaseSkillDuration[this.targetSkillId];
        char.getDebuffs().increaseSkillDuration[this.targetSkillId] =
            (val || 0) + this.value;
        this.targetedSkillName = world
            .findCharacterById(this.caster)
            .char.findSkillById(this.targetSkillId).name;
        this.charReference = char;
    }
    generateToolTip() {
        if (this.targetedSkillName) {
            this.message = `'${this.targetedSkillName}' will last ${this.value / 2} additional turn if used on this character`;
        }
    }
    effectConclusion() {
        delete this.charReference.getDebuffs().increaseSkillDuration[this.targetSkillId];
    }
}
exports.IncreaseTargetSkillDuration = IncreaseTargetSkillDuration;
function generateMessage(specificIndex, tType, skill) {
    let m = "";
    switch (tType) {
        case enums_1.targetType.AllAllies:
            {
                m = "all allies";
            }
            break;
        case enums_1.targetType.OneEnemy:
            {
                m = "one enemy";
            }
            break;
        case enums_1.targetType.AllEnemies: {
            m = "all enemies";
        }
    }
    if (!specificIndex)
        return `This character's skills will now target ${m}'`;
    else
        return `This character will now target ${m} with ${skill}`;
}
//# sourceMappingURL=skillTargetMod.js.map