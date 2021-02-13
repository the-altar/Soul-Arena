import http from "http";
import { Room, Client, matchMaker } from "colyseus";
import { pool } from "../../../db";
import { BattleRooms } from "../../engine/enums";
import { log } from "../../logger";

class ClientManager {
  private clientList: {
    [key: string]: { player: any; team: any; connection: Client };
  };
  private onlineList: { [key: string]: string };
  private ipCheck: { [x: string]: string };
  constructor() {
    this.clientList = {};
    this.onlineList = {};
    this.ipCheck = {};
  }

  isClientConnected(pid: string): boolean {
    if (this.onlineList[pid] !== undefined) return true;
    return false;
  }

  public addIpAddress(ip: string, playerId: string) {
    this.ipCheck[ip] = playerId;
    this.onlineList[playerId] = ip;
  }

  public addClient(id: string, payload: any, connection: Client): void {
    this.clientList[id] = {
      player: payload.player,
      team: payload.team.map((e: any) => {
        return { ...e.data };
      }),
      connection: connection,
    };
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
    const ip = this.onlineList[playerId];
    delete this.onlineList[playerId];
    delete this.clientList[id];
    delete this.ipCheck[ip];
  }

  public countPlayersOnline(): number {
    return Object.keys(this.clientList).length;
  }

  public getRankedMap(roomCode: any) {
    const seen: { [x: string]: boolean } = {};
    let mappedHash = Object.keys(this.clientList)
      .sort((a, b) => {
        return this.clientList[a].player.elo - this.clientList[b].player.elo;
      })
      .map((sortedKey) => {
        return this.clientList[sortedKey];
      });
    if (roomCode === BattleRooms.rankedBattle) {
      log.info("xx [MatchMake] ladder game; filter duplicated IP");
      mappedHash = mappedHash.filter((e) => {
        const ipAddress = this.onlineList[e.player.id];
        if (seen[ipAddress]) {
          log.info(`[MatchMake] repeated IP: ${ipAddress}`);
          return false;
        } else {
          seen[ipAddress] = true;
          return true;
        }
      });
    }
    return mappedHash;
  }
}

export class Queue extends Room {
  private manager: ClientManager = new ClientManager();
  private evaluateGroupInterval: number = 20000;
  private targetRoom: string;
  private targetRoomCode: string | number;
  // When room is initialized
  onCreate(options: any) {
    this.targetRoom = options.targetRoom;
    this.targetRoomCode = BattleRooms[options.targetRoom];
    this.setPatchRate(null);
    this.setSimulationInterval(async () => {
      try {
        const queue = this.manager.getRankedMap(this.targetRoomCode);

        for (let i = 1; i < queue.length; i = i + 2) {
          const room = await matchMaker.createRoom(this.targetRoom, {});

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
    this.manager.addIpAddress(
      request.connection.remoteAddress,
      options.player.id
    );
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
      this.broadcast("connected_clients", this.manager.countPlayersOnline());
    } catch (err) {
      client.close();
      log.error(err);
    }
  }

  // When a client leaves the room
  onLeave(client: Client, consented: boolean) {
    this.manager.removeClientBySessionId(client.sessionId);
    this.broadcast("connected_clients", this.manager.countPlayersOnline());
  }

  async onDispose() {}
}
