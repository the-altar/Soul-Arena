"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Battle = void 0;
const colyseus_1 = require("colyseus");
const schema_1 = require("@colyseus/schema");
const engine_1 = require("../../engine");
const results = __importStar(require("../../helpers/battleResults"));
const lodash_1 = require("lodash");
const db_1 = require("../../../db");
const logger_1 = require("../../logger");
class MatchState extends schema_1.Schema {
}
__decorate([
    schema_1.type("string")
], MatchState.prototype, "turnData", void 0);
class Battle extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.arena = new engine_1.Arena();
        this.constructed = 0;
        this.evaluateGroupInterval = 60000;
        this.playerState = {};
    }
    // When room is initialized
    onCreate(options) {
        this.updateMissions = options.updateMissions;
        this.allowMatchCalculations = options.allowMatchCalculations;
        this.roomCode = options.roomCode;
        this.setState(new MatchState());
        this.onMessage("end-game-turn", (client, payload) => __awaiter(this, void 0, void 0, function* () {
            logger_1.log.info(`--- [END TURN] client id: ${client.id}`);
            if (this.arena.isPlayerLocked(client.id)) {
                logger_1.log.info("xxx Player is locked; can't end a turn");
                return;
            }
            logger_1.log.info(" xx [YOU ENDED YOUR TURN] xx");
            this.delay.reset();
            this.arena.processTurn(payload);
            this.lifeCycle();
        }));
        this.onMessage("add-skill-to-queue", (client, cordinates) => {
            const payload = this.arena.addSkillToTempQueue(cordinates);
            client.send("update-temp-queue", payload);
        });
        this.onMessage("remove-skill-from-queue", (client, cordinates) => {
            const payload = this.arena.removeSkillFromTempQueue(cordinates);
            client.send("update-temp-queue", payload);
        });
        this.onMessage("exchange-energypool", (client, payload) => {
            client.send("exchanged-energy", this.arena.exchangeEnergyPool(payload));
        });
        this.onMessage("surrender", (client, id) => __awaiter(this, void 0, void 0, function* () {
            yield this.surrender(id);
        }));
    }
    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth(client, options, request) {
        if (this.constructed >= 2)
            return false;
        return true;
    }
    // When client successfully join the room
    onJoin(client, options, auth) {
        this.arena.addPlayer(options.player, options.team, client.id);
        this.constructed++;
        this.playerState[client.sessionId] = options.player.id;
        if (this.constructed === 2) {
            this.gameClock();
        }
    }
    // When a client leaves the room
    onLeave(client, consented) {
        return __awaiter(this, void 0, void 0, function* () {
            if (consented) {
                return;
            }
            try {
                // Notify ROOM that someone already left
                // allow disconnected client to reconnect into this room until 20 seconds
                yield this.allowReconnection(client, 20);
                // client returned! let's re-activate it.
            }
            catch (e) {
                // 20 seconds expired. let's remove the client.
                const id = this.playerState[client.sessionId];
                yield this.surrender(id);
            }
        });
    }
    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.arena.winner && this.arena.loser)
                try {
                    yield this.updateGameRecords(this.arena.winner, this.arena.loser);
                    if (!this.updateMissions)
                        return;
                    yield this.updateMissionGoals(this.arena.winner, this.arena.loser);
                    if (!this.allowMatchCalculations)
                        return;
                    yield results.updateGameResults(Object.assign(Object.assign({}, this.arena.loser.season), { coins: this.arena.loser.coins, season: 1, id: this.arena.loser.id }));
                    yield results.updateGameResults(Object.assign(Object.assign({}, this.arena.winner.season), { coins: this.arena.winner.coins, season: 1, id: this.arena.winner.id }));
                }
                catch (e) {
                    logger_1.log.error(e);
                }
        });
    }
    gameClock() {
        this.arena.startGame();
        this.state.turnData = JSON.stringify(this.arena.getClientData());
        this.broadcast("game-started", this.arena.getClientData());
        this.delay = this.clock.setInterval(() => {
            logger_1.log.info("[YOU CLOCKED OUT]");
            this.lifeCycle();
            this.state.turnData = JSON.stringify(this.arena.getClientData());
        }, this.evaluateGroupInterval);
    }
    lifeCycle() {
        const isOver = this.arena.startGame();
        this.state.turnData = JSON.stringify(this.arena.getClientData());
        if (isOver) {
            let payload1, payload2;
            if (this.allowMatchCalculations) {
                payload1 = results.matchCalculations(this.arena.winner, this.arena.loser, true);
                payload2 = results.matchCalculations(this.arena.loser, this.arena.winner, false);
            }
            else
                payload1 = payload2 = {};
            this.broadcast("end-game", {
                winner: { playerData: this.arena.winner, results: payload1 },
                loser: { playerData: this.arena.loser, results: payload2 },
            });
        }
    }
    surrender(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.arena.surrender(id);
            let payload1, payload2;
            if (this.allowMatchCalculations) {
                payload1 = results.matchCalculations(this.arena.winner, this.arena.loser, true);
                payload2 = results.matchCalculations(this.arena.loser, this.arena.winner, false);
            }
            else
                payload1 = payload2 = {};
            this.broadcast("end-game", {
                winner: {
                    playerData: Object.assign({}, this.arena.winner),
                    results: Object.assign({}, payload1),
                },
                loser: { playerData: Object.assign({}, this.arena.loser), results: Object.assign({}, payload2) },
            });
        });
    }
    updateMissionGoals(winner, loser) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.updateMissions)
                return;
            const sql = `select
        tm.goals as "trackingGoals",
        tm.mission_id,
        tm.user_id, 
        m2.goals,
        m2.unlocked_entity as entity_id
        from
            tracking_mission tm
        join mission m2 on
            m2.id = tm.mission_id
        where
            tm.user_id = $1 or tm.user_id = $2;`;
            try {
                const res = yield db_1.pool.query(sql, [winner.id, loser.id]);
                for (const data of res.rows) {
                    if (data.user_id === winner.id) {
                        yield this.progressMission(winner, data);
                    }
                    else
                        yield this.breakMissionStreaks(loser, data);
                }
            }
            catch (e) {
                return Promise.reject(e);
            }
        });
    }
    progressMission(player, stats) {
        return __awaiter(this, void 0, void 0, function* () {
            if (player.id < 0)
                return;
            let completeTracks = 0;
            const challenged = this.arena.getCharactersLiteralIdByIndex(player.getMyCharsIndex());
            const challenger = this.arena.getChallengerLiteralIds(player.getMyCharsIndex());
            for (const i in stats.trackingGoals) {
                let goal = stats.trackingGoals[i];
                completeTracks = checkGoalProgression(goal, challenged, challenger, stats, completeTracks, i);
            }
            if (completeTracks === stats.goals.length) {
                const client = yield db_1.pool.connect();
                try {
                    yield client.query("BEGIN");
                    const sql = "INSERT INTO public.completed_mission (mission_id, user_id) VALUES($1, $2);";
                    yield client.query(sql, [stats.mission_id, stats.user_id]);
                    const sql2 = "INSERT INTO public.obtained_entity (entity_id, user_id) VALUES($1, $2);";
                    yield client.query(sql2, [stats.entity_id, stats.user_id]);
                    yield client.query("DELETE FROM tracking_mission where user_id = $1 and mission_id = $2", [stats.user_id, stats.mission_id]);
                    yield client.query("COMMIT");
                }
                catch (e) {
                    yield client.query("ROLLBACK");
                    return Promise.reject(e);
                }
                finally {
                    client.release();
                }
            }
            else if (completeTracks < stats.goals.length) {
                try {
                    const sql = "UPDATE public.tracking_mission SET goals=$3 WHERE user_id=$1 AND mission_id=$2;";
                    yield db_1.pool.query(sql, [
                        stats.user_id,
                        stats.mission_id,
                        JSON.stringify(stats.trackingGoals),
                    ]);
                }
                catch (err) {
                    return Promise.reject(err);
                }
            }
        });
    }
    updateGameRecords(winner, loser) {
        return __awaiter(this, void 0, void 0, function* () {
            const query1 = `INSERT INTO game_stats (winner_id_1, winner_id_2, winner_id_3) VALUES($1, $2, $3);`;
            const query2 = `INSERT INTO game_result (winner_id, loser_id, game_room) VALUES($1, $2, $3);`;
            const query3 = `UPDATE entity SET games_won= games_won + 1 WHERE id=ANY($1)`;
            const query4 = `UPDATE entity SET games_lost= games_lost + 1 WHERE id=ANY($1)`;
            const client = yield db_1.pool.connect();
            const same_ids = lodash_1.intersection(winner.myCharsRealId, loser.myCharsRealId);
            const winnerIds = lodash_1.difference(winner.myCharsRealId, same_ids);
            const loserIds = lodash_1.difference(loser.myCharsRealId, same_ids);
            try {
                yield client.query("BEGIN");
                if (this.allowMatchCalculations) {
                    yield client.query(query1, [winnerIds[0], winnerIds[1], winnerIds[2]]);
                    yield client.query(query3, [winnerIds]);
                    yield client.query(query4, [loserIds]);
                }
                yield client.query(query2, [winner.id, loser.id, this.roomCode]);
                yield client.query("COMMIT");
            }
            catch (e) {
                yield client.query("ROLLBACK");
                logger_1.log.error(e);
            }
            finally {
                client.release();
            }
        });
    }
    breakMissionStreaks(player, stats) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (player.id < 0)
                    return;
                const challenged = this.arena.getCharactersLiteralIdByIndex(player.getMyCharsIndex());
                const challenger = this.arena.getChallengerLiteralIds(player.getMyCharsIndex());
                for (const i in stats.trackingGoals) {
                    const goal = stats.trackingGoals[i];
                    if (goal.completed)
                        continue;
                    if (goal.inRow) {
                        if (goal.with !== -1 && challenged.ids.has(goal.with)) {
                            if (goal.against !== -1 && challenger.ids.has(goal.against))
                                goal.battlesWon = 0;
                            else if (goal.againstGroup !== -1 &&
                                challenger.groups.has(goal.againstGroup))
                                goal.battlesWon = 0;
                        }
                        else if (goal.withGroup !== -1 &&
                            challenged.groups.has(goal.withGroup)) {
                            if (goal.against !== -1 && challenger.ids.has(goal.against))
                                goal.battlesWon = 0;
                            else if (goal.againstGroup !== -1 &&
                                challenger.groups.has(goal.againstGroup))
                                goal.battlesWon = 0;
                        }
                        else if (goal.with === -1 && goal.withGroup === -1) {
                            if (goal.against !== -1 && challenger.ids.has(goal.against))
                                goal.battlesWon = 0;
                            else if (goal.againstGroup !== -1 &&
                                challenger.groups.has(goal.againstGroup))
                                goal.battlesWon = 0;
                        }
                        else {
                            goal.battlesWon = 0;
                        }
                    }
                }
                const sql = "UPDATE public.tracking_mission SET goals=$3 WHERE user_id=$1 AND mission_id=$2;";
                yield db_1.pool.query(sql, [
                    stats.user_id,
                    stats.mission_id,
                    JSON.stringify(stats.trackingGoals),
                ]);
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
}
exports.Battle = Battle;
function checkGoalProgression(goal, challenged, challenger, stats, completeTracks, index) {
    let includesTarget;
    let bonus = 0;
    try {
        if (goal.completed) {
            completeTracks++;
            return completeTracks;
        }
        includesTarget = challenged.ids.has(goal.with);
        if (goal.with !== -1 && includesTarget === false)
            return completeTracks;
        includesTarget = challenged.groups.has(goal.withGroup);
        if (goal.withGroup !== -1 && includesTarget === false)
            return completeTracks;
        includesTarget = challenger.ids.has(goal.against);
        if (goal.against !== -1 && includesTarget === false)
            return completeTracks;
        else
            bonus += challenged.idsHeadCount[goal.against] || 0;
        includesTarget = challenger.groups.has(goal.againstGroup);
        if (goal.againstGroup !== -1 && includesTarget === false)
            return completeTracks;
        else {
            bonus += challenger.groupHeadCount[goal.againstGroup] || 0;
        }
        goal.battlesWon = goal.battlesWon + (bonus || 1);
        if (goal.battlesWon >= stats.goals[index].battlesWon) {
            completeTracks++;
            goal.completed = true;
        }
        return completeTracks;
    }
    catch (e) {
        logger_1.log.error(e);
        return completeTracks;
    }
}
//# sourceMappingURL=battle.room.js.map