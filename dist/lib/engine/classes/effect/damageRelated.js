"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IgnoreDecreaseDamageTaken = exports.AbsorbDamage = exports.DecreaseDamageTaken = exports.IncreaseDamageTaken = exports.DamageIncreasal = exports.DamageReduction = exports.Damage = void 0;
const base_1 = require("./base");
const enums_1 = require("../../enums");
class Damage extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.damageType = data.damageType;
    }
    functionality(char, origin) {
        switch (this.triggerClause) {
            case enums_1.triggerClauseType.None:
                {
                    this.apply(char, origin);
                }
                break;
            case enums_1.triggerClauseType.IfAlliesUseASkill:
                {
                    const allies = char.getAllies();
                    for (const cord of this.arenaReference.tempQueue) {
                        if (allies.includes(cord.caster)) {
                            this.apply(char, origin);
                        }
                    }
                }
                break;
            default:
                this.apply(char, origin);
        }
    }
    getIncreasedDamageFromCaster(caster, effect, skill) {
        const effectCaster = this.arenaReference.findCharacterById(caster).char;
        const buff = effectCaster.getBuffs().damageIncreasal;
        const c = buff.byDamage[effect.damageType] || 0;
        const d = buff.bySkillId[skill.getId()] || 0;
        const e = buff.bySkillClass[skill.class] || 0;
        return c + d + e;
    }
    getDamageReductionFromCaster(caster, effect, skill) {
        const effectCaster = this.arenaReference.findCharacterById(caster).char;
        const buff = effectCaster.getDebuffs().damageReduction;
        const c = buff.byDamage[effect.damageType] || 0;
        const d = buff.bySkillId[skill.getId()] || 0;
        const e = buff.bySkillClass[skill.class] || 0;
        return c + d + e;
    }
    getIncreasedDamageTaken(char, effect, skill) {
        const c = char.getDebuffs().increaseDamageTaken.byDamage[effect.damageType] || 0;
        const d = char.getDebuffs().increaseDamageTaken.bySkillId[skill.getId()] || 0;
        const e = char.getDebuffs().increaseDamageTaken.bySkillClass[skill.class] || 0;
        return c + d + e;
    }
    destroyDestructibleDefense(char, damage) {
        const dd_effect_list = char.getBuffs().destructibleDefense;
        if (damage <= 0)
            return;
        for (const key in dd_effect_list) {
            const dd_effect = dd_effect_list[key];
            const stack = dd_effect.value;
            dd_effect.value = Math.max(0, dd_effect.value - damage);
            damage = Math.max(0, damage - stack);
            if (damage === 0)
                return 0;
        }
        return damage;
    }
    generateToolTip() {
        const damageVal = Number(this.altValue) || this.value;
        switch (this.triggerClause) {
            case enums_1.triggerClauseType.None: {
                this.message = `This character will take ${damageVal} damage`;
                break;
            }
            case enums_1.triggerClauseType.IfAlliesUseASkill: {
                this.message = `This character will take ${damageVal} damage if their allies use a new skill`;
            }
        }
    }
    apply(char, origin) {
        const reduction = this.getDamageReductionFromCaster(this.caster, this, origin);
        const increasalTaken = this.getIncreasedDamageTaken(char, this, origin);
        const increasalDealt = this.getIncreasedDamageFromCaster(this.caster, this, origin);
        let { decreased } = char.getBuffs().getDecreaseDamageTaken({
            damageType: this.damageType,
            skillType: origin.class,
        });
        if (char.getDebuffs().ignoreDecreaseDamageTaken)
            decreased = 0;
        const { conversionRate } = char.getBuffs().getAbsorbDamage({
            skillType: origin.class,
            damageType: this.damageType,
        });
        let damage = Number(this.altValue) || this.value;
        damage = damage - (reduction + decreased - increasalTaken - increasalDealt);
        damage = this.destroyDestructibleDefense(char, damage);
        const absorbed = damage * (conversionRate / 100);
        const hp = char.geHitPoints() - damage + Math.round(absorbed / 5) * 5;
        char.setHitPoints(hp);
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
    functionality(char, origin) {
        const buff = char.getDebuffs().damageReduction;
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
        else if (this.damageType) {
            buff.byDamage[this.damageType] =
                (buff.byDamage[this.damageType] || 0) + this.value;
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
    functionality(char, origin) {
        const buff = char.getBuffs().damageIncreasal;
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
        else if (this.damageType) {
            buff.byDamage[this.damageType] =
                (buff.byDamage[this.damageType] || 0) + this.value;
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
    functionality(char, origin) {
        const debuff = char.getDebuffs().increaseDamageTaken;
        if (this.skillType) {
            debuff.bySkillClass[this.skillType] =
                (debuff.bySkillClass[this.skillType] || 0) + this.value;
        }
        else if (this.specificSkill) {
            debuff.bySkillId[this.specificSkill] =
                (debuff.bySkillId[this.specificSkill] || 0) + this.value;
            this.specificSkillName = this.arenaReference
                .findCharacterById(this.caster)
                .char.findSkillById(this.specificSkill).name;
        }
        else if (this.damageType) {
            debuff.byDamage[this.damageType] =
                (debuff.byDamage[this.damageType] || 0) + this.value;
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
            buffType: enums_1.BuffTypes.DecreaseDamageTaken,
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
            buffType: enums_1.BuffTypes.AbsorbDamage,
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
class IgnoreDecreaseDamageTaken extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
    }
    functionality(char, origin) {
        char.getDebuffs().ignoreDecreaseDamageTaken = true;
    }
    generateToolTip() {
        this.message = "This character cannot reduce damage";
    }
}
exports.IgnoreDecreaseDamageTaken = IgnoreDecreaseDamageTaken;
//# sourceMappingURL=damageRelated.js.map