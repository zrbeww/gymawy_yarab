import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { router as authRouter } from './routes/auth'
import { router as exercisesRouter } from './routes/exercises'
import { router as workoutsRouter } from './routes/workouts'
import { router as statsRouter } from './routes/stats'

const app = express()

app.use(cors({ origin: process.env.APP_ORIGIN?.split(',') ?? '*', credentials: true }))
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.use('/api/auth', authRouter)
app.use('/api/exercises', exercisesRouter)
app.use('/api/workouts', workoutsRouter)
app.use('/api/stats', statsRouter)

const port = Number(process.env.PORT ?? 4000)
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`)
})


