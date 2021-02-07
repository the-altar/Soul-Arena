"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillMod = exports.IncreaseTargetSkillDuration = exports.IncreaseCasterSkillDuration = exports.ReplaceSkillCost = exports.SkillCostChange = exports.SkillTargetMod = void 0;
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
                logger_1.log.info(`[COST CHANGE] original cost mod: ${s.mods.costChange[this.reiatsuCostType]}, change: ${this.value}`);
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
    getPublicData() {
        const publicData = Object.assign({}, this);
        delete publicData.arenaReference;
        return publicData;
    }
}
exports.SkillCostChange = SkillCostChange;
class ReplaceSkillCost extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.reiatsuReplacement = data.reiatsuReplacement;
        this.specificSkillTarget = data.specificSkillTarget;
        this.targetedSkillName = "";
    }
    functionality(char, origin) {
        if (this.specificSkillTarget) {
            for (const s of char.skills) {
                if (s.getId() === this.specificSkillTarget) {
                    s.mods.costReplacement = this.reiatsuReplacement;
                    this.targetedSkillName = s.name;
                    break;
                }
            }
        }
        else {
            for (const s of char.skills) {
                s.mods.costReplacement = this.reiatsuReplacement;
            }
        }
    }
}
exports.ReplaceSkillCost = ReplaceSkillCost;
class IncreaseCasterSkillDuration extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.targetSkillId = data.targetSkillId;
        this.noRepeat = false;
    }
    functionality(char, origin) {
        if (char.getDebuffs().ignoreBenefitialEffects) {
            this.noRepeat = false;
            if (!this.targetedSkillName) {
                this.targetedSkillName = char.findSkillById(this.targetSkillId).name;
            }
            else {
                this.effectConclusion();
            }
            return;
        }
        if (this.noRepeat)
            return;
        this.noRepeat = true;
        const skill = char.getRealSkillById(this.targetSkillId);
        if (!skill)
            return;
        skill.mods.increaseDuration += this.value;
        this.skillReference = skill;
        this.targetedSkillName = skill.name;
    }
    generateToolTip() {
        if (this.targetedSkillName) {
            this.message = `'${this.targetedSkillName}' will last ${this.value / 2} additional turn`;
        }
    }
    effectConclusion() {
        if (!this.skillReference)
            return;
        if (!this.skillReference.mods)
            return;
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
// Increase duration of a skill when used on a specific target ONLY!
class IncreaseTargetSkillDuration extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.targetSkillId = data.targetSkillId;
        this.effectsId = data.effectsId || [];
    }
    functionality(char, origin) {
        if (char.getBuffs().ignoreHarmfulEffects.status) {
            this.noRepeat = false;
            if (!this.targetedSkillName) {
                this.targetedSkillName = this.arenaReference
                    .findCharacterById(this.caster)
                    .char.findSkillById(this.targetSkillId).name;
            }
            this.charReference = char;
            this.effectConclusion();
            return;
        }
        if (this.noRepeat)
            return;
        this.noRepeat = true;
        const val = char.getDebuffs().increaseSkillDuration[this.targetSkillId] || {
            value: 0,
            except: [],
        };
        char.getDebuffs().increaseSkillDuration[this.targetSkillId] = {
            value: (val.value || 0) + this.value,
            except: this.effectsId,
        };
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
        if (!this.charReference)
            return;
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
class SkillMod extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.skillId = data.skillId;
        this.metadata = data.metadata || {};
    }
    functionality(char, origin) {
        logger_1.log.info(this.skillId);
        const s = char.getRealSkillById(this.skillId);
        if (s) {
            s.mods.setByAttribute(this.metadata, char.getId());
        }
    }
    generateToolTip() {
        this.message = this.message || null;
    }
}
exports.SkillMod = SkillMod;
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