import { Character } from ".."
import { Effect } from "./base"
import { Arena } from "../../arena"
import { DebuffTypes } from "../../enums"
import { Skill } from "../skill"


export class Stun extends Effect {
    /* "specific"  refers to a specific skill type. E.g: Fire, Water, Grass...  
    if not specified it this effect should stun a character completely*/
    private stunClass: number
    constructor(data: any, caster: number) {
        super(data, caster)
        this.stunClass = data.stunClass
    }

    public functionality(char: Character, origin:Skill, world?: Arena) {
        char.disableSkills()
        char.setDebuff({
            debuffType: DebuffTypes.Stun,
            specific: this.stunClass
        })
    }

    generateToolTip(){
        this.message = "This character is stunned"
    }
}