"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbsorbDamage = exports.DecreaseDamageTaken = exports.IncreaseDamageTaken = exports.DamageIncreasal = exports.DamageReduction = exports.Damage = void 0;
const base_1 = require("./base");
const enums_1 = require("../../enums");
class Damage extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.damageType = data.damageType;
    }
    functionality(char, origin, world) {
        const reduction = this.getDamageReductionFromCaster(this.caster, this, origin, world);
        const increasalTaken = this.getIncreasedDamageTaken(char, this, origin);
        const increasalDealt = this.getIncreasedDamageFromCaster(this.caster, this, origin, world);
        const { decreased } = char.getBuffs().getDecreaseDamageTaken({ damageType: this.damageType, skillType: origin.class });
        const { conversionRate } = char.getBuffs().getAbsorbDamage({ skillType: origin.class, damageType: this.damageType });
        let destructibleDefense = char.getBuffs().destructibleDefense || 0;
        let damageVal = Number(this.altValue) || this.value;
        let damage = (damageVal - ((reduction + decreased) - increasalTaken - increasalDealt));
        if (destructibleDefense > 0) {
            const ogDamage = damage;
            damage -= destructibleDefense;
            damage = Math.max(0, damage);
            char.getBuffs().destructibleDefense = Math.max(0, (destructibleDefense - ogDamage));
        }
        const absorbed = damage * (conversionRate / 100);
        const hp = char.geHitPoints() - damage + Math.round(absorbed / 5) * 5;
        char.setHitPoints(hp);
    }
    getIncreasedDamageFromCaster(caster, effect, skill, world) {
        const effectCaster = world.findCharacterById(caster).char;
        const buff = effectCaster.getBuffs().damageIncreasal;
        const c = buff.byDamage[effect.damageType] || 0;
        const d = buff.bySkillId[skill.getId()] || 0;
        const e = buff.bySkillClass[skill.class] || 0;
        return (c + d + e);
    }
    getDamageReductionFromCaster(caster, effect, skill, world) {
        const effectCaster = world.findCharacterById(caster).char;
        const buff = effectCaster.getDebuffs().damageReduction;
        const c = buff.byDamage[effect.damageType] || 0;
        const d = buff.bySkillId[skill.getId()] || 0;
        const e = buff.bySkillClass[skill.class] || 0;
        return (c + d + e);
    }
    getIncreasedDamageTaken(char, effect, skill) {
        const c = char.getDebuffs().increaseDamageTaken.byDamage[effect.damageType] || 0;
        const d = char.getDebuffs().increaseDamageTaken.bySkillId[skill.getId()] || 0;
        const e = char.getDebuffs().increaseDamageTaken.bySkillClass[skill.class] || 0;
        return (c + d + e);
    }
    generateToolTip() {
        const damageVal = Number(this.altValue) || this.value;
        this.message = `this character will take ${damageVal} damage`;
    }
}
exports.Damage = Damage;
class DamageReduction extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.skillType = data.skillType || false;
        this.damageType = data.damageType || false;
        this.specificSkill = data.specificSkill || false;
    }
    functionality(char, origin, world) {
        const buff = char.getDebuffs().damageReduction;
        if (this.skillType) {
            buff.bySkillClass[this.skillType] = (buff.bySkillClass[this.skillType] || 0) + this.value;
        }
        else if (this.specificSkill) {
            buff.bySkillId[this.specificSkill] = (buff.bySkillId[this.specificSkill] || 0) + this.value;
            this.specificSkillName = world.findCharacterById(this.caster).char.findSkillById(this.specificSkill).name;
        }
        else if (this.damageType) {
            buff.byDamage[this.damageType] = (buff.byDamage[this.damageType] || 0) + this.value;
        }
    }
    generateToolTip() {
        if (this.skillType) {
            this.message = `This character will deal ${this.value} less damage with ${enums_1.SkillClassType[this.skillType]} skills`;
        }
        else if (this.specificSkill) {
            this.message = `'${this.specificSkillName}' will deal ${this.value} less damage`;
        }
        else if (this.damageType) {
            this.message = `This character will deal ${this.value} less ${enums_1.DamageType[this.damageType]} damage`;
        }
    }
}
exports.DamageReduction = DamageReduction;
class DamageIncreasal extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.skillType = data.skillType || false;
        this.damageType = data.damageType || false;
        this.specificSkill = data.specificSkill || false;
    }
    functionality(char, origin, world) {
        const buff = char.getBuffs().damageIncreasal;
        if (this.skillType) {
            buff.bySkillClass[this.skillType] = (buff.bySkillClass[this.skillType] || 0) + this.value;
        }
        else if (this.specificSkill) {
            buff.bySkillId[this.specificSkill] = (buff.bySkillId[this.specificSkill] || 0) + this.value;
            this.specificSkillName = world.findCharacterById(this.caster).char.findSkillById(this.specificSkill).name;
        }
        else if (this.damageType) {
            buff.byDamage[this.damageType] = (buff.byDamage[this.damageType] || 0) + this.value;
        }
    }
    generateToolTip() {
        if (this.skillType) {
            this.message = `This character will deal ${this.value} more damage with ${enums_1.SkillClassType[this.skillType]} skills`;
        }
        else if (this.specificSkill) {
            this.message = `'${this.specificSkillName}' will deal ${this.value} more damage`;
        }
        else if (this.damageType) {
            this.message = `This character will deal ${this.value} more ${enums_1.DamageType[this.damageType]} damage`;
        }
    }
}
exports.DamageIncreasal = DamageIncreasal;
class IncreaseDamageTaken extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.skillType = data.skillType || false;
        this.damageType = data.damageType || false;
        this.specificSkill = data.specificSkill || false;
    }
    functionality(char, origin, world) {
        const debuff = char.getDebuffs().increaseDamageTaken;
        if (this.skillType) {
            debuff.bySkillClass[this.skillType] = (debuff.bySkillClass[this.skillType] || 0) + this.value;
        }
        else if (this.specificSkill) {
            debuff.bySkillId[this.specificSkill] = (debuff.bySkillId[this.specificSkill] || 0) + this.value;
            this.specificSkillName = world.findCharacterById(this.caster).char.findSkillById(this.specificSkill).name;
        }
        else if (this.damageType) {
            debuff.byDamage[this.damageType] = (debuff.byDamage[this.damageType] || 0) + this.value;
        }
    }
    generateToolTip() {
        if (this.skillType) {
            this.message = `This character will take ${this.value} more damage from ${enums_1.SkillClassType[this.skillType]} skills`;
        }
        else if (this.specificSkill) {
            this.message = `${this.specificSkillName} will deal ${this.value} damage to this character`;
        }
        else if (this.damageType) {
            this.message = `${enums_1.DamageType[this.damageType]} damage will deal ${this.value} more damage to this character`;
        }
    }
}
exports.IncreaseDamageTaken = IncreaseDamageTaken;
class DecreaseDamageTaken extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.skillType = data.skillType;
        this.damageType = data.damageType;
    }
    functionality(char, origin) {
        char.setBuff({
            damageType: this.damageType,
            value: this.value,
            skillType: this.skillType,
            buffType: enums_1.BuffTypes.DecreaseDamageTaken
            //class?: SkillClassType;
        });
    }
    generateToolTip() {
        this.message = `This character has ${this.value} points of damage reduction`;
    }
}
exports.DecreaseDamageTaken = DecreaseDamageTaken;
class AbsorbDamage extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.skillType = data.skillType;
        this.damageType = data.damageType;
    }
    functionality(char, origin) {
        char.setBuff({
            damageType: this.damageType,
            value: this.value,
            skillType: this.skillType,
            buffType: enums_1.BuffTypes.AbsorbDamage
            //class?: SkillClassType;
        });
    }
    generateToolTip() {
        if (this.value === 100)
            this.message = `This character takes no damage from ${enums_1.Types[this.skillType]} skills`;
        else
            this.message = `This character will be healed by ${enums_1.Types[this.skillType]} skills`;
    }
}
exports.AbsorbDamage = AbsorbDamage;
//# sourceMappingURL=damageRelated.js.map