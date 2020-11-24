import { targetType } from "../../enums"
export class SkillMods {
    private targetMod: targetType

    constructor(params: any) {
        if (params) {
            this.targetMod = params.targetMod
        } else {
            this.targetMod = null
        }
    }

    public setTargetMod(target: targetType) {
        this.targetMod = target;
    }

    public getTargetMod(): targetType {
        return this.targetMod
    }

    public clearTargetMod() {
        this.targetMod = null
    }
}
