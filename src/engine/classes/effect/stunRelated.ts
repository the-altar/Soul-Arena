import { Character } from "..";
import { Effect } from "./base";
import { Arena } from "../../arena";
import { Skill } from "../skill";
import { SkillClassType } from "../../enums";

export class Stun extends Effect {
  /* "specific"  refers to a specific skill type. E.g: Fire, Water, Grass...  
    if not specified it this effect should stun a character completely*/
  private stunClass: SkillClassType;
  constructor(data: any, caster: number) {
    super(data, caster);
    this.stunClass = data.stunClass;
  }

  public functionality(char: Character, origin: Skill, world?: Arena) {
    char.disableSkills();
    char.getDebuffs().stun[this.stunClass] = true;
  }

  generateToolTip() {
    if (this.stunClass === SkillClassType.Any)
      this.message = "This character is stunned";
    else
      this.message = `This character's ${
        SkillClassType[this.stunClass]
      } skills are stunned`;
  }
}
