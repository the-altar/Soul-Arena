import http from "http";
import { Room, Client, Delayed } from "colyseus";
import { Schema, type } from "@colyseus/schema";
import { Arena, iCharacter, Player } from "../../engine";
import * as results from "../../helpers/battleResults";
import { pool } from "../../../db";
import { log } from "../../logger";

interface iSkillCordinates {
  target?: number;
  caster: number;
  skill: number;
}

interface iRegister {
  player: any;
  team: Array<iCharacter>;
}

class MatchState extends Schema {
  @type("string")
  turnData: string;
}

export class Battle extends Room {
  private arena: Arena = new Arena();
  private constructed: number = 0;
  private evaluateGroupInterval = 60000;
  private delay: Delayed;
  private playerState: { [x: string]: number } = {};
  private updateMissions: boolean;
  private allowMatchCalculations: boolean;
  private roomCode: number;
  // When room is initialized
  onCreate(options: any) {
    this.updateMissions = options.updateMissions;
    this.allowMatchCalculations = options.allowMatchCalculations;
    this.roomCode = options.roomCode;

    this.setState(new MatchState());
    this.onMessage("end-game-turn", async (client: Client, payload: any) => {
      this.delay.reset();
      this.arena.processTurn(payload);
      this.lifeCycle();
    });

    this.onMessage(
      "add-skill-to-queue",
      (client: Client, cordinates: iSkillCordinates) => {
        const payload = this.arena.addSkillToTempQueue(cordinates);
        client.send("update-temp-queue", payload);
      }
    );

    this.onMessage(
      "remove-skill-from-queue",
      (client: Client, cordinates: iSkillCordinates) => {
        const payload = this.arena.removeSkillFromTempQueue(cordinates);
        client.send("update-temp-queue", payload);
      }
    );

    this.onMessage("exchange-energypool", (client: Client, payload: any) => {
      client.send("exchanged-energy", this.arena.exchangeEnergyPool(payload));
    });

    this.onMessage("surrender", async (client: Client, id: number) => {
      await this.surrender(id);
    });
  }

  // Authorize client based on provided options before WebSocket handshake is complete
  onAuth(client: Client, options: any, request: http.IncomingMessage) {
    if (this.constructed >= 2) return false;
    return true;
  }

  // When client successfully join the room
  onJoin(client: Client, options: any, auth: any) {
    this.arena.addPlayer(options.player, options.team);
    this.constructed++;
    this.playerState[client.sessionId] = options.player.id;
    if (this.constructed === 2) {
      this.gameClock();
    }
  }

  // When a client leaves the room
  async onLeave(client: Client, consented: boolean) {
    if (consented) {
      return;
    }
    try {
      // Notify ROOM that someone already left
      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 20);
      // client returned! let's re-activate it.
    } catch (e) {
      // 20 seconds expired. let's remove the client.
      const id = this.playerState[client.sessionId];
      await this.surrender(id);
    }
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  async onDispose() {
    if (this.arena.winner && this.arena.loser)
      try {
        await this.updateGameRecords(this.arena.winner, this.arena.loser);
        if (!this.updateMissions) return;
        await this.updateMissionGoals(this.arena.winner, this.arena.loser);
        if (!this.allowMatchCalculations) return;
        await results.updateGameResults({
          ...this.arena.loser.season,
          coins: this.arena.loser.coins,
          season: 1,
          id: this.arena.loser.id,
        });
        await results.updateGameResults({
          ...this.arena.winner.season,
          coins: this.arena.winner.coins,
          season: 1,
          id: this.arena.winner.id,
        });
      } catch (e) {
        log.error(e);
      }
  }

  gameClock() {
    this.arena.startGame();
    this.state.turnData = JSON.stringify(this.arena.getClientData());
    this.broadcast("game-started", this.arena.getClientData());

    this.delay = this.clock.setInterval(() => {
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
        payload1 = results.matchCalculations(
          this.arena.winner,
          this.arena.loser,
          true
        );
        payload2 = results.matchCalculations(
          this.arena.loser,
          this.arena.winner,
          false
        );
      } else payload1 = payload2 = {};

      this.broadcast("end-game", {
        winner: { playerData: this.arena.winner, results: payload1 },
        loser: { playerData: this.arena.loser, results: payload2 },
      });
    }
  }

  async surrender(id: number) {
    this.arena.surrender(id);
    let payload1, payload2;

    if (this.allowMatchCalculations) {
      payload1 = results.matchCalculations(
        this.arena.winner,
        this.arena.loser,
        true
      );
      payload2 = results.matchCalculations(
        this.arena.loser,
        this.arena.winner,
        false
      );
    } else payload1 = payload2 = {};

    this.broadcast("end-game", {
      winner: {
        playerData: { ...this.arena.winner },
        results: { ...payload1 },
      },
      loser: { playerData: { ...this.arena.loser }, results: { ...payload2 } },
    });
  }

