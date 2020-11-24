"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DestructibleDefense = void 0;
const base_1 = require("./base");
const enums_1 = require("../../enums");
class DestructibleDefense extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.targetChar = null;
        this.hasBeenApplied = false;
    }
    functionality(char, origin) {
        if (this.hasBeenApplied)
            return;
        char.setBuff({
            buffType: enums_1.BuffTypes.DestructibleDefense,
            value: this.value,
        });
        this.targetChar = char;
        this.hasBeenApplied = true;
    }
    progressTurn() {
        if (this.targetChar !== null &&
            this.value > this.targetChar.getBuffs().destructibleDefense) {
            this.value = this.targetChar.getBuffs().destructibleDefense;
        }
        this.delay--;
        if (this.delay <= 0)
            this.duration--;
        /*  An even tick means it's your opponent's turn, odd means its yours.*/
        /*  The default behavior is for your skills to activate on odd ticks*/
        if (this.tick % 2 === enums_1.PlayerPhase.MyTurn || this.compulsory) {
            this.activate = false;
        }
        else
            this.activate = true;
        if (this.duration < 0 && !this.infinite)
            this.terminate = true;
        else
            this.terminate = false;
        if (this.value <= 0)
            this.terminate = true;
        if (this.targets.length === 0)
            this.terminate = true;
        if (this.terminate)
            this.effectConclusion();
    }
    effectConclusion() {
        if (this.targetChar !== null && this.value > 0)
            this.targetChar.getBuffs().destructibleDefense = Math.max(0, this.targetChar.getBuffs().destructibleDefense - this.value);
    }
    generateToolTip() {
        this.message = `This character has ${this.value} destructible defense`;
    }
}
exports.DestructibleDefense = DestructibleDefense;
//# sourceMappingURL=destructibleDefense.js.map