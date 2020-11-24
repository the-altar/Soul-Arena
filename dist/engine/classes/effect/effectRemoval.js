"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EffectRemoval = void 0;
const base_1 = require("./base");
const z_helpers_1 = require("./z.helpers");
class EffectRemoval extends base_1.Effect {
    constructor(data, caster) {
        super(data, caster);
        this.harmful = data.harmful || false;
        this.friendly = data.friendly || false;
        this.specificEffect = data.specificEffect || -1;
        this.specificSkillType = data.specificSkillType || false;
    }
    functionality(char, origin, world) {
        const skills = world.getActiveSkills();
        for (const skill of skills) {
            let wasRemoved = false;
            for (const effect of skill.effects) {
                if (!z_helpers_1.isHarmful(effect.getType()))
                    continue;
                wasRemoved = reduceTargets(effect, char, world);
            }
            if (wasRemoved)
                skill.removeCharFromTargets(char, world);
        }
    }
    generateToolTip() {
        if (this.harmful) {
            this.message = 'Harmful effects affecting this character will be removed';
        }
        else if (this.friendly) {
            this.message = 'Friendly effects affecting this character will be removed';
        }
        else {
            this.message = "All effects affecting this character will be removed";
        }
    }
}
exports.EffectRemoval = EffectRemoval;
function reduceTargets(arr, char, world) {
    let targetList = arr.getTargets();
    for (let i = targetList.length - 1; i >= 0; i--) {
        const target = world.getCharactersByIndex([targetList[i]])[0];
        if (target.getId() === char.getId()) {
            targetList.splice(i, 1);
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=effectRemoval.js.map