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
                if (!char.isKnockedOut()) {
                    const isInvulnerable = char.isInvulnerable(skill);
                    if (!isInvulnerable)
                        choices.choice.push(index);
                }
            });
            return choices;
        }
        case enums_1.targetType.OneEnemy: {
            characters.forEach((char, index) => {
                if (!char.belongsTo(playerId) && !char.isKnockedOut()) {
                    const isInvulnerable = char.isInvulnerable(skill);
                    if (!isInvulnerable)
                        choices.choice.push(index);
                }
            });
            return choices;
        }
        case enums_1.targetType.OneEnemyAndSelf: {
            characters.forEach((char, index) => {
                if (!char.belongsTo(playerId) && !char.isKnockedOut()) {
                    const isInvulnerable = char.isInvulnerable(skill);
                    if (!isInvulnerable)
                        choices.choice.push(index);
                }
            });
            choices.auto.push(self);
            return choices;
        }
        case enums_1.targetType.OneAllyAndSelf: {
            characters.forEach((char, index) => {
                if (char.belongsTo(playerId) && !char.isKnockedOut()) {
                    const isInvulnerable = char.isInvulnerable(skill);
                    if (!isInvulnerable)
                        choices.choice.push(index);
                }
            });
            choices.auto.push(self);
            return choices;
        }
        case enums_1.targetType.AllEnemies: {
            characters.forEach((char, index) => {
                if (!char.belongsTo(playerId) && !char.isKnockedOut()) {
                    const isInvulnerable = char.isInvulnerable(skill);
                    if (!isInvulnerable)
                        choices.choice.push(index);
                }
            });
            return choices;
        }
        case enums_1.targetType.AllAllies: {
            const allies = characters[self].getAllies();
            for (let i of allies) {
                const isInvulnerable = characters[i].isInvulnerable(skill);
                if (!isInvulnerable && !characters[i].isKnockedOut())
                    choices.choice.push(i);
            }
            choices.choice.push(self);
            return choices;
        }
        case enums_1.targetType.OneAlly: {
            const allies = characters[self].getAllies();
            for (let i of allies) {
                const isInvulnerable = characters[i].isInvulnerable(skill);
                if (!isInvulnerable && !characters[i].isKnockedOut())
                    choices.choice.push(i);
            }
            return choices;
        }
        case enums_1.targetType.OneAllyOrSelf: {
            const allies = characters[self].getAllies();
            choices.choice.push(self);
            for (let i of allies) {
                const isInvulnerable = characters[i].isInvulnerable(skill);
                if (!isInvulnerable && !characters[i].isKnockedOut())
                    choices.choice.push(i);
            }
            return choices;
        }
        case enums_1.targetType.AllEnemiesAndSelf: {
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
        case enums_1.targetType.OneEnemyAndAllAllies: {
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
        case enums_1.targetType.Self: {
            const isInvulnerable = characters[self].isInvulnerable(skill);
            if (!isInvulnerable && !characters[self].isKnockedOut())
                choices.choice.push(self);
            return choices;
        }
    }
};
//# sourceMappingURL=targetValidationFactory.js.map