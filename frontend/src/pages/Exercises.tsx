import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useState } from 'react'

type Exercise = {
  id: string
  name: string
  description: string
  muscleGroup: string
  equipment: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export function Exercises() {
  const [q, setQ] = useState('')
  const [group, setGroup] = useState('')
  const [equipment, setEquipment] = useState('')

  const { data } = useQuery({
    queryKey: ['exercises', q, group, equipment],
    queryFn: async () => {
      const res = await axios.get('/api/exercises', { params: { q, group, equipment } })
      return res.data as Exercise[]
    }
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Exercises</h1>
      <div className="flex flex-wrap gap-2">
        <input className="border rounded px-3 py-2 bg-transparent" placeholder="Search" value={q} onChange={e => setQ(e.target.value)} />
        <input className="border rounded px-3 py-2 bg-transparent" placeholder="Muscle group" value={group} onChange={e => setGroup(e.target.value)} />
        <input className="border rounded px-3 py-2 bg-transparent" placeholder="Equipment" value={equipment} onChange={e => setEquipment(e.target.value)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map(ex => (
          <Link key={ex.id} to={`/exercises/${ex.id}`} className="border rounded p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800">
            <div className="font-medium">{ex.name}</div>
            <div className="text-sm text-neutral-500">{ex.muscleGroup} • {ex.equipment}</div>
            <p className="text-sm mt-2 line-clamp-3">{ex.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}


