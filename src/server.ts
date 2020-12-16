import { Server } from 'colyseus'
import { createServer } from 'http'
import { App } from "./express"
import {Battle, Lobby, RankedLobby} from "./lib/colyseus"

export const Coliseum = class {
    private server: Server
    private port: number;

    constructor(port: number) {
        this.port = port
        this.server = new Server({
            server: createServer(new App().run())
        })
        this.rooms()
    }

    private rooms():void {
        this.server.define('rankedLobby', RankedLobby)
        this.server.define("battle", Battle)
        this.server.define("lobby", Lobby)
    }

    public run():void{
        this.server.listen(this.port)
        console.log(`Server is running on port ${this.port}`)
    } 
}
