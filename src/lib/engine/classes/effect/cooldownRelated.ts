import { Effect } from "./base";
import { Character } from "..";
import { DebuffTypes, BuffTypes } from "../../enums";
import { Skill } from "../skill";
import { Arena } from "../../arena";


export class CooldownIncreasal extends Effect {

    private specific?: number

    constructor(data: any, caster: number) {
        super(data, caster)
        this.specific = data.specific
    }

    public functionality(char: Character, origin:Skill) {
        this.triggered = true
        char.setDebuff({
            debuffType: DebuffTypes.CooldownIncreasal,
            value: this.value,
            specific: this.specific
        })
    }

    public generateToolTip(){
        if(this.delay > 0){
            this.message = `Cooldown will be increased by ${this.value} if this character uses a skill in ${this.delay}`
        } else {
            this.message = `If this character uses a skill its cooldown will be increased by ${this.value}` 
        }
    }

}

export class CooldownReduction extends Effect {

    private ofSkillId?: number
    private ofAllSkills?: boolean
    private skillName?:string
    constructor(data: any, caster: number) {
        super(data, caster)
        this.ofSkillId = data.ofSkillId
        this.ofAllSkills = data.ofAllSkills
    }

    public functionality(char: Character, origin:Skill) {
        this.triggered = true
        const cd = char.getBuffs().cooldownReduction
        if(this.ofSkillId) {
            cd.ofSkillId[this.ofSkillId] =  (cd.ofSkillId[this.ofSkillId]||0) + this.value
            this.skillName = char.findSkillById(this.ofSkillId).name
        }
        else if( this.ofAllSkills ) cd.ofAllSkills = this.value
    }

    public generateToolTip(){
        if(this.ofAllSkills) {
            this.message = `If this character uses a skill its ccooldown will be reduced by ${this.value}`
        } else if (this.ofSkillId) {
            this.message = `'${this.skillName}' will have its cooldown reduced by ${this.value}`
        }
    }

}

export class ResetCooldown extends Effect{
    private specificSkill:boolean
    private skillId:number

    constructor(data: any, caster: number) {
        super(data, caster)
        this.specificSkill = data.specificSkill || false
        this.skillId = data.skillId
    }

    public functionality(char: Character, origin:Skill) {
        for(const skill of char.getSkills()){
            if(this.specificSkill && this.skillId !== skill.getId()) continue
            skill.resetCooldown()
        }
    }

    public generateToolTip(){
        this.message = "Active cooldowns will be reset"
    }
}