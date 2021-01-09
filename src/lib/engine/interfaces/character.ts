import { CharacterTypes } from "../enums";

export interface iCharacter {
    name: string
    facepic: string
    description: string,
    id:number,
    banner: string
    dexNumber:number,
    hitPoints: number
    energyGain: Array<number>
    type: Array<CharacterTypes> 
    skills:Array<any>
}