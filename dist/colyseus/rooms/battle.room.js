"use strict";
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
const engine_1 = require("../../engine");
const db_1 = require("../../db");
const logger_1 = require("../../logger");
class Battle extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.arena = new engine_1.Arena();
        this.constructed = 0;
        this.evaluateGroupInterval = 60000;
    }
    // When room is initialized
    onCreate(options) {
        this.onMessage("end-game-turn", (client, payload) => __awaiter(this, void 0, void 0, function* () {
            this.delay.reset();
            this.arena.processTurn(payload);
            const { isOver, gameData, winner, loser } = this.arena.startGame(true);
            if (!isOver)
                this.broadcast("start-new-turn", gameData);
            else {
                yield this.updateMissionGoals(winner, loser);
                const payload1 = endMatch(winner, loser, true);
                const payload2 = endMatch(loser, winner, false);
                this.broadcast("end-game", {
                    winner: { playerData: Object.assign({}, winner), results: Object.assign({}, payload1) },
                    loser: { playerData: Object.assign({}, loser), results: Object.assign({}, payload2) },
                });
                this.disconnect();
            }
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
            const { winner, loser } = this.arena.surrender(id);
            yield this.updateMissionGoals(winner, loser);
            const payload1 = endMatch(winner, loser, true);
            const payload2 = endMatch(loser, winner, false);
            this.broadcast("end-game", {
                winner: { playerData: Object.assign({}, winner), results: Object.assign({}, payload1) },
                loser: { playerData: Object.assign({}, loser), results: Object.assign({}, payload2) },
            });
            this.disconnect();
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
        this.arena.addPlayer(options.player, options.team);
        this.constructed++;
        if (this.constructed === 2) {
            this.gameClock();
        }
    }
    // When a client leaves the room
    onLeave(client, consented) { }
    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    gameClock() {
        logger_1.log.info("A new game has begun");
        const { gameData } = this.arena.startGame();
        this.broadcast("game-started", gameData);
        this.delay = this.clock.setInterval(() => __awaiter(this, void 0, void 0, function* () {
            const { isOver, gameData, winner, loser } = this.arena.startGame();
            if (!isOver)
                this.broadcast("start-new-turn", gameData);
            else {
                yield this.updateMissionGoals(winner, loser);
                const payload1 = endMatch(winner, loser, true);
                const payload2 = endMatch(loser, winner, false);
                this.broadcast("end-game", {
                    winner: { playerData: Object.assign({}, winner), results: Object.assign({}, payload1) },
                    loser: { playerData: Object.assign({}, loser), results: Object.assign({}, payload2) },
                });
                this.disconnect();
            }
        }), this.evaluateGroupInterval);
    }
    updateMissionGoals(winner, loser) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const res = yield db_1.pool.query(sql, [winner.id, loser.id]);
            for (const data of res.rows) {
                if (data.user_id === winner.id) {
                    this.progressMission(winner, data);
                }
                else
                    this.breakMissionStreaks(loser, data);
            }
        });
    }
    progressMission(player, stats) {
        return __awaiter(this, void 0, void 0, function* () {
            if (player.id < 0)
                return;
            let completeTracks = 0;
            let includesTarget;
            const chars = this.arena.getCharactersLiteralIdByIndex(player.getMyCharsIndex());
            const challenger = this.arena.getChallengerLiteralIds(player.getMyCharsIndex());
            for (const i in stats.trackingGoals) {
                let goal = stats.trackingGoals[i];
                if (goal.completed) {
                    completeTracks++;
                    continue;
                }
                includesTarget = chars.includes(goal.with);
                if (goal.with !== -1 && includesTarget === false)
                    continue;
                includesTarget = challenger.includes(goal.against);
                if (goal.against !== -1 && includesTarget === false)
                    continue;
                goal.battlesWon++;
                if (goal.battlesWon >= stats.goals[i].battlesWon) {
                    completeTracks++;
                    goal.completed = true;
                }
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
                    throw e;
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
                    throw err;
                }
            }
        });
    }
    breakMissionStreaks(player, stats) {
        return __awaiter(this, void 0, void 0, function* () {
            if (player.id < 0)
                return;
            const chars = this.arena.getCharactersLiteralIdByIndex(player.getMyCharsIndex());
            const challenger = this.arena.getChallengerLiteralIds(player.getMyCharsIndex());
            for (const i in stats.trackingGoals) {
                const goal = stats.trackingGoals[i];
                if (goal.completed)
                    continue;
                if (goal.inRow) {
                    if (chars.includes(goal.with)) {
                        goal.battlesWon = 0;
                    }
                    else if (challenger.includes(goal.against)) {
                        goal.battlesWon = 0;
                    }
                    else if (goal.against === -1 && goal.with === -1) {
                        goal.battlesWon = 0;
                    }
                }
            }
            try {
                const sql = "UPDATE public.tracking_mission SET goals=$3 WHERE user_id=$1 AND mission_id=$2;";
                yield db_1.pool.query(sql, [
                    stats.user_id,
                    stats.mission_id,
                    JSON.stringify(stats.trackingGoals),
                ]);
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.Battle = Battle;
function probability(r1, r2) {
    return (1.0 * 1.0) / (1 + 1.0 * Math.pow(10, (1.0 * (r1 - r2)) / 400));
}
function calculateElo(p1, p2, isWinner) {
    const Pb = probability(p1.season.elo, p2.season.elo);
    let eloGained = 0;
    if (isWinner)
        eloGained = p1.season.elo + 50 * (1 - Pb);
    else
        eloGained = p1.season.elo + 50 * (0 - Pb);
    p1.season.elo = Math.floor(eloGained);
}
function calculateExpGain(player, p2, isWinner) {
    const levelStatus = [0];
    let exp;
    let levelDifference = Math.abs(p2.season.seasonLevel - player.season.seasonLevel);
    if (!isWinner && player.season.seasonLevel < p2.season.seasonLevel)
        levelDifference *= -1;
    else if (isWinner && player.season.seasonLevel > p2.season.seasonLevel)
        levelDifference = 0;
    exp = Math.min(Math.max(50 * levelDifference, 150), 600);
    if (isWinner) {
        player.season.exp += exp;
        levelUp(player, levelStatus);
    }
    else {
        player.season.exp = Math.max(0, player.season.exp - exp);
        levelDown(player, levelStatus);
    }
    return {
        levelStatus: levelStatus[0],
        exp,
    };
}
function levelUp(p, hasLeveledUp) {
    const n = p.season.seasonLevel;
    const reqExp = ((n * (n + 1)) / 2) * 150;
    if (p.season.exp < reqExp)
        return;
    else {
        p.season.seasonLevel++;
        validateRanking(p);
        hasLeveledUp[0] = 1;
        levelUp(p, hasLeveledUp);
    }
}
function levelDown(p, hasLeveledDown) {
    const n = p.season.seasonLevel - 1;
    const reqExp = ((n * (n + 1)) / 2) * 150;
    if (p.season.exp < reqExp) {
        p.season.seasonLevel--;
        validateRanking(p);
        hasLeveledDown[0] = 2;
        levelDown(p, hasLeveledDown);
    }
}
function validateRanking(p) {
    const lvl = p.season.seasonLevel;
    if (lvl <= 5)
        p.season.seasonRank = "Substitute Shinigami";
    else if (lvl >= 6 && lvl <= 10)
        p.season.seasonRank = "Shinigami";
    else if (lvl >= 11 && lvl <= 15)
        p.season.seasonRank = "3rd Seat";
    else if (lvl >= 16 && lvl <= 20)
        p.season.seasonRank = "Lieutenant";
    else if (lvl >= 21 && lvl <= 25)
        p.season.seasonRank = "Arrancar";
    else if (lvl >= 26 && lvl <= 30)
        p.season.seasonRank = "Captain";
    else if (lvl >= 31 && lvl <= 35)
        p.season.seasonRank = "Vasto Lorde";
    else if (lvl >= 36 && lvl <= 40)
        p.season.seasonRank = "Captain Commander";
    else
        p.season.seasonRank = "Royal Guard";
}
function calculateMaxStreak(player) {
    if (player.season.streak > player.season.maxStreak)
        player.season.maxStreak = player.season.streak;
}
function winRate(player, isWinner) {
    if (isWinner) {
        player.season.wins++;
        if (player.season.streak < 0)
            player.season.streak = 1;
        else
            player.season.streak++;
    }
    else {
        if (player.season.streak > 0)
            player.season.streak = 0;
        player.season.streak--;
        player.season.losses++;
    }
}
function endMatch(p1, p2, isWinner) {
    winRate(p1, isWinner);
    calculateMaxStreak(p1);
    calculateElo(p1, p2, isWinner);
    const coins = calculateCoins(p1, isWinner);
    const results = calculateExpGain(p1, p2, isWinner);
    updateGameResults({
        wins: p1.season.wins || 0,
        losses: p1.season.losses || 0,
        streak: p1.season.streak || 0,
        elo: p1.season.elo || 0,
        id: p1.getId(),
        exp: p1.season.exp || 0,
        maxStreak: p1.season.maxStreak || 0,
        seasonLevel: p1.season.seasonLevel || 0,
        seasonRank: p1.season.seasonRank || "Substitute Shinigami",
        season: 1,
        coins: p1.coins,
    });
    return Object.assign({ playerId: p1.getId(), coins }, results);
}
function updateGameResults(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        if (payload.id < 0)
            return;
        const text = `
    INSERT INTO ladderboard (season, user_id, wins, losses, elo, streak, max_streak, experience, season_level, season_rank)
    values ($9,$10,$1,$2,$3,$4,$5,$6,$7,$8)
    on conflict (season, user_id) do update 
    set 
        wins = $1, 
        losses = $2,	
        elo = $3,
        streak = $4, 
        max_streak = $5, 
        experience = $6,
        season_level = $7,
        season_rank = $8;`;
        const userText = `update users set coins=$1 where id=$2`;
        const { wins, losses, streak, elo, id, exp, maxStreak, seasonLevel, seasonRank, coins, } = payload;
        const values = [
            wins,
            losses,
            elo,
            streak,
            maxStreak,
            exp,
            seasonLevel,
            seasonRank,
            0,
            id,
        ];
        try {
            yield db_1.pool.query(text, values);
            yield db_1.pool.query(userText, [coins, id]);
        }
        catch (err) {
            throw err;
        }
    });
}
function calculateCoins(p, isWinner) {
    if (!isWinner)
        return 0;
    let coinsEarned = p.season.streak * 50;
    coinsEarned = Math.min(Math.max(Math.floor(coinsEarned), 50), 600);
    p.coins += coinsEarned;
    return coinsEarned;
}
//# sourceMappingURL=battle.room.js.map