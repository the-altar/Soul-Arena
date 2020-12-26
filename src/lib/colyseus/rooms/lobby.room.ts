import http from "http";
import { Room, Client } from "colyseus";
import { pool } from "../../../db";
import { log } from "../../logger";

export class Lobby extends Room {
  userList: { [x: string]: number };
  idConnCount: { [x: string]: number };

  // When room is initialized
  onCreate(options: any) {
    this.setPatchRate(null);
    this.userList = {};
    this.idConnCount = {};
  }

  // Authorize client based on provided options before WebSocket handshake is complete
  onAuth(client: Client, options: any, request: http.IncomingMessage) {
    if (!options.auth) return false;
    return true;
  }

  // When client successfully join the room
  async onJoin(client: Client, options: any, auth: any) {
    this.userList[client.sessionId] = options.id;
    this.idConnCount[options.id] = (this.idConnCount[options.id] || 0) + 1;
    if (this.idConnCount[options.id] > 1) return;

    const conn = await pool.connect();
    try {
      await conn.query("BEGIN");
      await conn.query("INSERT INTO usersonline (user_id) VALUES($1);", [
        options.id,
      ]);
      await conn.query("UPDATE users SET last_seen=now() where id = $1", [
        options.id,
      ]);
      await conn.query("COMMIT");
    } catch (e) {
      log.error(e);
      await conn.query("ROLLBACK");
    } finally {
      conn.release();
    }
  }

  // When a client leaves the room
  async onLeave(client: Client, consented: boolean) {
    const userId = this.userList[client.sessionId];
    this.idConnCount[userId]--;
    delete this.userList[client.sessionId];

    if (this.idConnCount[userId] > 0) return;
    delete this.idConnCount[userId];

    const conn = await pool.connect();
    try {
      await conn.query("BEGIN");
      await conn.query("DELETE FROM usersonline WHERE user_id=$1;", [userId]);
      await conn.query("UPDATE users SET last_seen=now() where id = $1", [
        userId,
      ]);
      await conn.query("COMMIT");
    } catch (e) {
      log.error(e);
      await conn.query("ROLLBACK");
    } finally {
      conn.release();
    }
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {}
}
