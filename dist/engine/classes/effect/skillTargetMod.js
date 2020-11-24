"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillCostChange = exports.SkillTargetMod = void 0;
const base_1 = require("./base");
const enums_1 = require("../../enums");
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