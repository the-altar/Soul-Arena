import {Coliseum} from "./server"
const port: number = Number(process.env.PORT); 
new Coliseum(port).run()
