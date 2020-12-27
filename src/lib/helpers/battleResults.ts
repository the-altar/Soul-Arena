import { Player } from "../engine/classes/player";
import { pool } from "../../db";
import { log } from "../logger";
import EloRank from "elo-rank";

export function calculateElo(p1: Player, p2: Player, isWinner: boolean) {
  const elo = new EloRank(32);

  const expectedScore = elo.getExpected(p1.season.elo, p2.season.elo);
  p1.season.elo = elo.updateRating(
    expectedScore,
    isWinner ? 1 : 0,
    p1.season.elo
  );
}

export function calculateExpGain(
  player: Player,
  p2: Player,
  isWinner: boolean
) {
  const levelStatus: Array<number> = [0];
  let exp: number;
  let levelDifference = Math.abs(
    p2.season.seasonLevel - player.season.seasonLevel
  );

  if (isWinner) {
    exp = Math.min(Math.max(50 * levelDifference, 150), 600);
    player.season.exp += exp;
    levelUp(player, levelStatus);
  } else {
    exp = Math.min(Math.max(50 * levelDifference, 50), 300);
    player.season.exp = Math.max(0, player.season.exp - exp);
    levelDown(player, levelStatus);
  }

  return {
    levelStatus: levelStatus[0],
    exp,
  };
}

export function levelUp(p: Player, hasLeveledUp: Array<number>) {
  const n = p.season.seasonLevel;
  const reqExp = ((n * (n + 1)) / 2) * 150;
  if (p.season.exp < reqExp) return;
  else {
    p.season.seasonLevel++;
    validateRanking(p);
    hasLeveledUp[0] = 1;
    levelUp(p, hasLeveledUp);
  }
}

export function levelDown(p: Player, hasLeveledDown: Array<number>) {
  const n = p.season.seasonLevel - 1;
  const reqExp = ((n * (n + 1)) / 2) * 150;

  if (p.season.exp < reqExp) {
    p.season.seasonLevel--;
    validateRanking(p);
    hasLeveledDown[0] = 2;
    levelDown(p, hasLeveledDown);
  }
}

export function validateRanking(p: Player) {
  const lvl = p.season.seasonLevel;
  if (lvl <= 5) p.season.seasonRank = "Substitute Shinigami";
  else if (lvl >= 6 && lvl <= 10) p.season.seasonRank = "Shinigami";
  else if (lvl >= 11 && lvl <= 15) p.season.seasonRank = "3rd Seat";
  else if (lvl >= 16 && lvl <= 20) p.season.seasonRank = "Lieutenant";
  else if (lvl >= 21 && lvl <= 25) p.season.seasonRank = "Arrancar";
  else if (lvl >= 26 && lvl <= 30) p.season.seasonRank = "Captain";
  else if (lvl >= 31 && lvl <= 35) p.season.seasonRank = "Vasto Lorde";
  else if (lvl >= 36 && lvl <= 40) p.season.seasonRank = "Captain Commander";
  else p.season.seasonRank = "Royal Guard";
}

export function calculateMaxStreak(player: Player) {
  if (player.season.streak > player.season.maxStreak)
    player.season.maxStreak = player.season.streak;
}

export function winRate(player: Player, isWinner: Boolean) {
  if (isWinner) {
    player.season.wins++;
    if (player.season.streak < 0) player.season.streak = 1;
    else player.season.streak++;
  } else {
    if (player.season.streak > 0) player.season.streak = 0;
    player.season.streak--;
    player.season.losses++;
  }
}

export function matchCalculations(p1: Player, p2: Player, isWinner: boolean) {
  winRate(p1, isWinner);
  calculateMaxStreak(p1);
  calculateElo(p1, p2, isWinner);
  const coins = calculateCoins(p1, isWinner);
  const results = calculateExpGain(p1, p2, isWinner);

  return {
    playerId: p1.getId(),
    coins,
    ...results,
  };
}

export async function updateGameResults(payload: {
  wins: number;
  losses: number;
  elo: number;
  streak: number;
  maxStreak: number;
  exp: number;
  seasonLevel: number;
  seasonRank: string;
  season: number;
  id: number;
  coins: number;
}) {
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
  const {
    wins,
    losses,
    streak,
    elo,
    id,
    exp,
    maxStreak,
    seasonLevel,
    seasonRank,
    coins,
  } = payload;
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
    await pool.query(text, values);
    await pool.query(userText, [coins, id]);
  } catch (err) {
    log.error(err);
  }
}

export function calculateCoins(p: Player, isWinner: boolean) {
  if (!isWinner) return 0;

  let coinsEarned = p.season.streak * 50;
  coinsEarned = Math.min(Math.max(Math.floor(coinsEarned), 50), 600);
  p.coins += coinsEarned;

  return coinsEarned;
}
