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
exports.Queue = void 0;
const colyseus_1 = require("colyseus");
const db_1 = require("../../../db");
const enums_1 = require("../../engine/enums");
const logger_1 = require("../../logger");
class ClientManager {
    constructor() {
        this.clientList = {};
        this.onlineList = {};
        this.ipCheck = {};
    }
    isClientConnected(pid) {
        if (this.onlineList[pid] !== undefined)
            return true;
        return false;
    }
    addIpAddress(ip, playerId) {
        this.ipCheck[ip] = playerId;
        this.onlineList[playerId] = ip;
    }
    addClient(id, payload, connection) {
        this.clientList[id] = {
            player: payload.player,
            team: payload.team.map((e) => {
                return Object.assign({}, e.data);
            }),
            connection: connection,
        };
    }
    getClientConnectionBySessionId(id) {
        return this.clientList[id];
    }
    getAllClientsSessionId() {
        return Object.keys(this.clientList);
    }
    getClientBySessionId(id) {
        return Object.assign({}, this.clientList[id]);
    }
    getAllClients() {
        return this.clientList;
    }
    removeClientBySessionId(id) {
        if (this.clientList[id] === undefined) {
            return;
        }
        const playerId = this.clientList[id].player.id;
        const ip = this.onlineList[playerId];
        delete this.onlineList[playerId];
        delete this.clientList[id];
        delete this.ipCheck[ip];
    }
    countPlayersOnline() {
        return Object.keys(this.clientList).length;
    }
    getRankedMap(roomCode) {
        const seen = {};
        let mappedHash = Object.keys(this.clientList)
            .sort((a, b) => {
            return this.clientList[a].player.elo - this.clientList[b].player.elo;
        })
            .map((sortedKey) => {
            return this.clientList[sortedKey];
        });
        if (roomCode === enums_1.BattleRooms.rankedBattle) {
            mappedHash = mappedHash.filter((e) => {
                const ipAddress = this.onlineList[e.player.id];
                if (seen[ipAddress]) {
                    return false;
                }
                else {
                    seen[ipAddress] = true;
                    return true;
                }
            });
        }
        return mappedHash;
    }
}
class Queue extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.manager = new ClientManager();
        this.evaluateGroupInterval = 5000;
    }
    // When room is initialized
    onCreate(options) {
        this.targetRoom = options.targetRoom;
        this.targetRoomCode = enums_1.BattleRooms[options.targetRoom];
        this.setPatchRate(null);
        this.setSimulationInterval(() => __awaiter(this, void 0, void 0, function* () {
            try {
                const queue = this.manager.getRankedMap(this.targetRoomCode);
                for (let i = 1; i < queue.length; i = i + 2) {
                    const room = yield colyseus_1.matchMaker.createRoom(this.targetRoom, {});
                    for (let j = i - 1; j <= i; j++) {
                        const p = queue[j];
                        const seat = yield colyseus_1.matchMaker.reserveSeatFor(room, {
                            player: p.player,
                            team: p.team,
                        });
                        p.connection.send("seat", seat);
                        this.manager.removeClientBySessionId(queue[j].connection.sessionId);
                    }
                }
            }
            catch (err) {
                throw err;
            }
        }), this.evaluateGroupInterval);
    }
    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth(client, options, request) {
        if (this.manager.isClientConnected(options.player.id))
            return false;
        logger_1.log.error(request.headers["x-forwarded-for"], request.connection.remoteAddress);
        this.manager.addIpAddress(request.connection.remoteAddress, options.player.id);
        return true;
    }
    // When client successfully join the room
    onJoin(client, options, auth) {
        return __awaiter(this, void 0, void 0, function* () {
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
                options.team = (yield db_1.pool.query(sql, options.team)).rows;
                this.manager.addClient(client.sessionId, options, client);
                this.broadcast("connected_clients", this.manager.countPlayersOnline());
            }
            catch (err) {
                client.close();
                logger_1.log.error(err);
            }
        });
    }
    // When a client leaves the room
    onLeave(client, consented) {
        this.manager.removeClientBySessionId(client.sessionId);
        this.broadcast("connected_clients", this.manager.countPlayersOnline());
    }
    onDispose() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.Queue = Queue;
//# sourceMappingURL=queue.room.js.map