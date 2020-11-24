import mongoose from 'mongoose'
export const Schema = mongoose.Schema
export const ObjectId = mongoose.SchemaTypes.ObjectId
export const Mixed = mongoose.SchemaTypes.Mixed

export interface ICharacterModel extends mongoose.Document {
    name: string;
    banner: string;
    released: boolean;
    facepic: string;
    dexNumber: number;
    type: Array<number>;
    energyGain: Array<Number>;
    hitPoints: Number;
    description: String;
    skills: Array<ISkill>
}

interface ISkill {
    banner: string;
    name: string;
    skillpic: string;
    type: Array<number>;
    startCooldown: number;
    baseCooldown: number;
    class: string;
    cost:Array<number>;
    description: string;
    disabled: boolean;
    energyGain: Array<number>;
    limit?:number 
} 

const schema = new Schema({
    "name": {
        "type": String
    },
    "banner": String,
    "dexNumber":Number,
    "released": Boolean,
    "facepic": {
        "type": String
    },
    "type": [],
    "energyGain": [],
    "hitPoints": {
        "type": Number
    },
    "description": {
        "type": String
    },
    "skills": {
        "type": [
            Schema.Types.Mixed
        ]
    }
})

export const CharacterDB = mongoose.model<ICharacterModel>('character', schema)

