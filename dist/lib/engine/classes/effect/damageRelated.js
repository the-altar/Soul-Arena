"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IgnoreDecreaseDamageTaken = exports.AbsorbDamage = exports.DecreaseDamageTaken = exports.IncreaseDamageTaken = exports.DamageIncreasal = exports.DamageReduction = exports.Damage = void 0;
const base_1 = require("./base");
const enums_1 = require("../../enums");
const lodash_1 = require("lodash");
/**Deals damage */
class Damage extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.damageType = data.damageType;
    }
    functionality(char, origin) {
        if (char.getBuffs().ignoreHarmfulEffects.status &&
            char.getBuffs().ignoreHarmfulEffects.includeDamage)
            return;
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
        //log.info(`Damage reduction applied on ${effectCaster.name}`);
        //log.info("xxxxxx", effectCaster.getBuffs().ignoreHarmfulEffects);
        if (effectCaster.getBuffs().ignoreHarmfulEffects.status)
            return 0;
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
    getDecreaseDamageTaken(char, effect, skill) {
        const c = char.getBuffs().decreaseDamageTaken.byDamage[effect.damageType] || 0;
        const d = char.getBuffs().decreaseDamageTaken.bySkillId[skill.getId()] || 0;
        const e = char.getBuffs().decreaseDamageTaken.bySkillClass[skill.class] || 0;
        const f = char.getBuffs().decreaseDamageTaken.bySkillClass[enums_1.SkillClassType.Any] || 0;
        return c + d + e + f;
    }
    destroyDestructibleDefense(char, damage) {
        if (char.getDebuffs().ignoreBenefitialEffects)
            return damage;
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
        let reduction = this.getDamageReductionFromCaster(this.caster, this, origin);
        let increasalTaken = this.getIncreasedDamageTaken(char, this, origin);
        let increasalDealt = this.getIncreasedDamageFromCaster(this.caster, this, origin);
        let decreased = this.getDecreaseDamageTaken(char, this, origin);
        if (char.getDebuffs().ignoreDecreaseDamageTaken ||
            this.damageType === enums_1.DamageType.Piercing ||
            this.damageType === enums_1.DamageType.Affliction) {
            decreased = 0;
        }
        const { conversionRate } = char.getBuffs().getAbsorbDamage({
            skillType: origin.class,
            damageType: this.damageType,
        });
        let damage = Number(this.altValue) || this.value;
        damage = damage - (reduction + decreased - increasalTaken - increasalDealt);
        if (this.damageType !== enums_1.DamageType.Affliction) {
            damage = this.destroyDestructibleDefense(char, damage);
        }
        const absorbed = damage * (conversionRate / 100);
        const hp = char.geHitPoints() - damage + Math.round(absorbed / 5) * 5;
        char.setHitPoints(hp);
    }
}
exports.Damage = Damage;
/* [Debuff] Decrease the amount of damage dealt by a character*/
class DamageReduction extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.skillType = data.skillType || false;
        this.damageType = data.damageType || false;
        this.specificSkill = data.specificSkill || false;
    }
    functionality(char, origin) {
        let blocked = false;
        blocked = char.getBuffs().ignoreHarmfulEffects.status;
        const buff = char.getDebuffs().damageReduction;
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
/*[Buff] Increase the amount of damage dealt by a character */
class DamageIncreasal extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.skillType = data.skillType || false;
        this.damageType = data.damageType || false;
        this.specificSkill = data.specificSkill || false;
    }
    functionality(char, origin) {
        let blocked = char.getDebuffs().ignoreBenefitialEffects;
        const buff = char.getBuffs().damageIncreasal;
        if (blocked) {
            if (this.specificSkill)
                this.specificSkillName = this.arenaReference
                    .findCharacterById(this.caster)
                    .char.findSkillById(this.specificSkill).name;
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
/*[Debuff] Increase amount of damage a character takes when targeted */
class IncreaseDamageTaken extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.skillType = data.skillType || false;
        this.damageType = data.damageType || false;
        this.specificSkill = data.specificSkill || false;
    }
    functionality(char, origin) {
        let blocked = char.getBuffs().ignoreHarmfulEffects.status;
        if (blocked) {
            if (this.specificSkill)
                this.specificSkillName = this.arenaReference
                    .findCharacterById(this.caster)
                    .char.findSkillById(this.specificSkill).name;
            return;
        }
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
            this.message = `${this.specificSkillName} will deal ${this.value} more damage to this character`;
        }
        else if (this.damageType) {
            this.message = `${enums_1.DamageType[this.damageType]} damage will deal ${this.value} more damage to this character`;
        }
    }
}
exports.IncreaseDamageTaken = IncreaseDamageTaken;
/*[Buff] Decrease amount of damage dealt to a character when targeted */
class DecreaseDamageTaken extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.skillType = data.skillType;
        this.damageType = data.damageType;
    }
    functionality(char, origin) {
        if (char.getDebuffs().ignoreBenefitialEffects)
            return;
        if (char.getDebuffs().ignoreDecreaseDamageTaken)
            return;
        const dr = char.getBuffs().decreaseDamageTaken;
        if (dr.bySkillClass[enums_1.SkillClassType.Any])
            dr.bySkillClass[enums_1.SkillClassType.Any] += this.value;
        else
            dr.bySkillClass[enums_1.SkillClassType.Any] = this.value;
        if (!this.triggerLinkedEffects.length)
            return;
        for (const linked of this.triggerLinkedEffects) {
            switch (linked.condition) {
                case enums_1.triggerClauseType.IfTargeted:
                    {
                        for (const temp of this.arenaReference.tempQueue) {
                            if (temp.targets.includes(char.myIndex)) {
                                //log.info(`Apply linked effect on ${temp.caster}`);
                                for (let i = 0; i < this.triggerLinkedEffects.length; i++) {
                                    this.applyLinkedEffects(origin, this.caster, [temp.caster], lodash_1.intersection(this.targets, temp.targets), 1, i);
                                }
                            }
                        }
                    }
                    break;
                case enums_1.triggerClauseType.IfTargetedByHarmfulSkill:
                    {
                        for (const temp of this.arenaReference.tempQueue) {
                            const skill = this.arenaReference.characters[temp.caster].skills[temp.skill];
                            for (let i = 0; i < this.triggerLinkedEffects.length; i++) {
                                if (temp.targets.includes(char.myIndex) && skill.isHarmful()) {
                                    this.applyLinkedEffects(origin, this.caster, [temp.caster], lodash_1.intersection(this.targets, temp.targets), 1, i);
                                }
                            }
                        }
                    }
                    break;
            }
        }
        /*log.info(`### applied [REDUCE DAMAGE TAKEN] on ${char.name}`);
        log.info(
          `${char.getBuffs().decreaseDamageTaken.bySkillClass[SkillClassType.Any]}`
        );*/
    }
    generateToolTip() {
        this.message = `This character has ${this.value} points of damage reduction`;
    }
}
exports.DecreaseDamageTaken = DecreaseDamageTaken;
/**[Buff] Convert damage into health at certain ratio */
class AbsorbDamage extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.skillType = data.skillType;
        this.damageType = data.damageType;
    }
    functionality(char, origin) {
        if (char.getDebuffs().ignoreBenefitialEffects)
            return;
        char.setBuff({
            damageType: this.damageType,
            value: this.value,
            skillType: this.skillType,
            buffType: enums_1.BuffTypes.AbsorbDamage,
        });
    }
    generateToolTip() {
        if (this.value === 100)
            this.message = `This character takes no damage from ${enums_1.SkillClassType[this.skillType]} skills`;
        else
            this.message = `This character will be healed by ${enums_1.SkillClassType[this.skillType]} skills`;
    }
}
exports.AbsorbDamage = AbsorbDamage;
/**[Debuff] Makes character unable to reduce damage taken */
class IgnoreDecreaseDamageTaken extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
    }
    functionality(char, origin) {
        if (char.getDebuffs().ignoreBenefitialEffects)
            return;
        char.getDebuffs().ignoreDecreaseDamageTaken = true;
    }
    generateToolTip() {
        this.message = "This character cannot reduce damage";
    }
}
exports.IgnoreDecreaseDamageTaken = IgnoreDecreaseDamageTaken;
//# sourceMappingURL=damageRelated.js.map