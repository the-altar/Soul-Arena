"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplaceSkill = void 0;
const base_1 = require("./base");
const logger_1 = require("../../../logger");
class ReplaceSkill extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.targetSkillId = data.targetSkillId;
        this.originSkillId = data.originSkillId;
        this.modifier = null;
    }
    functionality(char, origin) {
        const replacement = origin.casterReference.findSkillById(this.originSkillId);
        if (!replacement)
            return;
        const replace = char.findSkillById(this.targetSkillId);
        if (!replace)
            return;
        replace.mods.replacedBy = replacement;
        this.modifier = replace.mods;
    }
    getPublicData() {
        const publicData = Object.assign({}, this);
        delete publicData.arenaReference;
        delete publicData.modifier;
        return Object.assign({}, publicData);
    }
    effectConclusion() {
        try {
            if (this.modifier && this.modifier.replacedBy.id == this.originSkillId)
                this.modifier.replacedBy = null;
        }
        catch (e) {
            logger_1.log.error(e);
            this.modifier.replacedBy = null;
        }
    }
    generateToolTip() {
        this.message = this.message || null;
    }
}
exports.ReplaceSkill = ReplaceSkill;
//# sourceMappingURL=replaceSkill.js.map