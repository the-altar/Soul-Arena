"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const root_router_1 = require("./handlers/root/root.router");
const character_router_1 = require("./handlers/character/character.router");
const skill_routes_1 = require("./handlers/skill/skill.routes");
const effect_router_1 = require("./handlers/effect/effect.router");
const missions_router_1 = require("./handlers/missions/missions.router");
const game_router_1 = require("./handlers/game/game.router");
const user_1 = require("./handlers/user");
const thread_1 = require("./handlers/thread");
class App {
    constructor() {
        this.app = express_1.default();
        this.middleware();
        this.routes();
    }
    middleware() {
        this.app
            .use(express_fileupload_1.default())
            .use(cookie_parser_1.default())
            .use(body_parser_1.default.json())
            .use(body_parser_1.default.urlencoded({ extended: true }))
            .use(express_1.default.static('public', { maxAge: "10d" }))
            .use(express_1.default.static('public/main', { maxAge: '7d' }))
            .use('/game', express_1.default.static('public/game', { maxAge: '7d' }));
    }
    routes() {
        this.app.use("/user", user_1.userRouter);
        this.app.use('/game', game_router_1.gameRouter);
        this.app.use('/character', character_router_1.characterRouter);
        this.app.use("/skill", skill_routes_1.skillRouter);
        this.app.use("/effect", effect_router_1.effectRouter);
        this.app.use("/thread", thread_1.threadRouter);
        this.app.use("/mission", missions_router_1.missionRouter);
        this.app.use("/", root_router_1.rootRouter);
    }
    run() {
        return this.app;
    }
}
exports.App = App;
//# sourceMappingURL=express.js.map