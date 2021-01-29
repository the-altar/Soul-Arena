"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.targetSetter = void 0;
const enums_1 = require("../../enums");
const logger_1 = require("../../../logger");
exports.targetSetter = function (skill, targetMode, characters, playerId, self) {
    let choices = {};
    choices.choice = [];
    choices.auto = [];
    try {
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
            case enums_1.targetType.OneAllyAndSelf: {
                const allies = characters[self].getAllies();
                allies.forEach((i) => {
                    if (validTarget(characters[i], skill))
                        choices.choice.push(i);
                });
                choices.auto.push(self);
                return choices;
            }
            case enums_1.targetType.OneAllyOrSelfAndSelf: {
                const allies = characters[self].getAllies();
                choices.choice.push(self);
                allies.forEach((i) => {
                    if (validTarget(characters[i], skill))
                        choices.choice.push(i);
                });
                choices.auto.push(self);
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
            case enums_1.targetType.AllAny: {
                characters.forEach((char, index) => {
                    if (validTarget(char, skill))
                        choices.choice.push(index);
                });
                return choices;
            }
            case enums_1.targetType.AllAnyAndSelf: {
                const allies = characters[self].getAllies();
                const enemies = characters[self].getEnemies();
                allies.concat(enemies).forEach((char) => {
                    if (validTarget(characters[char], skill))
                        choices.choice.push(char);
                });
                choices.auto.push(self);
                return choices;
            }
            case enums_1.targetType.AllAnyExceptSelf: {
                const allies = characters[self].getAllies();
                const enemies = characters[self].getEnemies();
                allies.concat(enemies).forEach((char) => {
                    if (validTarget(characters[char], skill))
                        choices.choice.push(char);
                });
                return choices;
            }
            case enums_1.targetType.Self: {
                if (validTarget(characters[self], skill))
                    choices.choice.push(self);
                return choices;
            }
        }
    }
    catch (e) {
        logger_1.log.error(e);
    }
};
function validTarget(char, skill) {
    const isInvulnerable = char.isInvulnerable(skill);
    try {
        if (char.isKnockedOut())
            return false;
        if (!skill.ignoresInvulnerability && isInvulnerable)
            return false;
        if (skill.requiresSkillOnTarget.length &&
            !char.skillStack.isTargetOf(skill.requiresSkillOnTarget))
            return false;
        return true;
    }
    catch (e) {
        logger_1.log.error(e);
        return false;
    }
}
//# sourceMappingURL=targetValidationFactory.js.map