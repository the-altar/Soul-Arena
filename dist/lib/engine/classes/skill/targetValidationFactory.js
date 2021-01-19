"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.targetSetter = void 0;
const enums_1 = require("../../enums");
exports.targetSetter = function (skill, targetMode, characters, playerId, self) {
    let choices = {};
    choices.choice = [];
    choices.auto = [];
    switch (targetMode) {
        case enums_1.targetType.Any: {
            characters.forEach((char, index) => {
                if (validTarget(char, skill))
                    choices.choice.push(index);
            });
            return choices;
        }
        case enums_1.targetType.OneEnemy: {
            const enemies = characters[self].getEnemies();
            enemies.forEach((i) => {
                if (validTarget(characters[i], skill))
                    choices.choice.push(i);
            });
            return choices;
        }
        case enums_1.targetType.OneEnemyAndSelf: {
            const enemies = characters[self].getEnemies();
            enemies.forEach((i) => {
                if (validTarget(characters[i], skill))
                    choices.choice.push(i);
            });
            choices.auto.push(self);
            return choices;
        }
        case enums_1.targetType.OneAllyAndSelf: {
            const allies = characters[self].getAllies();
            allies.forEach((i) => {
                if (validTarget(characters[i], skill))
                    choices.choice.push(i);
            });
            choices.auto.push(self);
            return choices;
        }
        case enums_1.targetType.AllEnemies: {
            const enemies = characters[self].getEnemies();
            enemies.forEach((i) => {
                if (validTarget(characters[i], skill))
                    choices.choice.push(i);
            });
            return choices;
        }
        case enums_1.targetType.AllAllies: {
            const allies = characters[self].getAllies();
            for (let i of allies) {
                if (validTarget(characters[i], skill))
                    choices.choice.push(i);
            }
            choices.choice.push(self);
            return choices;
        }
        case enums_1.targetType.OneAlly: {
            const allies = characters[self].getAllies();
            for (let i of allies) {
                if (validTarget(characters[i], skill))
                    choices.choice.push(i);
            }
            return choices;
        }
        case enums_1.targetType.OneAllyOrSelf: {
            const allies = characters[self].getAllies();
            choices.choice.push(self);
            for (let i of allies) {
                if (validTarget(characters[i], skill))
                    choices.choice.push(i);
            }
            return choices;
        }
        case enums_1.targetType.AllEnemiesAndSelf: {
            const enemies = characters[self].getEnemies();
            enemies.forEach((i) => {
                if (validTarget(characters[i], skill))
                    choices.choice.push(i);
            });
            choices.auto.push(self);
            return choices;
        }
        case enums_1.targetType.OneEnemyAndAllAllies: {
            const indexes = characters[self].getEnemies();
            for (const i of indexes) {
                if (validTarget(characters[i], skill))
                    choices.choice.push(i);
            }
            const allies = characters[self].getAllies();
            choices.auto = choices.auto.concat(allies);
            choices.auto.push(self);
            return choices;
        }
        case enums_1.targetType.Self: {
            if (validTarget(characters[self], skill))
                choices.choice.push(self);
            return choices;
        }
    }
};
function validTarget(char, skill) {
    const isInvulnerable = char.isInvulnerable(skill);
    if (char.isKnockedOut())
        return false;
    if (isInvulnerable)
        return false;
    if (skill.requiresSkillOnTarget.length && !char.skillStack.isTargetOf(skill.requiresSkillOnTarget))
        return false;
    return true;
}
//# sourceMappingURL=targetValidationFactory.js.map