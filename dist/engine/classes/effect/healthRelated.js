"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthDrain = exports.Healing = void 0;
const damageRelated_1 = require("./damageRelated");
const base_1 = require("./base");
const enums_1 = require("../../enums");
class Healing extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
    }
    functionality(char, origin, world) {
        this.triggered = true;
        const hp = char.geHitPoints() + this.value;
        char.setHitPoints(hp);
    }
    generateToolTip() {
        if (this.triggerClause !== enums_1.triggerClauseType.None && !this.triggered) {
            switch (this.triggerClause) {
                case enums_1.triggerClauseType.onKnockOut: {
                    this.message = `If Knocked out a healing effect will be triggered`;
                }
            }
        }
        else {
            if (this.delay > 0) {
                this.message = `After ${this.delay} turn(s) this character will heal ${this.value} health`;
            }
            else {
                this.message = `This character will heal ${this.value} health`;
            }
        }
    }
}
exports.Healing = Healing;
class HealthDrain extends damageRelated_1.Damage {
    constructor(data, caster) {
        super(data, caster);
    }
    functionality(character, origin, world) {
        this.triggered = true;
        const reduction = this.getDamageReductionFromCaster(this.caster, this, origin, world);
        let damage = (this.value - reduction);
        if (damage < 0)
            damage = 0;
        const hp = character.geHitPoints() - Math.round(damage / 5) * 5;
        character.setHitPoints(hp);
        const { char } = world.findCharacterById(this.caster);
        if (char.isKnockedOut())
            return;
        char.setHitPoints((char.geHitPoints() + Math.round(damage / 5) * 5));
    }
    generateToolTip() {
        if (this.triggerClause !== enums_1.triggerClauseType.None && !this.triggered) {
            switch (this.triggerClause) {
                case enums_1.triggerClauseType.onKnockOut: {
                    if (this.delay > 0) {
                        this.message = `If Knocked out a healing effect will be triggered`;
                    }
                }
            }
        }
        else {
            if (this.delay > 0) {
                this.message = `In ${this.delay} this character will have its health drained`;
            }
            else {
                this.message = `This character will be drained ${this.value} health`;
            }
        }
    }
}
exports.HealthDrain = HealthDrain;
//# sourceMappingURL=healthRelated.js.map