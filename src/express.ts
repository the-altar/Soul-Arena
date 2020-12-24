import express from "express";
import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
import subdomain from "express-subdomain";
import fileupload from "express-fileupload";
import cors from "cors";

import { Application } from "express";
import { rootRouter } from "./handlers/root/root.router";
import { characterRouter } from "./handlers/character/character.router";
import { skillRouter } from "./handlers/skill/skill.routes";
import { effectRouter } from "./handlers/effect/effect.router";
import { missionRouter } from "./handlers/missions/missions.router";
import { adminRouter } from "./handlers/admin/index.router";
import { gameRouter } from "./handlers/game/game.router";
import { userRouter } from "./handlers/user";
import { threadRouter } from "./handlers/thread";

export class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.middleware();
    this.subdomains();
    this.static();
    this.routes();
  }

  private middleware(): void {
    this.app
      .use(cors())
      .use(fileupload())
      .use(cookieParser())
      .use(bodyparser.json())
      .use(bodyparser.urlencoded({ extended: true }));
  }

  private static(): void {
    this.app
      .use(express.static("public", { maxAge: "10d" }))
      .use(express.static("public/main", { maxAge: "7d" }));
  }

  private subdomains(): void {
    this.app
      .use(
        subdomain(
          "game",
          express
            .Router()
            .use(express.static("public/game/build", { maxAge: "7d" }))
            .use(express.static("public/game", { maxAge: "7d" }))
            .use("/", gameRouter)
        )
      )
      .use(
        subdomain(
          "admin",
          express
            .Router()
            .use(express.static("public/admin", { maxAge: "7d" }))
            .use("/", adminRouter)
        )
      );
  }

  private routes(): void {
    this.app.use("/user", userRouter);
    this.app.use("/character", characterRouter);
    this.app.use("/skill", skillRouter);
    this.app.use("/effect", effectRouter);
    this.app.use("/thread", threadRouter);
    this.app.use("/mission", missionRouter);
    this.app.use("/", rootRouter);
  }

  public run(): Application {
    return this.app;
  }
}
