"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncreaseHealthHealed = exports.IgnoreDeath = exports.HealthDrain = exports.Healing = void 0;
const damageRelated_1 = require("./damageRelated");
const base_1 = require("./base");
const enums_1 = require("../../enums");
class Healing extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
    }
    functionality(char, origin) {
        if (char.getDebuffs().ignoreBenefitialEffects)
            return;
        const buff = char.buffs.increaseHealthHealed.bySkillId[origin.id] || 0;
        const hp = char.geHitPoints() + this.value + buff;
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
    functionality(character, origin) {
        if (character.getBuffs().ignoreHarmfulEffects.status)
            return;
        const reduction = this.getDamageReductionFromCaster(this.caster, this, origin);
        let damage = this.value - reduction;
        if (damage < 0)
            damage = 0;
        const hp = character.geHitPoints() - Math.round(damage / 5) * 5;
        character.setHitPoints(hp);
        const { char } = this.arenaReference.findCharacterById(this.caster);
        if (char.isKnockedOut())
            return;
        char.setHitPoints(char.geHitPoints() + Math.round(damage / 5) * 5);
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
class IgnoreDeath extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
    }
    functionality(character, origin) {
        if (character.getDebuffs().ignoreBenefitialEffects)
            return;
        character.getBuffs().cannotBeKilled = true;
    }
    generateToolTip() {
        this.message = this.message || "This character cannot be killed";
    }
}
exports.IgnoreDeath = IgnoreDeath;
class IncreaseHealthHealed extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.skillType = data.skillType || false;
        this.specificSkill = data.specificSkill || false;
    }
    functionality(char, origin) {
        let blocked = false;
        blocked = char.getDebuffs().ignoreBenefitialEffects;
        const buff = char.getBuffs().increaseHealthHealed;
        if (blocked) {
            if (this.specificSkill) {
                this.specificSkillName = this.arenaReference
                    .findCharacterById(this.caster)
                    .char.findSkillById(this.specificSkill).name;
            }
            return;
        }
        if (this.skillType) {
            buff.bySkillClass[this.skillType] =
                (buff.bySkillClass[this.skillType] || 0) + this.value;
        }
        else if (this.specificSkill) {
            buff.bySkillId[this.specificSkill] =
                (buff.bySkillId[this.specificSkill] || 0) + this.value;
            this.specificSkillName = this.arenaReference
                .findCharacterById(this.caster)
                .char.findSkillById(this.specificSkill).name;
        }
    }
    generateToolTip() {
        if (this.skillType) {
            this.message = `This character will be healed ${this.value} more health by ${enums_1.SkillClassType[this.skillType]} skills`;
        }
        else if (this.specificSkill) {
            this.message = `'${this.specificSkillName}' will heal ${this.value} more health`;
        }
    }
}
exports.IncreaseHealthHealed = IncreaseHealthHealed;
//# sourceMappingURL=healthRelated.js.map