"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debuffs = void 0;
class Debuffs {
    constructor() {
        this.increaseDamageTaken = {
            byDamage: {},
            bySkillClass: {},
            bySkillId: {}
        };
        this.damageReduction = {
            byDamage: {},
            bySkillClass: {},
            bySkillId: {}
        };
        this.cooldownIncreasal = { any: 0 };
        this.stun = {};
    }
    setCooldownIncreasal(params) {
        const { specific, value } = params;
        if (specific) {
            this.cooldownIncreasal[specific] = value + (0 || this.cooldownIncreasal[specific]);
        }
        else {
            this.cooldownIncreasal.any = value + this.cooldownIncreasal.any;
        }
    }
    getCooldownIncreasal(params) {
        let r = this.cooldownIncreasal.any;
        if (params === undefined)
            return r;
        if (params.specific) {
            if (this.cooldownIncreasal[params.specific])
                r += this.cooldownIncreasal[params.specific];
        }
        return r;
    }
    setStun(params) {
        this.stun[params.specific] = true;
    }
    isStunned(params) {
        if (this.stun[params])
            return true;
        return false;
    }
    clearDebuffs() {
        this.damageReduction = {
            byDamage: {},
            bySkillClass: {},
            bySkillId: {}
        };
        this.cooldownIncreasal = { any: 0 };
        this.increaseDamageTaken = {
            byDamage: {},
            bySkillClass: {},
            bySkillId: {}
        };
        this.stun = {};
    }
}
exports.Debuffs = Debuffs;
//# sourceMappingURL=debuffs.js.map