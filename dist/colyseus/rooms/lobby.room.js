"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lobby = void 0;
const colyseus_1 = require("colyseus");
class Lobby extends colyseus_1.Room {
    // When room is initialized
    onCreate(options) { }
    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth(client, options, request) { }
    // When client successfully join the room
    onJoin(client, options, auth) { }
    // When a client leaves the room
    onLeave(client, consented) { }
    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose() { }
}
exports.Lobby = Lobby;
//# sourceMappingURL=lobby.room.js.map