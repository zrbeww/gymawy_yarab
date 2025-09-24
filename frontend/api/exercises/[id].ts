import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_utils/prisma'
import jwt from 'jsonwebtoken'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = String(req.query.id)
  if (req.method === 'GET') {
    const ex = await prisma.exercise.findUnique({ where: { id } })
    if (!ex || !ex.approved) return res.status(404).json({ error: 'Not found' })
    return res.json(ex)
  }
  if (req.method === 'POST' && String(req.query.action) === 'approve') {
    const header = req.headers.authorization
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    let user: any
    try { user = jwt.verify(token, process.env.JWT_SECRET!) } catch { return res.status(401).json({ error: 'Unauthorized' }) }
    if (user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })
    const ex = await prisma.exercise.update({ where: { id }, data: { approved: true } })
    return res.json(ex)
  }
  return res.status(405).end()
}


