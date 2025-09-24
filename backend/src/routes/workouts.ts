import { Router } from 'express'
import { prisma } from '../lib/db'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'

export const router = Router()

router.use(requireAuth)

router.get('/', async (req, res) => {
  const list = await prisma.workout.findMany({
    where: { userId: req.user!.id },
    orderBy: { date: 'desc' },
  })
  res.json(list)
})

const createSchema = z.object({
  date: z.string().datetime().optional(),
  durationMinutes: z.number().int().min(1),
  items: z.array(z.object({
    exerciseId: z.string(),
    sets: z.number().int().min(1),
    reps: z.number().int().min(1),
    weightKg: z.number().nonnegative(),
  })).min(1)
})

router.post('/', async (req, res) => {
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' })
  const data = parsed.data
  const workout = await prisma.workout.create({
    data: {
      userId: req.user!.id,
      date: data.date ? new Date(data.date) : undefined,
      durationMinutes: data.durationMinutes,
      items: {
        create: data.items.map(i => ({
          exerciseId: i.exerciseId,
          sets: i.sets,
          reps: i.reps,
          weightKg: i.weightKg,
        }))
      }
    },
    include: { items: true }
  })
  res.json(workout)
})


