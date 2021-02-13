import { Server } from "colyseus";
import { createServer } from "http";
import { App } from "./express";
import { pool } from "./db";
import { Battle, Lobby, Queue } from "./lib/colyseus";
import { BattleRooms } from "./lib/engine/enums";
import { log } from "./lib/logger";

export const Coliseum = class {
  private server: Server;
  private port: number;

  constructor(port: number) {
    this.port = port;
    this.server = new Server({
      server: createServer(new App().run()),
    });
    this.rooms();
  }

  private rooms(): void {
    this.server.define("rankedLobby", Queue, { targetRoom: "rankedBattle" });
    this.server.define("quickLobby", Queue, { targetRoom: "quickBattle" });

    this.server.define("rankedBattle", Battle, {
      updateMissions: true,
      allowMatchCalculations: true,
      roomCode: 0,
    });
    this.server.define("quickBattle", Battle, {
      updateMissions: true,
      allowMatchCalculations: false,
      roomCode: 1,
    });
    this.server.define("privateBattle", Battle, {
      updateMissions: false,
      allowMatchCalculations: false,
      roomCode: 2,
    });
    this.server.define("lobby", Lobby);
  }

  public run(): void {
    pool.query("DELETE from usersOnline");
    this.server.listen(this.port);
    log.info(`Server is running on port ${this.port}`);
  }
};
