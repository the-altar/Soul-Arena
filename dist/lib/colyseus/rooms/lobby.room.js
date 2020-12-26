"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lobby = void 0;
const colyseus_1 = require("colyseus");
const db_1 = require("../../../db");
const logger_1 = require("../../logger");
class Lobby extends colyseus_1.Room {
    // When room is initialized
    onCreate(options) {
        this.setPatchRate(null);
        this.userList = {};
        this.idConnCount = {};
    }
    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth(client, options, request) {
        if (!options.auth)
            return false;
        return true;
    }
    // When client successfully join the room
    onJoin(client, options, auth) {
        return __awaiter(this, void 0, void 0, function* () {
            this.userList[client.sessionId] = options.id;
            this.idConnCount[options.id] = (this.idConnCount[options.id] || 0) + 1;
            if (this.idConnCount[options.id] > 1)
                return;
            const conn = yield db_1.pool.connect();
            try {
                yield conn.query("BEGIN");
                yield conn.query("INSERT INTO usersonline (user_id) VALUES($1);", [
                    options.id,
                ]);
                yield conn.query("UPDATE users SET last_seen=now() where id = $1", [
                    options.id,
                ]);
                yield conn.query("COMMIT");
            }
            catch (e) {
                logger_1.log.error(e);
                yield conn.query("ROLLBACK");
            }
            finally {
                conn.release();
            }
        });
    }
    // When a client leaves the room
    onLeave(client, consented) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = this.userList[client.sessionId];
            this.idConnCount[userId]--;
            delete this.userList[client.sessionId];
            if (this.idConnCount[userId] > 0)
                return;
            delete this.idConnCount[userId];
            const conn = yield db_1.pool.connect();
            try {
                yield conn.query("BEGIN");
                yield conn.query("DELETE FROM usersonline WHERE user_id=$1;", [userId]);
                yield conn.query("UPDATE users SET last_seen=now() where id = $1", [
                    userId,
                ]);
                yield conn.query("COMMIT");
            }
            catch (e) {
                logger_1.log.error(e);
                yield conn.query("ROLLBACK");
            }
            finally {
                conn.release();
            }
        });
    }
    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose() {
        logger_1.log.info("LOBBY HAS BEEN DISPOSED OF");
    }
}
exports.Lobby = Lobby;
//# sourceMappingURL=lobby.room.js.map