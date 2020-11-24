import http from "http";
import { Room, Client, Delayed } from "colyseus";
import { Arena, iCharacter, Player } from "../../engine"
import { pool } from "../../db"

interface iSkillCordinates {
    target?: number
    caster: number
    skill: number
}

interface iRegister {
    player: any,
    team: Array<iCharacter>
}

export class Battle extends Room {
    private arena: Arena = new Arena()
    private constructed: number = 0
    private evaluateGroupInterval = 60000
    private delay: Delayed
    // When room is initialized
    onCreate(options: any) {
        this.onMessage('end-game-turn', async (client: Client, payload: any) => {
            this.delay.reset()
            this.arena.processTurn(payload)

            const { isOver, gameData, winner, loser } = this.arena.startGame(true)

            if (!isOver) this.broadcast("start-new-turn", gameData)
            else {

                await this.updateMissionGoals(winner, loser)
                const payload1 = endMatch(winner, loser, true)
                const payload2 = endMatch(loser, winner, false)

                this.broadcast("end-game", {
                    winner: { playerData: { ...winner }, results: { ...payload1 } },
                    loser: { playerData: { ...loser }, results: { ...payload2 } }
                })
                this.disconnect()
            }
        })

        this.onMessage('add-skill-to-queue', (client: Client, cordinates: iSkillCordinates) => {
            const payload = this.arena.addSkillToTempQueue(cordinates)
            client.send('update-temp-queue', payload)
        })

        this.onMessage('remove-skill-from-queue', (client: Client, cordinates: iSkillCordinates) => {
            const payload = this.arena.removeSkillFromTempQueue(cordinates)
            client.send('update-temp-queue', payload)
        })

        this.onMessage('exchange-energypool', (client:Client, payload:any)=>{
            client.send("exchanged-energy", this.arena.exchangeEnergyPool(payload))
        })

        this.onMessage('surrender', async (client: Client, id: number) => {
            const { winner, loser } = this.arena.surrender(id)
            await this.updateMissionGoals(winner, loser)
            const payload1 = endMatch(winner, loser, true)
            const payload2 = endMatch(loser, winner, false)

            this.broadcast("end-game", {
                winner: { playerData: { ...winner }, results: { ...payload1 } },
                loser: { playerData: { ...loser }, results: { ...payload2 } }
            })
            this.disconnect()
        })
    }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth(client: Client, options: any, request: http.IncomingMessage) {
        return true
    }

    // When client successfully join the room
    onJoin(client: Client, options: any, auth: any) {
        this.arena.addPlayer(options.player, options.team)
        this.constructed++
        if (this.constructed === 2) this.gameClock()
    }

    // When a client leaves the room
    onLeave(client: Client, consented: boolean) { }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    async onDispose() {
    }

    gameClock() {
        const { gameData } = this.arena.startGame()

        this.broadcast("game-started", gameData)

        this.delay = this.clock.setInterval(async () => {
            const { isOver, gameData, winner, loser } = this.arena.startGame()

            if (!isOver) this.broadcast("start-new-turn", gameData)
            else {

                await this.updateMissionGoals(winner, loser)
                const payload1 = endMatch(winner, loser, true)
                const payload2 = endMatch(loser, winner, false)

                this.broadcast("end-game", {
                    winner: { playerData: { ...winner }, results: { ...payload1 } },
                    loser: { playerData: { ...loser }, results: { ...payload2 } }
                })
                this.disconnect()
            }

        }, this.evaluateGroupInterval)
    }

