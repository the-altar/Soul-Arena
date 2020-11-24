import { Types, DamageType, DebuffTypes, SkillClassType } from "../../enums"

export interface iDebuffParams {
    damageType?: DamageType,
    skillType?: SkillClassType,
    value?: number,
    debuffType?: DebuffTypes
    specific?: number
}

export class Debuffs {
    damageReduction: { byDamage: any, bySkillClass: any, bySkillId: any }
    increaseDamageTaken: { byDamage: any, bySkillClass: any, bySkillId: any }
    cooldownIncreasal: { [x: string]: number }
    stun: { [x: string]: boolean }

    constructor() {
        this.increaseDamageTaken = {
            byDamage: {},
            bySkillClass: {},
            bySkillId: {}
        }
        this.damageReduction = {
            byDamage: {},
            bySkillClass: {},
            bySkillId: {}
        }
        this.cooldownIncreasal = { any: 0 }
        this.stun = {}
    }

    public setCooldownIncreasal(params: iDebuffParams) {
        const { specific, value } = params

        if (specific) {
            this.cooldownIncreasal[specific] = value + (0 || this.cooldownIncreasal[specific])
        } else {
            this.cooldownIncreasal.any = value + this.cooldownIncreasal.any
        }
    }

    public getCooldownIncreasal(params?: any) {
        let r = this.cooldownIncreasal.any
        if (params === undefined) return r
        if (params.specific) {
            if (this.cooldownIncreasal[params.specific])
                r += this.cooldownIncreasal[params.specific]
        }
        return r
    }

    public setStun(params: iDebuffParams) {
        this.stun[params.specific] = true
    }

    public isStunned(params: any): boolean {
        if (this.stun[params]) return true
        return false
    }

    public clearDebuffs() {
        this.damageReduction = {
            byDamage: {},
            bySkillClass: {},
            bySkillId: {}
        }
        this.cooldownIncreasal = { any: 0 }
        this.increaseDamageTaken = {
            byDamage: {},
            bySkillClass: {},
            bySkillId: {}
        }
        this.stun = {}
    }
}