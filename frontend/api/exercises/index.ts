import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_utils/prisma'
import jwt from 'jsonwebtoken'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const q = String(req.query.q ?? '').trim()
    const group = String(req.query.group ?? '').trim()
    const equipment = String(req.query.equipment ?? '').trim()
    const where: any = {
      approved: true,
      AND: [
        q ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] } : {},
        group ? { muscleGroup: { contains: group, mode: 'insensitive' } } : {},
        equipment ? { equipment: { contains: equipment, mode: 'insensitive' } } : {},
      ],
    }
    const list = await prisma.exercise.findMany({ where, orderBy: { name: 'asc' } })
    return res.json(list)
  }
  if (req.method === 'POST') {
    const header = req.headers.authorization
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    let user: any
    try { user = jwt.verify(token, process.env.JWT_SECRET!) } catch { return res.status(401).json({ error: 'Unauthorized' }) }
    const { name, description, muscleGroup, equipment, difficulty, videoUrl } = req.body ?? {}
    if (!name || !description || !muscleGroup || !equipment || !difficulty) return res.status(400).json({ error: 'Invalid input' })
    const ex = await prisma.exercise.create({ data: { name, description, muscleGroup, equipment, difficulty, videoUrl, approved: false, createdById: user.id } })
    return res.json(ex)
  }
  return res.status(405).end()
}


