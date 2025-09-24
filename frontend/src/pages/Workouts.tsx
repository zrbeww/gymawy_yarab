import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type Workout = {
  id: string
  date: string
  durationMinutes: number
}

export function Workouts() {
  const { data } = useQuery({
    queryKey: ['workouts'],
    queryFn: async () => {
      const res = await axios.get('/api/workouts')
      return res.data as Workout[]
    }
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Workouts</h1>
      <div className="grid gap-3">
        {data?.map(w => (
          <div key={w.id} className="border rounded p-4">
            <div className="font-medium">{new Date(w.date).toLocaleString()}</div>
            <div className="text-sm text-neutral-500">Duration: {w.durationMinutes} min</div>
          </div>
        ))}
      </div>
    </div>
  )
}


