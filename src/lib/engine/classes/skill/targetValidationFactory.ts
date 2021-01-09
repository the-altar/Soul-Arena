import { Character } from "../character";
import { Skill } from ".";
import { targetType } from "../../enums";

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

  switch (targetMode) {
    case targetType.Any: {
      characters.forEach((char, index) => {
        if (!char.isKnockedOut()) {
          const isInvulnerable = char.isInvulnerable(skill);
          if (!isInvulnerable) choices.choice.push(index);
        }
      });
      return choices;
    }

    case targetType.OneEnemy: {
      characters.forEach((char, index) => {
        if (!char.belongsTo(playerId) && !char.isKnockedOut()) {
          const isInvulnerable = char.isInvulnerable(skill);
          if (!isInvulnerable) choices.choice.push(index);
        }
      });
      return choices;
    }

    case targetType.OneEnemyAndSelf: {
      characters.forEach((char, index) => {
        if (!char.belongsTo(playerId) && !char.isKnockedOut()) {
          const isInvulnerable = char.isInvulnerable(skill);
          if (!isInvulnerable) choices.choice.push(index);
        }
      });
      choices.auto.push(self);
      return choices;
    }

    case targetType.OneAllyAndSelf: {
      characters.forEach((char, index) => {
        if (char.belongsTo(playerId) && !char.isKnockedOut()) {
          const isInvulnerable = char.isInvulnerable(skill);
          if (!isInvulnerable) choices.choice.push(index);
        }
      });
      choices.auto.push(self);
      return choices;
    }

    case targetType.AllEnemies: {
      characters.forEach((char, index) => {
        if (!char.belongsTo(playerId) && !char.isKnockedOut()) {
          const isInvulnerable = char.isInvulnerable(skill);
          if (!isInvulnerable) choices.choice.push(index);
        }
      });
      return choices;
    }

    case targetType.AllAllies: {
      const allies = characters[self].getAllies();
      for (let i of allies) {
        const isInvulnerable = characters[i].isInvulnerable(skill);
        if (!isInvulnerable && !characters[i].isKnockedOut())
          choices.choice.push(i);
      }
      choices.choice.push(self);
      return choices;
    }

    case targetType.OneAlly: {
      const allies = characters[self].getAllies();
      for (let i of allies) {
        const isInvulnerable = characters[i].isInvulnerable(skill);
        if (!isInvulnerable && !characters[i].isKnockedOut())
          choices.choice.push(i);
      }
      return choices;
    }

    case targetType.OneAllyOrSelf: {
      const allies = characters[self].getAllies();
      choices.choice.push(self);
      for (let i of allies) {
        const isInvulnerable = characters[i].isInvulnerable(skill);
        if (!isInvulnerable && !characters[i].isKnockedOut())
          choices.choice.push(i);
      }
      return choices;
    }

    case targetType.AllEnemiesAndSelf: {
      characters.forEach((char, index) => {
        if (!char.belongsTo(playerId) && !char.isKnockedOut()) {
          const isInvulnerable = char.isInvulnerable(skill);
          if (!isInvulnerable && !char.isKnockedOut())
            choices.choice.push(index);
        }
      });
      choices.auto.push(self);
      return choices;
    }

    case targetType.OneEnemyAndAllAllies: {
      const indexes = characters[self].getEnemies();

      for (const i of indexes) {
        const isInvulnerable = characters[i].isInvulnerable(skill);
        if (!isInvulnerable && !characters[i].isKnockedOut()) {
          choices.choice.push(i);
        }
      }

      const allies = characters[self].getAllies();

      choices.auto = choices.auto.concat(allies);
      choices.auto.push(self);
      return choices;
    }

    case targetType.Self: {
      const isInvulnerable = characters[self].isInvulnerable(skill);
      if (!isInvulnerable && !characters[self].isKnockedOut())
        choices.choice.push(self);
      return choices;
    }
  }
};
