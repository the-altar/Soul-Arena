import { Request, Response } from 'express'
import { pool } from "../../db"

export const create = async function (req: Request, res: Response) {
    const text = "INSERT INTO skill (data) values ($1)";

    try {
        await pool.query(text, req.body)
        return res.json({ code: 1 })
    } catch (err) {
        return res.json({ code: 0 })
    }

}

export const get = async function (req: Request, res: Response) {
    try {
        const data = await pool.query("SELECT * FROM skill order by priority");
        return res.json(data.rows)
    } catch (err) {
        return res.status(500);
    }
}

export const destroy = async function(req:Request, res:Response) {
    const skillId = req.params.id
    try {
        const res = await pool.query("DELETE from skill where id = $1 RETURNING data", [skillId])
        res.rows[0].data
    }catch(e){
        console.log()
    }
}

export const find = async function (req: Request, res: Response) {
    const id = req.params.id
    const value = [id]
    const text = "SELECT * FROM skill WHERE id = $1"

    try {
        const data = await pool.query(text, value)
        return res.json(data.rows[0])
    } catch (err) {
        return res.status(500)
    }
}

export const update = async function (req: Request, res: Response) {
    const text = "UPDATE skill SET data = $1, entity_id = $3, priority = $4  where id = $2"
    const values = req.body
    try {
        await pool.query(text, values)
        return res.json({code:1})
    } catch(err){
        return res.json({code:0})
    }

}

export const getIds = async function(req: Request, res: Response){
    const text = "SELECT id, data -> 'name' AS name from skill";
    try {
        const r = await pool.query(text)
        return res.json(r.rows)
    }catch(err){
        res.status(500)
        return res.send("Something went wrong...")
    }
}