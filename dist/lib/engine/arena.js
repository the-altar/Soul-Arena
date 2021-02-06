"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arena = void 0;
const classes_1 = require("./classes");
const logger_1 = require("../logger");
const enums_1 = require("./enums");
class Arena {
    constructor() {
        this.players = [];
        this.characters = [];
        this.turnCount = -1;
        this.skillQueue = [];
        this.tempQueue = [];
        this.renewSkillQueue = [];
        this.hasUsedSKill = {};
    }
    addPlayer(player, team, socketClientId) {
        const playerInstance = new classes_1.Player(player);
        playerInstance.clientId = socketClientId;
        let charIndex;
        this.players.push(playerInstance);
        if (this.players.length === 1) {
            const i = Math.floor(Math.random() * (3 + 1));
            this.players[0].increaseEnergyPool(i);
            this.players[0].setMyCharsIndex([0, 1, 2]);
            charIndex = 0;
        }
        else if (this.players.length === 2) {
            this.players[1].setMyCharsIndex([3, 4, 5]);
            charIndex = 3;
        }
        for (let c of team) {
            this.characters.push(new classes_1.Character(c, player.id, this, charIndex));
            const index = this.characters.length - 1;
            playerInstance.myCharsRealId.push(this.characters[index].literalId);
            if (index < 3) {
                this.characters[index].setEnemies([3, 4, 5]);
                switch (index) {
                    case 0:
                        {
                            this.characters[index].setAllies([1, 2]);
                        }
                        break;
                    case 1:
                        {
                            this.characters[index].setAllies([0, 2]);
                        }
                        break;
                    case 2:
                        {
                            this.characters[index].setAllies([0, 1]);
                        }
                        break;
                }
            }
            else {
                this.characters[index].setEnemies([0, 1, 2]);
                switch (index) {
                    case 3:
                        {
                            this.characters[index].setAllies([4, 5]);
                        }
                        break;
                    case 4:
                        {
                            this.characters[index].setAllies([3, 5]);
                        }
                        break;
                    case 5:
                        {
                            this.characters[index].setAllies([3, 4]);
                        }
                        break;
                }
            }
            charIndex++;
        }
    }
    processTurn(energySpent) {
        const player = this.players[this.turnCount % 2];
        if (!energySpent)
            return;
        player.consumeEnergy(energySpent);
        player.resetPayupCart();
    }
    lockPlayers() {
        const currentPlayer = this.players[((this.turnCount % 2) + 1) % 2];
        currentPlayer.locked = true;
        const nextPlayer = this.players[this.turnCount % 2];
        nextPlayer.locked = false;
    }
    startGame() {
        //log.info("- [START] increase turn");
        const currentPlayer = this.players[((this.turnCount % 2) + 1) % 2];
        const nextPlayer = this.players[this.turnCount % 2];
        currentPlayer.turnCount++;
        currentPlayer.setTurn(false);
        nextPlayer.setTurn(true);
        this.clearEffectsStack(currentPlayer, nextPlayer);
        //console.log("End player phase for: " + player2.getId())
        /*log.info(
          `- [GAME] Ending ${currentPlayer.username}'s turn (decrease cooldowns, clear buffs and debuffs)`
        );*/
        this.clearCharactersNotifications();
        //log.info("- [GAME] Executing old skills");
        this.executeSkills();
        //log.info("- [GAME] Executing new skills");
        this.executeNewSkills();
        //log.info("- [GAME] Tick skills in queue");
        this.tickSkillsInQueue();
        this.hasUsedSKill = {};
        //log.info(`- [END] start ${nextPlayer.username}'s turn`);
        const bCount1 = this.endPlayerPhase(currentPlayer);
        const bCount2 = this.startPlayerPhase(nextPlayer);
        if (bCount1 === 3)
            return this.gameOver(nextPlayer, currentPlayer);
        if (bCount2 === 3)
            return this.gameOver(currentPlayer, nextPlayer);
        return false;
    }
    executeNewSkills() {
        const list = this.tempQueue;
        for (const s of this.renewSkillQueue) {
            s.executeInitEffects();
        }
        this.renewSkillQueue = [];
        for (const cordinates of list) {
            const char = this.characters[cordinates.caster];
            char.setSkillCooldownByIndex(cordinates.skill);
            if (cordinates.cancelled)
                continue;
            const skill = char.getCopySkillByIndex(cordinates.skill);
            skill.setTargets(cordinates.targets);
            skill.executeInitEffects();
            this.skillQueue.push(skill);
        }
        this.tempQueue = [];
    }
    tickSkillsInQueue() {
        for (let i = this.skillQueue.length - 1; i >= 0; i--) {
            const skill = this.skillQueue[i];
            const cancelled = skill.isCancelled();
            const terminate = skill.tickEffectsDuration(this, skill);
            if (terminate || cancelled) {
                this.skillQueue.splice(i, 1);
                continue;
            }
            const validated = skill.areTargetsValidated();
            if (!validated || cancelled) {
                this.skillQueue.splice(i, 1);
                continue;
            }
        }
    }
    executeSkills() {
        for (const skill of this.skillQueue) {
            if (skill.persistence === enums_1.ControlType.Control ||
                skill.persistence === enums_1.ControlType.Action)
                this.renewSkillQueue.push(skill);
            //.log("---> Executing: " + skill.name)
            else
                skill.executeEffects();
        }
    }
    getCharactersByIndex(indexes) {
        const chars = [];
        for (const index of indexes) {
            chars.push(this.characters[index]);
        }
        return chars;
    }
    getCharactersLiteralIdByIndex(indexes) {
        const dex = new Set();
        const groups = new Set();
        const dexHeadCount = {};
        const groupHeadCount = {};
        for (const index of indexes) {
            if (!this.characters[index])
                continue;
            const char = this.characters[index];
            if (dex.has(char.dexNumber)) {
                dexHeadCount[char.dexNumber]++;
            }
            else {
                dex.add(char.dexNumber);
                dexHeadCount[char.dexNumber] = 1;
            }
            this.characters[index].getTyping().forEach((e) => {
                if (groups.has(e)) {
                    groupHeadCount[e]++;
                }
                else {
                    groups.add(e);
                    groupHeadCount[e] = 1;
                }
            });
        }
        return {
            ids: dex,
            groups: groups,
            groupHeadCount: groupHeadCount,
            idsHeadCount: dexHeadCount,
        };
    }
    getCharacterIdByIndexes(indexes) {
        const chars = [];
        for (const index of indexes) {
            chars.push(this.characters[index].getId());
        }
        return chars;
    }
    getChallengerLiteralIds(myIndexes) {
        let indexes;
        if (!myIndexes.includes(1))
            indexes = [0, 1, 2];
        else
            indexes = [3, 4, 5];
        const dex = new Set();
        const groups = new Set();
        const dexHeadCount = {};
        const groupHeadCount = {};
        for (const index of indexes) {
            if (!this.characters[index])
                continue;
            const char = this.characters[index];
            if (dex.has(char.dexNumber)) {
                dexHeadCount[char.dexNumber]++;
            }
            else {
                dex.add(char.dexNumber);
                dexHeadCount[char.dexNumber] = 1;
            }
            this.characters[index].getTyping().forEach((e) => {
                if (groups.has(e)) {
                    groupHeadCount[e]++;
                }
                else {
                    groups.add(e);
                    groupHeadCount[e] = 1;
                }
            });
        }
        return {
            ids: dex,
            groups: groups,
            groupHeadCount: groupHeadCount,
            idsHeadCount: dexHeadCount,
        };
    }
    removeSkillFromTempQueue(cordinates) {
        const char = this.characters[cordinates.caster];
        const id = char.getOwner();
        const s = char.skills[cordinates.skill];
        const { player, index } = this.findPlayerById(id);
        player.returnEnergy(s.getCost());
        player.removeFromPayupCart(s.getCost());
        this.hasUsedSKill[cordinates.caster] = false;
        this.validateTeamCosts(index);
        const r = this.tempQueue.findIndex((s) => {
            return s.caster === cordinates.caster && s.skill === cordinates.skill;
        });
        this.tempQueue.splice(r, 1);
        return {
            tempQueue: this.tempQueue,
            characters: this.publicCharactersData(),
            energyPool: player.getEnergyPool(),
            payupCart: player.getPayupCart(),
            playerIndex: index,
        };
    }
    timeOutTempQueue() {
        const currentPlayer = this.players[((this.turnCount % 2) + 1) % 2];
        for (const coordinate of this.tempQueue) {
            const char = this.characters[coordinate.caster];
            const s = char.skills[coordinate.skill];
            currentPlayer.returnEnergy(s.getCost());
            this.hasUsedSKill[coordinate.caster] = false;
        }
        this.tempQueue = [];
        currentPlayer.resetPayupCart();
    }
    addSkillToTempQueue(cordinates) {
        const char = this.characters[cordinates.caster];
        if (char === undefined) {
            console.log("invalid request [arena.ts])");
            return;
        }
        const id = char.getOwner();
        const s = char.skills[cordinates.skill];
        const { player, index } = this.findPlayerById(id);
        player.consumeEnergy(s.getCost());
        player.addToPayupCart(s.getCost());
        char.disableSkills();
        this.hasUsedSKill[cordinates.caster] = true;
        this.validateTeamCosts(index);
        this.tempQueue.push({
            caster: cordinates.caster,
            skill: cordinates.skill,
            targets: s.getValidatedTargets(cordinates.target),
        });
        return {
            tempQueue: this.tempQueue,
            energyPool: player.getEnergyPool(),
            characters: this.publicCharactersData(),
            payupCart: player.getPayupCart(),
            playerIndex: index,
        };
    }
    findCharacterById(id) {
        for (let i in this.characters) {
            const char = this.characters[i];
            if (char.getId() === id)
                return {
                    char,
                    index: Number(i),
                };
        }
    }
    findPlayerByCharacterIndex(index) {
        const { char } = this.findCharacterById(index);
        for (const player of this.players) {
            if (char.belongsTo(player.getId()))
                return player;
        }
    }
    findPlayerByChar(char) {
        for (const player of this.players) {
            if (char.belongsTo(player.getId()))
                return player;
        }
    }
    clearEffectsStack(player, player2) {
        for (const i of player.getMyCharsIndex()) {
            const c = this.characters[i];
            c.buffs.clearCooldownReduction();
            c.buffs.clearDecreaseDamageTaken();
            c.buffs.clearAbsorbDamage();
            c.buffs.clearDamageIncreasal();
            c.buffs.clearIgnoreHarmfulEffects();
            c.buffs.clearInvulnerability();
            c.buffs.cannotBeKilled = false;
            c.buffs.validateDD();
            c.clearDebuffs();
            c.skillStack.clearStack();
            c.effectStack.clearStack();
        }
        for (const i of player2.getMyCharsIndex()) {
            const c = this.characters[i];
            c.getDebuffs().clearStuns();
            c.getBuffs().clearIgnoreHarmfulEffects();
            c.getBuffs().clearDecreaseDamageTaken();
            c.effectStack.clearStack();
        }
    }
    clearSkillMods(p) {
        logger_1.log.info("cleared skill mods");
        const arr = p.getMyCharsIndex();
        for (const i of arr) {
            this.characters[i].clearSkillMods();
        }
    }
    endPlayerPhase(player) {
        let bodyCount = 0;
        //console.log("-> clearing debuff, lowering cooldowns and increase energy pool")
        for (const i of player.getMyCharsIndex()) {
            const c = this.characters[i];
            if (c && !c.isKnockedOut()) {
                c.lowerCooldowns(c);
                const energyIndex = c.generateEnergy();
                player.increaseEnergyPool(energyIndex);
            }
            else {
                bodyCount++;
            }
        }
        return bodyCount;
    }
    startPlayerPhase(player) {
        const myChar = player.getMyCharsIndex();
        const pool = player.getEnergyPool();
        let bodyCount = 0;
        //console.log("-> validating skils and clearing buffs")
        for (const i of myChar) {
            const c = this.characters[i];
            if (!c.isKnockedOut()) {
                c.buffs.clearHarmfulInvulnerability();
                c.validadeSkillsCompletely(pool, this.characters, player.getId(), i);
                //log.info(`[${c.name}] Effect stack and buffs have been cleared`);
            }
            else {
                bodyCount++;
            }
        }
        return bodyCount;
    }
    validateTeamCosts(index) {
        const playerId = this.players[index].getId();
        const pool = this.players[index].getEnergyPool();
        this.characters.forEach((c, i) => {
            if (c.belongsTo(playerId) && !this.hasUsedSKill[i] && !c.isKnockedOut()) {
                c.validateSkillsCost(pool);
            }
        });
    }
    getClientData() {
        const publicSkillQueue = [];
        for (const skill of this.skillQueue) {
            publicSkillQueue.push(skill.getPublicData());
        }
        for (const skill of this.renewSkillQueue) {
            publicSkillQueue.push(skill.getPublicData());
        }
        return {
            players: this.players,
            characters: this.publicCharactersData(),
            skillQueue: publicSkillQueue,
        };
    }
    findPlayerById(id) {
        for (let i = 0; i < 2; i++) {
            if (this.players[i].getId() === id) {
                return {
                    player: this.players[i],
                    index: i,
                };
            }
        }
    }
    getTempSkills() {
        return this.tempQueue;
    }
    clearCharactersNotifications() {
        for (const char of this.characters) {
            char.clearNotifications();
        }
    }
    getClientsLength() {
        return this.players.length;
    }
    surrender(surrenderer) {
        const player1 = this.players[this.turnCount % 2];
        const player2 = this.players[((this.turnCount % 2) + 1) % 2];
        if (player2.getId() === surrenderer) {
            this.winner = player1;
            this.loser = player2;
        }
        else {
            this.winner = player2;
            this.loser = player1;
        }
    }
    getActiveSkills() {
        return this.skillQueue;
    }
    gameOver(winner, loser) {
        this.winner = winner;
        this.loser = loser;
        return true;
    }
    exchangeEnergyPool(replace) {
        const player = this.players[this.turnCount % 2];
        player.energyPool = replace;
        this.validateTeamCosts(this.turnCount % 2);
        return {
            playerIndex: this.turnCount % 2,
            energyPool: player.energyPool,
            characters: this.publicCharactersData(),
        };
    }
    publicCharactersData() {
        const publicChar = [];
        for (const char of this.characters) {
            publicChar.push(char.getPublicData());
        }
        return publicChar;
    }
    isPlayerLocked(initiator) {
        for (const p of this.players) {
            if (p.clientId === initiator && p.locked)
                return p.locked;
        }
    }
}
exports.Arena = Arena;
//# sourceMappingURL=arena.js.map