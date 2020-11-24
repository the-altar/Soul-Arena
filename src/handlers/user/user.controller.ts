import { Request, Response, NextFunction } from "express"
import { hash, compare } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'
import { join } from 'path'
import { pool } from "../../db"

export async function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies.session_id
        if (token) {
            const u: any = await verify(token, process.env.TOKEN_SECRET as string)
            req.res.locals.user = u
            req.res.locals.guest = false
        } else req.res.locals.guest = true
        next()
    } catch (err) {
        res.status(401).end()
        throw (err)
    }
}

export const mount = async function (req: Request, res: Response) {

    if (req.res.locals.guest) {
        return res.json({ authLevel: -1, auth: false })
    }
    const u = req.res.locals.user
    return res.json({
        username: u.username,
        authLevel: u.authLevel,
        id: u.id,
        auth: u.auth
    })

}

export const userCharacters = async (req: Request, res: Response) => {
    const text = `
        select
            jsonb_build_object('id', entity.id, 'isFree', entity.isfree) || entity.data || jsonb_build_object('skills', jsonb_agg(sk.data order by sk.priority)) as data
        from
            entity
        join skill as sk on
            sk.entity_id = entity.id
        where entity.released = true    
        group by
            entity.id;        
    `

    try {
        const r = await pool.query(text)
        return res.json(r.rows)
    } catch (err) {
        res.status(500).send("Something went wrong...")
        throw(err)
    }
}

export const register = async (req: Request, res: Response) => {
    const text = `INSERT INTO users (username, passhash, email) values ($1, $2, $3);`
    try {
        const hashed = await hash(req.body.password, 10)
        await pool.query(text, [req.body.username, hashed, req.body.email])
        return res.json({ success: true })
    } catch (err) {
        return res.json({ success: false, err: err })
    }
}

export const login = async (req: Request, res: Response) => {
    const text = `select u.id, u.username, u.passhash, ur.auth_level as "authLevel"
    from users as u
    left join user_rank as ur 
        on u.user_rank_id = ur.id
    where u.username = $1;`
    try {
        const data = await pool.query(text, [req.body.username])
        const user = data.rows[0]
        if (data.rowCount === 0) return res.json({ success: false })

        const match = await compare(req.body.password, user.passhash)

        if (match) {
            delete user.passhash
            const token = sign({
                id: user.id,
                authLevel: user.authLevel,
                auth: true,
                username: user.username
            }, process.env.TOKEN_SECRET, { expiresIn: '365d' })

            res.cookie('session_id', token, { httpOnly: true, maxAge: 365 * 24 * 60 * 60 * 1000 })
            return res.json({ userData: user, success: true })
        }
        return res.json({ success: false })

    } catch (err) {
        throw (err)
    }
}

export const logout = async (req: Request, res: Response) => {
    res.clearCookie("session_id")
    return res.status(200).end()
}

export const user = async (req: Request, res: Response) => {

    const username = req.body.username || req.params.username

    const text = `select u.id, u.avatar, u.username, 
    jsonb_build_object('elo', lb.elo, 'wins', lb.wins, 'losses', lb.losses, 'streak', lb.streak, 'maxStreak', lb.max_streak, 'exp', lb.experience, 'seasonRank', lb.season_rank, 'seasonLevel', lb.season_level) as season, 
    jsonb_build_object('authLevel', ur.auth_level, 'rankName', ur."name") as rank 
    from users as u 
    left join ladderboard as lb 
        on u.id = lb.user_id 
    left join user_rank as ur 
        on u.user_rank_id = ur.id
    where u.username = $1;
    `
    try {
        const doc = await pool.query(text, [username])
        res.status(200).json(doc.rows[0])
    } catch (err) {
        throw (err)
    }

}

export const uploadAvatar = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const filename = id * 100
    const file: any = req.files.file
    const p = join(process.cwd(), `/public/img/avatars/${filename}.jpg`)

    try {
        await file.mv(p)
        await pool.query("UPDATE users SET avatar = $1 where id = $2", [
            `${filename}.jpg`,
            id
        ])
        return res.status(200).json({ success: true })
    } catch (err) {
        res.status(501).end()
        throw (err)
    }

}

export const defaultAvatar = async (req: Request, res: Response) => {
    const filename = req.params.filename + '.jpg'
    const id = Number(req.params.id)
    try {
        await pool.query("UPDATE users SET avatar = $1 where id = $2", [filename, id])
        return res.status(200).json({ success: true })
    } catch (err) {
        return res.status(500).json({ success: false })
    }
}
