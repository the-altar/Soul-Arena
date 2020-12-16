"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const config_json_1 = require("./config.json");
exports.pool = new pg_1.Pool({
    connectionString: process.env.NODE_ENV == "dev"
        ? `postgres://${config_json_1.postgres.user}:${config_json_1.postgres.password}@${config_json_1.postgres.host}:${config_json_1.postgres.port}/${config_json_1.postgres.database}`
        : process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});
//# sourceMappingURL=db.js.map