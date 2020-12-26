import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies.session_id;
    if (!token) return res.status(401);

    const u: any = await verify(token, process.env.TOKEN_SECRET as string);
    if (!u.auth) return res.status(401).json({});
    req.res.locals.token = u;
    req.res.locals.id = u.id;
    next();
  } catch (err) {
    res.status(401).json({});
    throw err;
  }
}

export async function authUserGameSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies.session_id;
    if (!token) return res.status(301).redirect("/login");

    const u: any = await verify(token, process.env.TOKEN_SECRET as string);
    if (!u.auth) return res.status(301).redirect("/login");
    req.res.locals.token = u;
    req.res.locals.id = u.id;
    next();
  } catch (err) {
    return res.status(301).redirect("/login");
  }
}

export async function authenticateAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies.session_id;
    if (!token) return res.status(301).redirect(process.env.ROOT_URL);

    const u: any = await verify(token, process.env.TOKEN_SECRET as string);
    if (u.authLevel < 100)
      return res.status(301).redirect(process.env.ROOT_URL);
    else next();
  } catch (err) {
    return res.status(301).redirect(process.env.ROOT_URL);
  }
}

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
