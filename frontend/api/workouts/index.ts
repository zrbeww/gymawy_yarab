import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_utils/prisma'
import jwt from 'jsonwebtoken'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  let user: any
  try { user = jwt.verify(token, process.env.JWT_SECRET!) } catch { return res.status(401).json({ error: 'Unauthorized' }) }

  if (req.method === 'GET') {
    const list = await prisma.workout.findMany({ where: { userId: user.id }, orderBy: { date: 'desc' } })
    return res.json(list)
  }

  if (req.method === 'POST') {
    const data = req.body
    if (!data?.durationMinutes || !Array.isArray(data?.items) || data.items.length === 0) return res.status(400).json({ error: 'Invalid input' })
    const workout = await prisma.workout.create({
      data: {
        userId: user.id,
        date: data.date ? new Date(data.date) : undefined,
        durationMinutes: data.durationMinutes,
        items: { create: data.items.map((i: any) => ({ exerciseId: i.exerciseId, sets: i.sets, reps: i.reps, weightKg: i.weightKg })) }
      },
      include: { items: true }
    })
    return res.json(workout)
  }

  return res.status(405).end()
}


