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
    functionality(char, origin) {
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
        this.affectedSkill.mods.setTargetMod(null);
    }
    getPublicData() {
        const publicData = Object.assign({}, this);
        delete publicData.arenaReference;
        delete publicData.affectedSkill;
        return publicData;
    }
}
exports.SkillTargetMod = SkillTargetMod;
class SkillCostChange extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.reiatsuCostType = data.reiatsuCostType;
        this.specificSkillTarget = data.specificSkillTarget;
        this.targetedSkillName = "";
    }
    functionality(char, origin) {
        if (this.specificSkillTarget) {
            for (const s of char.skills) {
                if (s.getId() === this.specificSkillTarget) {
                    s.mods.costChange[this.reiatsuCostType] += this.value;
                    this.targetedSkillName = s.name;
                    break;
                }
            }
        }
        else {
            for (const s of char.skills) {
                s.mods.costChange[this.reiatsuCostType] += this.value;
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
            this.message = `'${this.targetedSkillName}' will cost ${value} ${operation} ${enums_1.ReiatsuTypes[this.reiatsuCostType]} reiatsu`;
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
        else
            this.terminate = false;
        if (this.terminate)
            this.effectConclusion();
    }
    getPublicData() {
        const publicData = Object.assign({}, this);
        delete publicData.arenaReference;
        return publicData;
    }
}
exports.SkillCostChange = SkillCostChange;
class IncreaseCasterSkillDuration extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.targetSkillId = data.targetSkillId;
        this.noRepeat = false;
    }
    functionality(char, origin) {
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
    getPublicData() {
        const publicData = Object.assign({}, this);
        delete publicData.arenaReference;
        delete publicData.skillReference;
        return Object.assign({}, publicData);
    }
}
exports.IncreaseCasterSkillDuration = IncreaseCasterSkillDuration;
class IncreaseTargetSkillDuration extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.targetSkillId = data.targetSkillId;
    }
    functionality(char, origin) {
        if (this.noRepeat)
            return;
        this.noRepeat = true;
        const val = char.getDebuffs().increaseSkillDuration[this.targetSkillId];
        char.getDebuffs().increaseSkillDuration[this.targetSkillId] =
            (val || 0) + this.value;
        this.targetedSkillName = this.arenaReference
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
    getPublicData() {
        const publicData = Object.assign({}, this);
        delete publicData.arenaReference;
        delete publicData.charReference;
        return Object.assign({}, publicData);
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