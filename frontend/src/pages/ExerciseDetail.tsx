import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type Exercise = {
  id: string
  name: string
  description: string
  muscleGroup: string
  equipment: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  videoUrl?: string
}

export function ExerciseDetail() {
  const { id } = useParams()
  const { data } = useQuery({
    queryKey: ['exercise', id],
    queryFn: async () => {
      const res = await axios.get(`/api/exercises/${id}`)
      return res.data as Exercise
    }
  })

  if (!data) return null

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{data.name}</h1>
      <div className="text-sm text-neutral-500">{data.muscleGroup} • {data.equipment} • {data.difficulty}</div>
      {data.videoUrl && (
        <div className="aspect-video">
          <iframe className="w-full h-full" src={embedUrl(data.videoUrl)} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
      )}
      <p>{data.description}</p>
    </div>
  )
}

function embedUrl(url: string) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop()
    return `https://www.youtube.com/embed/${videoId}`
  }
  if (url.includes('vimeo.com')) {
    const id = url.split('/').pop()
    return `https://player.vimeo.com/video/${id}`
  }
  return url
}