  async updateMissionGoals(winner: Player, loser: Player) {
    if (!this.updateMissions) return;
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
      const res = await pool.query(sql, [winner.id, loser.id]);
      for (const data of res.rows) {
        if (data.user_id === winner.id) {
          await this.progressMission(winner, data);
        } else await this.breakMissionStreaks(loser, data);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async progressMission(
    player: Player,
    stats: {
      entity_id: number;
      trackingGoals: Array<any>;
      mission_id: number;
      user_id: number;
      goals: Array<any>;
    }
  ) {
    if (player.id < 0) return;
    let completeTracks = 0;
    let includesTarget;

    const chars = this.arena.getCharactersLiteralIdByIndex(
      player.getMyCharsIndex()
    );
    const challenger = this.arena.getChallengerLiteralIds(
      player.getMyCharsIndex()
    );

    for (const i in stats.trackingGoals) {
      let goal = stats.trackingGoals[i];
      if (goal.completed) {
        completeTracks++;
        continue;
      }

      includesTarget = chars.includes(goal.with);
      if (goal.with !== -1 && includesTarget === false) continue;

      includesTarget = challenger.includes(goal.against);
      if (goal.against !== -1 && includesTarget === false) continue;

      goal.battlesWon++;

      if (goal.battlesWon >= stats.goals[i].battlesWon) {
        completeTracks++;
        goal.completed = true;
      }
    }

    if (completeTracks === stats.goals.length) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const sql =
          "INSERT INTO public.completed_mission (mission_id, user_id) VALUES($1, $2);";
        await client.query(sql, [stats.mission_id, stats.user_id]);
        const sql2 =
          "INSERT INTO public.obtained_entity (entity_id, user_id) VALUES($1, $2);";
        await client.query(sql2, [stats.entity_id, stats.user_id]);
        await client.query(
          "DELETE FROM tracking_mission where user_id = $1 and mission_id = $2",
          [stats.user_id, stats.mission_id]
        );
        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK");
        return Promise.reject(e);
      } finally {
        client.release();
      }
    } else if (completeTracks < stats.goals.length) {
      try {
        const sql =
          "UPDATE public.tracking_mission SET goals=$3 WHERE user_id=$1 AND mission_id=$2;";
        await pool.query(sql, [
          stats.user_id,
          stats.mission_id,
          JSON.stringify(stats.trackingGoals),
        ]);
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }

  async updateGameRecords(winner: Player, loser: Player) {
    const query1 = `INSERT INTO game_stats DEFAULT VALUES;`;
    const query2 = `INSERT INTO game_result (winner_id, loser_id, game_room) VALUES($1, $2, $3);`;
    const query3 = `UPDATE entity SET games_won= games_won + 1 WHERE id=ANY($1)`;
    const query4 = `UPDATE entity SET games_lost= games_lost + 1 WHERE id=ANY($1)`;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      if (this.allowMatchCalculations) {
        await client.query(query1);
        await client.query(query3, [winner.myCharsRealId]);
        await client.query(query4, [loser.myCharsRealId]);
      }
      await client.query(query2, [winner.id, loser.id, this.roomCode]);
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      log.error(e);
    } finally {
      client.release();
    }
  }

  async breakMissionStreaks(
    player: Player,
    stats: {
      entity_id: number;
      trackingGoals: Array<any>;
      mission_id: number;
      user_id: number;
      goals: Array<any>;
    }
  ) {
    if (player.id < 0) return;
    const chars = this.arena.getCharactersLiteralIdByIndex(
      player.getMyCharsIndex()
    );
    const challenger = this.arena.getChallengerLiteralIds(
      player.getMyCharsIndex()
    );

    for (const i in stats.trackingGoals) {
      const goal = stats.trackingGoals[i];
      if (goal.completed) continue;
      if (goal.inRow) {
        if (chars.includes(goal.with)) {
          goal.battlesWon = 0;
        } else if (challenger.includes(goal.against)) {
          goal.battlesWon = 0;
        } else if (goal.against === -1 && goal.with === -1) {
          goal.battlesWon = 0;
        }
      }
    }

    try {
      const sql =
        "UPDATE public.tracking_mission SET goals=$3 WHERE user_id=$1 AND mission_id=$2;";
      await pool.query(sql, [
        stats.user_id,
        stats.mission_id,
        JSON.stringify(stats.trackingGoals),
      ]);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
