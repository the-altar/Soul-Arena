"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyRemoval = exports.EnergyGain = void 0;
const base_1 = require("./base");
const enums_1 = require("../../enums");
class EnergyGain extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.energyType = data.energyType;
    }
    functionality(char, origin, world) {
        this.triggered = true;
        const p = world.findPlayerByCharacterIndex(this.caster);
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
            if (this.delay > 0) {
                this.message = `In ${this.delay} turns this character will gain ${this.value} extra PP`;
            }
            else {
                this.message = `This character will gain ${this.value} extra PP`;
            }
        }
    }
}
exports.EnergyGain = EnergyGain;
class EnergyRemoval extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.energyType = data.energyType;
    }
    functionality(char, origin, world) {
        const p = world.findPlayerByChar(char);
        if (this.triggerClause === enums_1.triggerClauseType.IfTargeted) {
            for (const cordinate of world.tempQueue) {
                const isTargeted = world.getCharacterIdByIndexes(cordinate.targets).includes(char.getId());
                const targetedBy = world.characters[cordinate.caster].skills[cordinate.skill].getId();
                if (isTargeted && origin.getId() !== targetedBy)
                    this.apply(p);
            }
        }
        else {
            this.apply(p);
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
    apply(p) {
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
//# sourceMappingURL=energyRelated.js.map