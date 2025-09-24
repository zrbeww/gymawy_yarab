import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_utils/prisma'
import jwt from 'jsonwebtoken'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  let user: any
  try { user = jwt.verify(token, process.env.JWT_SECRET!) } catch { return res.status(401).json({ error: 'Unauthorized' }) }
  const items = await prisma.workoutItem.findMany({ where: { workout: { userId: user.id } }, include: { workout: true }, orderBy: { workout: { date: 'asc' } } })
  const byDate = new Map<string, number>()
  for (const it of items) {
    const d = it.workout.date.toISOString().slice(0, 10)
    byDate.set(d, (byDate.get(d) ?? 0) + it.sets * it.reps * it.weightKg)
  }
  res.json([...byDate.entries()].map(([x, y]) => ({ x, y })))
}


