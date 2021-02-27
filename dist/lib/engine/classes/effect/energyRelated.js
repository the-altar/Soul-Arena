"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergySteal = exports.EnergyRemoval = exports.EnergyGain = void 0;
const base_1 = require("./base");
const enums_1 = require("../../enums");
class EnergyGain extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.energyType = data.energyType;
    }
    functionality(char, origin) {
        if (char.getDebuffs().ignoreBenefitialEffects)
            return;
        const p = this.arenaReference.findPlayerByCharacterIndex(this.caster);
        let index;
        if (this.energyType === enums_1.CostTypes.Random)
            index = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
        else
            index = this.energyType;
        p.increaseEnergyPool(index, this.value);
    }
    generateToolTip() {
        if (this.triggerClause !== enums_1.triggerClauseType.None && !this.triggered) {
            switch (this.triggerClause) {
                case enums_1.triggerClauseType.onKnockOut: {
                    this.message = `If Knocked out a PP gain effect will be triggered`;
                }
            }
        }
        else {
            this.message = `This character will gain ${this.value} extra reiatsu`;
        }
    }
}
exports.EnergyGain = EnergyGain;
class EnergyRemoval extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.energyType = data.energyType;
    }
    functionality(char, origin) {
        if (char.getBuffs().ignoreHarmfulEffects.status)
            return;
        const p = this.arenaReference.findPlayerByChar(char);
        if (this.triggerClause === enums_1.triggerClauseType.IfTargeted) {
            for (const cordinate of this.arenaReference.tempQueue) {
                const isTargeted = this.arenaReference
                    .getCharacterIdByIndexes(cordinate.targets)
                    .includes(char.getId());
                const targetedBy = this.arenaReference.characters[cordinate.caster].skills[cordinate.skill].getId();
                if (isTargeted && origin.getId() !== targetedBy)
                    this.apply(null, null, p);
            }
        }
        else {
            this.apply(null, null, p);
        }
    }
    generateToolTip() {
        if (this.triggerClause === enums_1.triggerClauseType.None) {
            this.message = `This character will lose ${this.value} ${enums_1.ReiatsuTypes[this.energyType]} reiatsu`;
        }
        else if (this.triggerClause === enums_1.triggerClauseType.IfTargeted) {
            this.message = `If this character is targeted by a new skill they'll lose ${this.value} ${enums_1.ReiatsuTypes[this.energyType]} reiatsu`;
        }
    }
    apply(char, origin, p) {
        let index;
        if (this.energyType === enums_1.ReiatsuTypes.Random && p.getEnergyPool()[4] > 0) {
            do {
                index = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
            } while (p.getEnergyPool()[index] === 0);
        }
        else
            index = this.energyType;
        p.decreaseEnergyPool(index, this.value);
    }
}
exports.EnergyRemoval = EnergyRemoval;
class EnergySteal extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.energyType = data.energyType;
    }
    functionality(char, origin) {
        if (char.getBuffs().ignoreHarmfulEffects.status)
            return;
        const p = this.arenaReference.findPlayerByChar(char);
        if (this.triggerClause === enums_1.triggerClauseType.IfTargeted) {
            for (const cordinate of this.arenaReference.tempQueue) {
                const isTargeted = this.arenaReference
                    .getCharacterIdByIndexes(cordinate.targets)
                    .includes(char.getId());
                const targetedBy = this.arenaReference.characters[cordinate.caster].skills[cordinate.skill].getId();
                if (isTargeted && origin.getId() !== targetedBy)
                    this.apply(null, origin, p);
            }
        }
        else {
            this.apply(null, origin, p);
        }
    }
    generateToolTip() {
        if (this.triggerClause === enums_1.triggerClauseType.None) {
            this.message = `This character will have ${this.value} ${enums_1.ReiatsuTypes[this.energyType]} reiatsu stolen`;
        }
        else if (this.triggerClause === enums_1.triggerClauseType.IfTargeted) {
            this.message = `If this character is targeted by a new skill they'll have ${this.value} ${enums_1.ReiatsuTypes[this.energyType]} reiatsu stolen`;
        }
    }
    apply(char, origin, p) {
        let index;
        const casterP = this.arenaReference.findPlayerByChar(origin.casterReference);
        if (this.energyType === enums_1.ReiatsuTypes.Random && p.getEnergyPool()[4] > 0) {
            do {
                index = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
            } while (p.getEnergyPool()[index] === 0);
        }
        else
            index = this.energyType;
        p.decreaseEnergyPool(index, this.value);
        p.increaseEnergyPool(index, this.value);
    }
}
exports.EnergySteal = EnergySteal;
//# sourceMappingURL=energyRelated.js.map