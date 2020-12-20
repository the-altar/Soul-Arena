import { Server } from "colyseus";
import { createServer } from "http";
import { App } from "./express";
import { pool } from "./db";
import { Battle, Lobby, RankedLobby } from "./lib/colyseus";
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
    this.server.define("rankedLobby", RankedLobby);
    this.server.define("battle", Battle);
    this.server.define("lobby", Lobby);
  }

  public run(): void {
    pool.query("DELETE from usersOnline");
    this.server.listen(this.port);
    log.info(`Server is running on port ${this.port}`);
  }
};
