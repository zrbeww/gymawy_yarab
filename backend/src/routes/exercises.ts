import { Router } from 'express'
import { prisma } from '../lib/db'
import { z } from 'zod'
import { requireAuth, requireAdmin } from '../middleware/auth'

export const router = Router()

router.get('/', async (req, res) => {
  const q = String(req.query.q ?? '').trim()
  const group = String(req.query.group ?? '').trim()
  const equipment = String(req.query.equipment ?? '').trim()
  const where = {
    approved: true,
    AND: [
      q ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] } : {},
      group ? { muscleGroup: { contains: group, mode: 'insensitive' } } : {},
      equipment ? { equipment: { contains: equipment, mode: 'insensitive' } } : {},
    ],
  }
  const list = await prisma.exercise.findMany({ where, orderBy: { name: 'asc' } })
  res.json(list)
})

router.get('/:id', async (req, res) => {
  const ex = await prisma.exercise.findUnique({ where: { id: req.params.id } })
  if (!ex || !ex.approved) return res.status(404).json({ error: 'Not found' })
  res.json(ex)
})

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  muscleGroup: z.string().min(1),
  equipment: z.string().min(1),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).transform(v => v as string),
  videoUrl: z.string().url().optional(),
})

router.post('/', requireAuth, async (req, res) => {
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' })
  const ex = await prisma.exercise.create({ data: { ...parsed.data, approved: false, createdById: req.user!.id } })
  res.json(ex)
})

router.post('/:id/approve', requireAuth, requireAdmin, async (req, res) => {
  const ex = await prisma.exercise.update({ where: { id: req.params.id }, data: { approved: true } })
  res.json(ex)
})


