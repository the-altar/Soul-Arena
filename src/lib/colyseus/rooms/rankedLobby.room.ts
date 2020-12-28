import http from "http";
import { Room, Client, matchMaker } from "colyseus";
import { pool } from "../../../db";

class ClientManager {
  private clientList: {
    [key: string]: { player: any; team: any; connection: Client };
  };
  private onlineList: { [key: string]: boolean };

  constructor() {
    this.clientList = {};
    this.onlineList = {};
  }

  isClientConnected(pid: string): boolean {
    if (this.onlineList[pid] !== undefined) return true;
    return false;
  }

  public addClient(id: string, payload: any, connection: Client): void {
    this.clientList[id] = {
      player: payload.player,
      team: payload.team.map((e: any) => {
        return { ...e.data };
      }),
      connection: connection,
    };
    this.onlineList[payload.player.id] = true;
  }

  public getClientConnectionBySessionId(id: string) {
    return this.clientList[id];
  }

  public getAllClientsSessionId(): Array<string> {
    return Object.keys(this.clientList);
  }

  public getClientBySessionId(id: string) {
    return {
      ...this.clientList[id],
    };
  }

  public getAllClients() {
    return this.clientList;
  }

  public removeClientBySessionId(id: string): void {
    if (this.clientList[id] === undefined) {
      return;
    }
    const playerId = this.clientList[id].player.id;
    delete this.onlineList[playerId];
    delete this.clientList[id];
  }

  public countPlayersOnline(): number {
    return Object.keys(this.clientList).length;
  }

  public getRankedMap() {
    const mappedHash = Object.keys(this.clientList)
      .sort((a, b) => {
        return this.clientList[a].player.elo - this.clientList[b].player.elo;
      })
      .map((sortedKey) => {
        return this.clientList[sortedKey];
      });
    return mappedHash;
  }
}

export class RankedLobby extends Room {
  private manager: ClientManager = new ClientManager();
  private evaluateGroupInterval: number = 5000;
  // When room is initialized
  onCreate(options: any) {
    this.setPatchRate(null);
    this.setSimulationInterval(async () => {
      try {
        const queue = this.manager.getRankedMap();

        for (let i = 1; i < queue.length; i = i + 2) {
          const room = await matchMaker.createRoom("battle", {});

          for (let j = i - 1; j <= i; j++) {
            const p = queue[j];

            const seat = await matchMaker.reserveSeatFor(room, {
              player: p.player,
              team: p.team,
            });
            p.connection.send("seat", seat);
            this.manager.removeClientBySessionId(queue[j].connection.sessionId);
          }
        }
      } catch (err) {
        throw err;
      }
    }, this.evaluateGroupInterval);
  }

  // Authorize client based on provided options before WebSocket handshake is complete
  onAuth(client: Client, options: any, request: http.IncomingMessage): boolean {
    if (this.manager.isClientConnected(options.player.id)) return false;
    return true;
  }

  // When client successfully join the room
  async onJoin(client: Client, options: any, auth: any) {
    const sql = `select
            jsonb_build_object('id', entity.id) || entity.data || jsonb_build_object('skills', jsonb_agg(skills.data order by skills.priority)) as data
            from
                entity
            join (
                select
                    skill.priority, skill.id, skill.data || jsonb_build_object('id', skill.id) || jsonb_build_object('effects', jsonb_agg( effect.data || jsonb_build_object('id', effect.id) order by effect.priority DESC)) as data, skill.entity_id
                from
                    skill
                join effect on
                    effect.skill_id = skill.id
                group by
                    skill.id ) as skills on
                skills.entity_id = entity.id
            where
                entity.id in ($1,
                $2,
                $3)
            group by
            entity.id;`;
    try {
      options.team = (await pool.query(sql, options.team)).rows;
      this.manager.addClient(client.sessionId, options, client);
    } catch (err) {
      throw err;
    }
  }

  // When a client leaves the room
  onLeave(client: Client, consented: boolean) {
    this.manager.removeClientBySessionId(client.sessionId);
  }

  async onDispose() {}
}
