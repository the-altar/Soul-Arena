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
exports.getPosts = exports.postComment = exports.updateThread = exports.postThread = exports.findThread = exports.news = void 0;
const db_1 = require("../../db");
exports.news = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const text = `
        SELECT t.id, t.created_at, t.title, t."content", t.post_count, 
            JSON_BUILD_OBJECT('username', u.username, 'avatar', u.avatar) as "author" 
        FROM thread AS t 
        LEFT JOIN users AS u 
            ON t.author = u.id 	
        WHERE t.site_area=0
        ORDER BY created_at DESC
        limit 5;`;
    try {
        const docs = yield db_1.pool.query(text);
        res.status(200).json(docs.rows);
    }
    catch (err) {
        res.status(501).end();
        throw (err);
    }
});
exports.findThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const siteArea = Number(req.params.siteArea);
    const text = `
        SELECT t.id, t.created_at, t.post_count, t.title, t."content",
        JSON_BUILD_OBJECT('username', u.username, 'avatar', u.avatar) as "author"
        FROM
            thread as t
        LEFT JOIN users AS u
            ON u.id = t.author
        WHERE t.id = $1 AND t.site_area = $2;
    `;
    try {
        const docs = yield db_1.pool.query(text, [id, siteArea]);
        return res.status(200).json(docs.rows[0]);
    }
    catch (err) {
        res.status(501).json({ success: false });
        throw (err);
    }
});
exports.postThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const {author, content, siteArea, title} = req.body
    const text = `insert into thread (site_area, title, content, author) values ($1, $2, $3, $4)`;
    try {
        yield db_1.pool.query(text, req.body);
        return res.status(200).json({ success: true });
    }
    catch (err) {
        res.status(501).end();
        throw (err);
    }
});
exports.updateThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const text = `UPDATE thread SET content = $2 where id = $1`;
    try {
        yield db_1.pool.query(text, req.body);
        return res.status(200).json({ success: true, content: req.body[1] });
    }
    catch (err) {
        return res.status(501).json({ success: false });
    }
});
exports.postComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const text = `INSERT INTO post ("content",author,thread_id,site_area) values ($1, $2, $3, $4)`;
    const sql = `UPDATE thread SET post_count = post_count + 1 WHERE id = $1`;
    try {
        yield db_1.pool.query(text, req.body);
        yield db_1.pool.query(sql, [req.body[2]]);
        return res.status(200).json({ success: true });
    }
    catch (err) {
        res.status(501).end();
        throw (err);
    }
});
exports.getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = Number(req.params.limit);
    const threadId = Number(req.params.id);
    const sql = `
        select post.id, post."content", post.created_at, jsonb_build_object('username', users.username, 'rank', user_rank."name", 'avatar', users.avatar) as "author"  from post 
        join users on post.author = users.id 
        join user_rank on user_rank.id = users.user_rank_id
        where post.thread_id = $1 and post.id > $2 and post.id < $3;
    `;
    try {
        const data = yield db_1.pool.query(sql, [threadId, (limit - 50), limit]);
        return res.status(200).json(data.rows);
    }
    catch (err) {
        res.status(501);
        throw (err);
    }
});
//# sourceMappingURL=thread.controller.js.map