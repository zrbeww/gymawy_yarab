import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_utils/prisma'
import jwt from 'jsonwebtoken'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  let user: any
  try { user = jwt.verify(token, process.env.JWT_SECRET!) } catch { return res.status(401).json({ error: 'Unauthorized' }) }
  const items = await prisma.workoutItem.groupBy({ by: ['exerciseId'], where: { workout: { userId: user.id } }, _max: { weightKg: true } })
  const withNames = await Promise.all(items.map(async (g) => {
    const ex = await prisma.exercise.findUnique({ where: { id: g.exerciseId } })
    return { x: ex?.name ?? g.exerciseId, y: g._max.weightKg ?? 0 }
  }))
  res.json(withNames)
}