    async updateMissionGoals(winner: Player, loser: Player) {
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
            tm.user_id = $1 or tm.user_id = $2;`

        const res = await pool.query(sql, [winner.id, loser.id])
        for (const data of res.rows) {
            if (data.user_id === winner.id) this.progressMission(winner, data)
            else this.breakMissionStreaks(loser, data)
        }
    }

    async progressMission(player: Player, stats: { entity_id: number, trackingGoals: Array<any>, mission_id: number, user_id: number, goals: Array<any> }) {
        if (player.id < 0) return
        let completeTracks = 0
        const chars = this.arena.getCharactersLiteralIdByIndex(player.getMyCharsIndex())
        const challenger = this.arena.getChallengerLiteralIds(player.getMyCharsIndex())

        for (const i in stats.trackingGoals) {
            let goal = stats.trackingGoals[i]
            if (goal.with !== -1 && chars.includes(goal.with)) continue
            if (goal.against !== 1 && challenger.includes(goal.against)) continue
            goal.battlesWon++

            if (goal.battlesWon >= stats.goals[i].battlesWon) {
                completeTracks++
                goal.completed = true;
            }
        }

        if (completeTracks === stats.goals.length) {
            const client = await pool.connect()
            try {
                await client.query("BEGIN")
                const sql = "INSERT INTO public.completed_mission (mission_id, user_id) VALUES($1, $2);"
                await client.query(sql, [stats.mission_id, stats.user_id])
                const sql2 = "INSERT INTO public.obtained_entity (entity_id, user_id) VALUES($1, $2);"
                await client.query(sql2, [stats.entity_id, stats.user_id])
                await client.query('DELETE FROM tracking_mission where user_id = $1 and mission_id = $2', [stats.user_id, stats.mission_id])
                await client.query("COMMIT")
            } catch (e) {
                await client.query("ROLLBACK")
                throw e
            } finally {
                client.release()
            }
        }

        if (completeTracks < stats.goals.length) {
            try {
                const sql = "UPDATE public.tracking_mission SET goals=$3 WHERE user_id=$1 AND mission_id=$2;"
                await pool.query(sql, [stats.user_id, stats.mission_id, JSON.stringify(stats.trackingGoals)])
            } catch (err) {
                throw err
            }
        }

    }

    async breakMissionStreaks(player: Player, stats: { entity_id: number, trackingGoals: Array<any>, mission_id: number, user_id: number, goals: Array<any> }) {
        if (player.id < 0) return
        const chars = this.arena.getCharactersLiteralIdByIndex(player.getMyCharsIndex())
        const challenger = this.arena.getChallengerLiteralIds(player.getMyCharsIndex())

        for (const i in stats.trackingGoals) {
            const goal = stats.trackingGoals[i]
            if(goal.completed) continue
            if (goal.inRow) {
                if (goal.with !== -1 && chars.includes(goal.with)) {
                    goal.battlesWon = 0
                }
                else if (goal.against !== 1 && challenger.includes(goal.against)) {
                    goal.battlesWon = 0
                }
                else if (goal.against === -1 && goal.with === -1) {
                    goal.battlesWon = 0
                }
            }
        }

        try {
            const sql = "UPDATE public.tracking_mission SET goals=$3 WHERE user_id=$1 AND mission_id=$2;"
            await pool.query(sql, [stats.user_id, stats.mission_id, JSON.stringify(stats.trackingGoals)])
        } catch (err) {
            throw err
        }
    }
}

function probability(r1: number, r2: number) {
    return 1.0 * 1.0 / (1 + 1.0 * Math.pow(10, 1.0 * (r1 - r2) / 400))
}

function calculateElo(p1: Player, p2: Player, isWinner: boolean) {
    const Pb = probability(p1.season.elo, p2.season.elo)
    let eloGained = 0

    if (isWinner) eloGained = p1.season.elo + 50 * (1 - Pb)
    else eloGained = p1.season.elo + 50 * (0 - Pb)

    p1.season.elo = Math.floor(eloGained)
}

function calculateExpGain(player: Player, p2: Player, isWinner: boolean) {

    if (isWinner) {
        const levelDifference = p2.season.seasonLevel - player.season.seasonLevel
        const expGained = Math.min(Math.max(50 * levelDifference, 150), 600)

        let hasLeveledUp = [false];
        player.season.exp += expGained
        levelUp(player, hasLeveledUp)

        return {
            leveledUp: hasLeveledUp[0], expGained
        }

    } else {

        const levelDifference = player.season.seasonLevel - p2.season.seasonLevel
        const expLost = Math.min(Math.max(50 * levelDifference, 50), 300)

        let hasLeveledDown = [false];
        player.season.exp = Math.max(0, (player.season.exp - expLost))
        levelDown(player, hasLeveledDown)

        return {
            leveledDown: hasLeveledDown, expLost
        }
    }
}

function levelUp(p: Player, hasLeveledUp: Array<boolean>) {
    const n = p.season.seasonLevel
    const reqExp = ((n * (n + 1)) / 2) * 350
    if (p.season.exp < reqExp) return
    else {
        p.season.seasonLevel++;
        validateRanking(p)
        hasLeveledUp[0] = true
        levelUp(p, hasLeveledUp)
    }
}

function levelDown(p: Player, hasLeveledDown: Array<boolean>) {
    const n = p.season.seasonLevel - 1
    const reqExp = ((n * (n + 1)) / 2) * 350

    if (p.season.exp < reqExp) {
        p.season.seasonLevel--;
        validateRanking(p)
        hasLeveledDown[0] = true
        levelDown(p, hasLeveledDown)
    }
}

function validateRanking(p: Player) {
    const lvl = p.season.seasonLevel
    if (lvl <= 5) p.season.seasonRank = "Rookie"
    else if (lvl >= 6 && lvl <= 10) p.season.seasonRank = "Novice"
    else if (lvl >= 11 && lvl <= 15) p.season.seasonRank = "Trainer"
    else if (lvl >= 16 && lvl <= 20) p.season.seasonRank = "Ace"
    else if (lvl >= 21 && lvl <= 25) p.season.seasonRank = "Veteran"
    else if (lvl >= 26 && lvl <= 30) p.season.seasonRank = "Gym Leader"
    else if (lvl >= 31 && lvl <= 35) p.season.seasonRank = "Challenger"
    else if (lvl >= 36 && lvl <= 40) p.season.seasonRank = "Elite 4"
    else p.season.seasonRank = "Champion"
}

function calculateMaxStreak(player: Player) {
    if (player.season.streak > player.season.maxStreak)
        player.season.maxStreak = player.season.streak
}

function winRate(player: Player, isWinner: Boolean) {
    if (isWinner) {
        player.season.wins++
        if (player.season.streak < 0) player.season.streak = 1
        else player.season.streak++
    } else {
        if (player.season.streak > 0) player.season.streak = 0
        player.season.streak--
        player.season.losses++
    }
}

function endMatch(p1: Player, p2: Player, isWinner: boolean) {
    winRate(p1, isWinner)
    calculateMaxStreak(p1)
    calculateElo(p1, p2, isWinner)
    const coins = calculateCoins(p1, isWinner)
    const results = calculateExpGain(p1, p2, isWinner)

    updateGameResults({
        wins: p1.season.wins || 0,
        losses: p1.season.losses || 0,
        streak: p1.season.streak || 0,
        elo: p1.season.elo || 0,
        id: p1.getId(),
        exp: p1.season.exp || 0,
        maxStreak: p1.season.maxStreak || 0,
        seasonLevel: p1.season.seasonLevel || 0,
        seasonRank: p1.season.seasonRank || "Rookie",
        season: 1,
        coins: p1.coins
    })

    return {
        playerId: p1.getId(),
        coins,
        ...results
    }
}

async function updateGameResults(payload: {
    wins: number,
    losses: number,
    elo: number,
    streak: number,
    maxStreak: number,
    exp: number,
    seasonLevel: number,
    seasonRank: string,
    season: number,
    id: number,
    coins: number,
}) {
    if (payload.id < 0) return
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
        season_rank = $8;`
    const userText = `update users set coins=$1 where id=$2`;
    const { wins, losses, streak, elo, id, exp, maxStreak, seasonLevel, seasonRank, coins } = payload
    const values = [wins, losses, elo, streak, maxStreak, exp, seasonLevel, seasonRank, 0, id]

    try {
        await pool.query(text, values)
        await pool.query(userText, [coins, id])
    } catch (err) {
        throw (err)
    }
}

function calculateCoins(p: Player, isWinner: boolean) {
    if (!isWinner) return 0

    let coinsEarned = p.season.streak * 50
    coinsEarned = Math.min(Math.max(Math.floor(coinsEarned), 50), 600);
    p.coins += coinsEarned

    return coinsEarned
}

