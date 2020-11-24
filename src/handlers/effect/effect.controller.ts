import { Request, Response } from 'express'
import { pool } from "../../db"

export const create = async function (req: Request, res: Response) {
    const skill = req.body
    const text = "INSERT INTO effect (data,skill_id) values ($1, $2)";
 
    try {
        await pool.query(text, skill)
        return res.json({ code: 1 })
    } catch (err) {
        return res.json({ code: 0 })
    }

}

export const get = async function (req: Request, res: Response) {
    const values = [req.body];
    const TEXT = "select * from effect where skill_id = any ($1);"
    try {
        const data = await pool.query(TEXT, values);
        return res.json(data.rows)
    } catch (err) {
        res.status(500);
        return res.json({}) 
    }
}

export const find = async function (req: Request, res: Response) {
    const id = req.params.id
    const value = [id]
    const text = "SELECT * FROM effect WHERE id = $1 order by priority DESC"

    try {
        const data = await pool.query(text, value)
        return res.json(data.rows[0])
    } catch (err) {
        return res.status(500)
    }
}

export const update = async function (req: Request, res: Response) {
    const text = "UPDATE effect SET data = $1, skill_id = $3, priority = $4 where id = $2"
    const values = req.body
    try {
        await pool.query(text, values)
        return res.json({code:1})
    } catch(err){
        return res.json({code:0})
    }
}

export const remove = async function(req: Request, res:Response) {
    const text = "DELETE from effect where id = $1";
    const values = [Number(req.params.id)]
    try {
        await pool.query(text, values)
        res.status(200)
        return res.json({code:1})
    }catch(err){
        res.status(404)
        throw(err)
    }
}