import { Effect } from "./base";
import { effectType, Types } from "../../enums"
import { Character } from "../character";
import { Skill } from "..";
import { Arena } from "../../arena";
import { isHarmful } from "./z.helpers";

export class EffectRemoval extends Effect {
    private harmful: boolean
    private friendly: boolean
    private specificSkillType: Types
    private specificEffect: effectType

    constructor(data: any, caster: number) {
        super(data, caster)
        this.harmful = data.harmful || false
        this.friendly = data.friendly || false
        this.specificEffect = data.specificEffect || -1
        this.specificSkillType = data.specificSkillType || false
    }

    public functionality(char: Character, origin: Skill, world?: Arena) {

        const skills = world.getActiveSkills()
        for (const skill of skills) {
            let wasRemoved = false;
            for (const effect of skill.effects) {
                if (!isHarmful(effect.getType())) continue
                wasRemoved = reduceTargets(effect, char, world)
            }
            if (wasRemoved) skill.removeCharFromTargets(char, world)
        }
    }

    public generateToolTip() {
        if (this.harmful) {
            this.message = 'Harmful effects affecting this character will be removed'
        } else if (this.friendly) {
            this.message = 'Friendly effects affecting this character will be removed'
        } else {
            this.message = "All effects affecting this character will be removed"
        }
    }
}

function reduceTargets(arr: Skill | Effect, char: Character, world: Arena) {

    let targetList = arr.getTargets()

    for (let i = targetList.length - 1; i >= 0; i--) {
        const target = world.getCharactersByIndex([targetList[i]])[0]
        if (target.getId() === char.getId()) {
            targetList.splice(i, 1)
            return true
        }
    }

    return false
}