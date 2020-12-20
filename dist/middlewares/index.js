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
exports.authenticateAdmin = exports.authUserGameSession = exports.authenticate = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.cookies.session_id;
            if (!token)
                return res.status(401);
            const u = yield jsonwebtoken_1.verify(token, process.env.TOKEN_SECRET);
            if (!u.auth)
                return res.status(401);
            req.res.locals.token = u;
            req.res.locals.id = u.id;
            next();
        }
        catch (err) {
            res.status(401);
            throw err;
        }
    });
}
exports.authenticate = authenticate;
function authUserGameSession(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.cookies.session_id;
            if (!token)
                return res.status(200).json(generateGuest());
            const u = yield jsonwebtoken_1.verify(token, process.env.TOKEN_SECRET);
            if (!u.auth)
                return res.status(200).json(generateGuest());
            req.res.locals.token = u;
            req.res.locals.id = u.id;
            next();
        }
        catch (err) {
            res.status(200).json(generateGuest());
            throw err;
        }
    });
}
exports.authUserGameSession = authUserGameSession;
function authenticateAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.cookies.session_id;
            if (!token)
                return res.status(401).end();
            const u = yield jsonwebtoken_1.verify(token, process.env.TOKEN_SECRET);
            if (u.authLevel < 100)
                return res.status(401).end();
            else
                next();
        }
        catch (err) {
            res.status(401).end();
            throw err;
        }
    });
}
exports.authenticateAdmin = authenticateAdmin;
const generateGuest = () => {
    return {
        rank: { authLevel: -1, rankName: "Guest" },
        id: Math.floor(Math.random() * 1000000 + 1) * -1,
        avatar: "1.jpg",
        coins: 0,
        username: `GUEST-${Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, "")
            .substr(0, 2)}`,
        season: {
            elo: 1000,
            wins: 0,
            losses: 0,
            streak: 0,
            exp: 0,
            maxStreak: 0,
            seasonRank: "Rookie",
            seasonLevel: 0,
        },
        unlocked: [Number],
    };
};
//# sourceMappingURL=index.js.map