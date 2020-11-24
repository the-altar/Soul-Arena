"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stun = void 0;
const base_1 = require("./base");
const enums_1 = require("../../enums");
class Stun extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.stunClass = data.stunClass;
    }
    functionality(char, origin, world) {
        char.disableSkills();
        char.setDebuff({
            debuffType: enums_1.DebuffTypes.Stun,
            specific: this.stunClass
        });
    }
    generateToolTip() {
        this.message = "This character is stunned";
    }
}
exports.Stun = Stun;
//# sourceMappingURL=stunRelated.js.map