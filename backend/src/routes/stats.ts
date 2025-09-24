import { Router } from 'express'
import { prisma } from '../lib/db'
import { requireAuth } from '../middleware/auth'

export const router = Router()

router.use(requireAuth)

router.get('/volume', async (req, res) => {
  const items = await prisma.workoutItem.findMany({
    where: { workout: { userId: req.user!.id } },
    include: { workout: true },
    orderBy: { workout: { date: 'asc' } }
  })
  const byDate = new Map<string, number>()
  for (const it of items) {
    const d = it.workout.date.toISOString().slice(0, 10)
    const vol = it.sets * it.reps * it.weightKg
    byDate.set(d, (byDate.get(d) ?? 0) + vol)
  }
  res.json([...byDate.entries()].map(([x, y]) => ({ x, y })))
})

router.get('/prs', async (req, res) => {
  const items = await prisma.workoutItem.groupBy({
    by: ['exerciseId'],
    where: { workout: { userId: req.user!.id } },
    _max: { weightKg: true }
  })
  const withNames = await Promise.all(items.map(async (g) => {
    const ex = await prisma.exercise.findUnique({ where: { id: g.exerciseId } })
    return { x: ex?.name ?? g.exerciseId, y: g._max.weightKg ?? 0 }
  }))
  res.json(withNames)
})


