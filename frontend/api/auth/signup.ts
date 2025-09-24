import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_utils/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const schema = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(6) })

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' })
  const { name, email, password } = parsed.data
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(409).json({ error: 'Email in use' })
  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { name, email, password: hash } })
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!)
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
}


