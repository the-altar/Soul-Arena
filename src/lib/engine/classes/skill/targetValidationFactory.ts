import { Character } from "../character";
import { Skill } from ".";
import { targetType } from "../../enums";
import { log } from "../../../logger";

export const targetSetter = function (
  skill: Skill,
  targetMode: targetType,
  characters: Array<Character>,
  playerId: number,
  self?: number
): { [x: string]: Array<number> } {
  let choices: { [x: string]: Array<number> } = {};
  choices.choice = [];
  choices.auto = [];

  try {
    switch (targetMode) {
      case targetType.Any: {
        characters.forEach((char, index) => {
          if (validTarget(char, skill)) choices.choice.push(index);
        });
        return choices;
      }

      case targetType.OneEnemy: {
        const enemies = characters[self].getEnemies();
        enemies.forEach((i) => {
          if (validTarget(characters[i], skill)) choices.choice.push(i);
        });
        return choices;
      }

      case targetType.OneEnemyAndSelf: {
        const enemies = characters[self].getEnemies();
        enemies.forEach((i) => {
          if (validTarget(characters[i], skill)) choices.choice.push(i);
        });
        choices.auto.push(self);
        return choices;
      }

      case targetType.OneAllyAndSelf: {
        const allies = characters[self].getAllies();
        allies.forEach((i) => {
          if (validTarget(characters[i], skill)) choices.choice.push(i);
        });
        choices.auto.push(self);
        return choices;
      }

      case targetType.AllEnemies: {
        const enemies = characters[self].getEnemies();
        enemies.forEach((i) => {
          if (validTarget(characters[i], skill)) choices.choice.push(i);
        });
        return choices;
      }

      case targetType.AllAllies: {
        const allies = characters[self].getAllies();
        for (let i of allies) {
          if (validTarget(characters[i], skill)) choices.choice.push(i);
        }
        choices.choice.push(self);
        return choices;
      }

      case targetType.OneAlly: {
        const allies = characters[self].getAllies();
        for (let i of allies) {
          if (validTarget(characters[i], skill)) choices.choice.push(i);
        }
        return choices;
      }

      case targetType.OneAllyOrSelf: {
        const allies = characters[self].getAllies();
        choices.choice.push(self);
        for (let i of allies) {
          if (validTarget(characters[i], skill)) choices.choice.push(i);
        }
        return choices;
      }

      case targetType.AllEnemiesAndSelf: {
        const enemies = characters[self].getEnemies();
        enemies.forEach((i) => {
          if (validTarget(characters[i], skill)) choices.choice.push(i);
        });
        choices.auto.push(self);
        return choices;
      }

      case targetType.OneEnemyAndAllAllies: {
        const indexes = characters[self].getEnemies();

        for (const i of indexes) {
          if (validTarget(characters[i], skill)) choices.choice.push(i);
        }
        const allies = characters[self].getAllies();
        choices.auto = choices.auto.concat(allies);
        choices.auto.push(self);
        return choices;
      }

      case targetType.Self: {
        if (validTarget(characters[self], skill)) choices.choice.push(self);
        return choices;
      }
    }
  } catch (e) {
    log.error(e);
  }
};

function validTarget(char: Character, skill: Skill) {
  const isInvulnerable = char.isInvulnerable(skill);
  try {
    if (char.isKnockedOut()) return false;
    if (!skill.ignoresInvulnerability && isInvulnerable) return false;
    if (
      skill.requiresSkillOnTarget.length &&
      !char.skillStack.isTargetOf(skill.requiresSkillOnTarget)
    )
      return false;

    return true;
  } catch (e) {
    log.error(e);
    return false;
  }
}
