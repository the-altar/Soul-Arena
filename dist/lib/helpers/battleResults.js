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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCoins = exports.updateGameResults = exports.matchCalculations = exports.winRate = exports.calculateMaxStreak = exports.validateRanking = exports.levelDown = exports.levelUp = exports.calculateExpGain = exports.calculateElo = void 0;
const db_1 = require("../../db");
const logger_1 = require("../logger");
const elo_rank_1 = __importDefault(require("elo-rank"));
function calculateElo(p1, p2, isWinner) {
    const elo = new elo_rank_1.default(32);
    const expectedScore = elo.getExpected(p1.season.elo, p2.season.elo);
    p1.season.elo = elo.updateRating(expectedScore, isWinner ? 1 : 0, p1.season.elo);
}
exports.calculateElo = calculateElo;
function calculateExpGain(player, p2, isWinner) {
    const levelStatus = [0];
    let exp;
    let levelDifference = Math.abs(p2.season.seasonLevel - player.season.seasonLevel);
    if (isWinner) {
        exp = Math.min(Math.max(50 * levelDifference, 150), 600);
        player.season.exp += exp;
        levelUp(player, levelStatus);
    }
    else {
        exp = Math.min(Math.max(25 * levelDifference, 50), 300);
        player.season.exp = Math.max(0, player.season.exp - exp);
        levelDown(player, levelStatus);
    }
    return {
        levelStatus: levelStatus[0],
        exp,
    };
}
exports.calculateExpGain = calculateExpGain;
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
exports.levelUp = levelUp;
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
exports.levelDown = levelDown;
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
exports.validateRanking = validateRanking;
function calculateMaxStreak(player) {
    if (player.season.streak > player.season.maxStreak)
        player.season.maxStreak = player.season.streak;
}
exports.calculateMaxStreak = calculateMaxStreak;
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
exports.winRate = winRate;
function matchCalculations(p1, p2, isWinner) {
    winRate(p1, isWinner);
    calculateMaxStreak(p1);
    calculateElo(p1, p2, isWinner);
    const coins = calculateCoins(p1, isWinner);
    const results = calculateExpGain(p1, p2, isWinner);
    return Object.assign({ playerId: p1.getId(), coins }, results);
}
exports.matchCalculations = matchCalculations;
function updateGameResults(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const text = `
      UPDATE ladderboard set 
          wins = $1, 
          losses = $2,	
          elo = $3,
          streak = $4, 
          max_streak = $5, 
          experience = $6,
          season_level = $7,
          season_rank = $8 where season=$9 and user_id=$10;`;
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
            logger_1.log.error(err);
        }
    });
}
exports.updateGameResults = updateGameResults;
function calculateCoins(p, isWinner) {
    if (!isWinner)
        return 0;
    let coinsEarned = p.season.streak * 50;
    coinsEarned = Math.min(Math.max(Math.floor(coinsEarned), 50), 600);
    p.coins += coinsEarned;
    return coinsEarned;
}
exports.calculateCoins = calculateCoins;
//# sourceMappingURL=battleResults.js.map