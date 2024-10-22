"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stun = void 0;
const base_1 = require("./base");
const enums_1 = require("../../enums");
const logger_1 = require("../../../logger");
class Stun extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.stunClass = data.stunClass;
    }
    functionality(char, origin) {
        //log.info("STUN EFFECT ACTIVATE")
        if (char.getBuffs().ignoreHarmfulEffects.status) {
            logger_1.log.info("--- was ignored");
            return;
        }
        ;
        char.disableSkills();
        char.getDebuffs().stun[this.stunClass] = true;
    }
    generateToolTip() {
        if (this.stunClass === enums_1.SkillClassType.Any)
            this.message = "This character is stunned";
        else
            this.message = `This character's ${enums_1.SkillClassType[this.stunClass]} skills are stunned`;
    }
}
exports.Stun = Stun;
//# sourceMappingURL=stunRelated.js.map