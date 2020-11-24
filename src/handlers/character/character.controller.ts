import { Request, Response } from 'express'
import { CharacterDB, ICharacterModel } from "../../models/character"
import { join } from 'path'
import { unlink, existsSync } from 'fs'
import { pool } from "../../db"

export const create = async (req: Request, res: Response) => {
    // Req.body = [released, charData, isFree]
    const text = "INSERT INTO entity (released, data, isfree) VALUES ($1, $2, $3)"
    try {
        await pool.query(text, req.body)
        return res.json({ code: 1 })
    } catch (err) {
        throw (err)
    }
}

export const update = async (req: Request, res: Response) => {
    // Req.body = [id, released, charData, isFree]
    const text = "UPDATE entity SET released = $2, data = $3, isfree = $4 WHERE id = $1"
    try {
        await pool.query(text, req.body)
        return res.json({ code: 1 })
    } catch (err) {
        return res.json({ code: 0 })
    }
}

export const find = async (req: Request, res: Response) => {
    try {
        const char = await pool.query("SELECT * from entity where entity.id = $1", [req.params.id])
        return res.json(char.rows[0])
    } catch (err) {
        console.error(err)
        return res.json({ code: 0 })
    }
}

export const remove = async (req: Request, res: Response) => {
    const char: ICharacterModel = req.body
    let pics: Array<string> = []

    char.skills.forEach(s => {
        pics.push(s.skillpic)
        pics.push(s.banner)
    })

    pics.push(char.facepic)
    pics.push(char.banner)

    pics.forEach(pic => {
        const p: string = join(process.cwd(), '/public/img/game/', pic + ".jpg")
        if (existsSync(p)) {
            unlink(p, () => { })
        }
    })

    try {
        await CharacterDB.deleteOne({ _id: char._id })
        return res.json({ code: 1 })
    }

    catch (err) {
        console.error(err)
        return res.json({ code: 0 })
    }
}

export const getAll = async (req: Request, res: Response) => {
    try {
        const docs = await pool.query("SELECT * from entity")
        return res.json(docs.rows)
    } catch (err) {
        console.error(err)
        return res.json(false)
    }
}

export const getIds = async (req: Request, res: Response) => {
    const text = "SELECT id, data -> 'name' AS name from entity";
    try {
        const r = await pool.query(text)
        return res.json(r.rows)
    } catch (err) {
        return res.status(500).end()
    }
}

export const purchase = async (req: Request, res: Response) => {
    const sql1 = `UPDATE users SET coins = coins - $1 where id = $2`
    const sql2 = `INSERT into obtained_entity (entity_id, user_id) VALUES ($1, $2)`
    try {
        await pool.query(sql1, [req.body.coins, req.body.userId])
        await pool.query(sql2, [req.body.characterId, req.body.userId])
        return res.json({ success: true })
    } catch (err) {
        res.json({ success: true })
        throw (err)
    }
}

export const upload = async (req: Request, res: Response) => {
    for (const file in req.files) {
        const f: any = req.files[file]
        const p = join(process.cwd(), '/public/img/game/', f.name + ".jpg")
        f.mv(p, (err: any) => {
            if (err) {
                console.log(err)
                return res.status(500).json({})
            }
        })
    }

    return res.send('File uploaded!');
}

export const uploadFiles = async (req: Request, res: Response) => {
    const response = []
    for (const file in req.files) {
        const f: any = req.files[file]
        const p = join(process.cwd(), '/public/img/game/', req.params.filename + ".jpg")
        f.mv(p, (err: any) => {
            if (err) {
                return res.status(500).json({})
            }
            response.push({ url: `http://localhost:3000/img/game/${req.params.filename}.jpg` })
        })
    }
    return 1
}
