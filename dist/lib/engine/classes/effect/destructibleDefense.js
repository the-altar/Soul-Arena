"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DestructibleDefense = void 0;
const base_1 = require("./base");
const enums_1 = require("../../enums");
/**Destructible defense must be destroyed before dealing damage. A bit more complex */
class DestructibleDefense extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.noRepeat = false;
    }
    functionality(char, origin) {
        if (this.noRepeat)
            return;
        this.uniqueId = Date.now() + Math.random();
        this.noRepeat = true;
        char.getBuffs().destructibleDefense[this.uniqueId] = this;
    }
    progressTurn() {
        this.delay--;
        this.generateToolTip();
        if (this.delay <= 0)
            this.duration--;
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
    generateToolTip() {
        this.message = `This character has ${this.value} destructible defense`;
    }
    shouldApply() {
        const triggerRate = Math.floor(Math.random() * 101);
        if (triggerRate <= this.triggerRate && this.delay <= 0)
            this.activate = true;
        else
            this.activate = false;
    }
    effectConclusion() {
        this.value = 0;
    }
}
exports.DestructibleDefense = DestructibleDefense;
//# sourceMappingURL=destructibleDefense.js.map