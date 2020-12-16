import { effectType } from "../../enums";

export const isHarmful = function(EffectType:effectType):boolean{
    switch(EffectType){
        case effectType.Damage: return true
        case effectType.EnergyRemoval: return true
        case effectType.EnergySteal: return true
        case effectType.EnergyRemoval: return true
        case effectType.HealthDrain: return true
        case effectType.Stun: return true
        case effectType.IncreaseDamageTaken: return true
        case effectType.CooldownIncreasal: return true
        case effectType.None: return true
        default: return false 
    }
}