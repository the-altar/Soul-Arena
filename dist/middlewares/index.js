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
                return res.clearCookie("session_id").status(401).json({});
            req.res.locals.token = u;
            req.res.locals.id = u.id;
            next();
        }
        catch (err) {
            res.clearCookie("session_id").status(401).json({});
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
                return res.status(301).redirect("/login");
            const u = yield jsonwebtoken_1.verify(token, process.env.TOKEN_SECRET);
            if (!u.auth)
                return res.clearCookie("session_id").status(301).redirect("/login");
            req.res.locals.token = u;
            req.res.locals.id = u.id;
            next();
        }
        catch (err) {
            return res.clearCookie("session_id").status(301).redirect("/login");
        }
    });
}
exports.authUserGameSession = authUserGameSession;
function authenticateAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.cookies.session_id;
            if (!token)
                return res.status(301).redirect(process.env.ROOT_URL);
            const u = yield jsonwebtoken_1.verify(token, process.env.TOKEN_SECRET);
            if (u.authLevel < 100)
                return res.clearCookie("session_id").status(301).redirect(process.env.ROOT_URL);
            else
                next();
        }
        catch (err) {
            return res.clearCookie("session_id").status(301).redirect(process.env.ROOT_URL);
        }
    });
}
exports.authenticateAdmin = authenticateAdmin;
//# sourceMappingURL=index.js.map