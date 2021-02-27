import { Effect } from "./base";
import { Character } from "../character";
import { Skill } from "../skill";
import { SkillMods } from "../skill/mods";
import { log } from "../../../logger";

export class ReplaceSkill extends Effect {
  private targetSkillId: number;
  private originSkillId: number;
  private modifier: SkillMods;
  constructor(data: any, caster: any) {
    super(data, caster);
    this.targetSkillId = data.targetSkillId;
    this.originSkillId = data.originSkillId;
    this.modifier = null;
  }

  public functionality(char: Character, origin: Skill) {
    const replacement = origin.casterReference.findSkillById(
      this.originSkillId
    );
    if (!replacement) return;

    const replace = char.findSkillById(this.targetSkillId);
    if (!replace) return;

    replace.mods.replacedBy = replacement;
    this.modifier = replace.mods;
  }

  public getPublicData() {
    const publicData = { ...this };
    delete publicData.arenaReference;
    delete publicData.modifier;
    return { ...publicData };
  }

  effectConclusion() {
    try {
      if (this.modifier && this.modifier.replacedBy.id == this.originSkillId)
        this.modifier.replacedBy = null;
    } catch (e) {
      log.error(e);
      this.modifier.replacedBy = null;
    }
  }

  public generateToolTip() {
    this.message = this.message || null;
  }
}
