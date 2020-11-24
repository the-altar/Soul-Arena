import { Types } from "../enums";

export interface iCharacter {
    name: string
    facepic: string
    description: string,
    id:number,
    banner: string
    hitPoints: number
    energyGain: Array<number>
    type: Array<Types> 
    skills:Array<any>
}