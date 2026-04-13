// api/src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { db } from '../database/client'
import { users } from '../database/schema'
import { eq } from 'drizzle-orm'

// Express Request mein user type add karo
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        name: string
        githubToken?: string | null
      }
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Header check karo
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token nahi mila — login karo' })
    }

    // Token nikalo
    const token = authHeader.split(' ')[1]

    // JWT verify karo
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any

    // DB se actual user lo
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1)

    if (!user) {
      return res.status(401).json({ error: 'User nahi mila' })
    }

    // Request mein attach karo
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      githubToken: user.githubToken,
    }

    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}