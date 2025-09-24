import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

type Point = { x: string; y: number }

export function Progress() {
  const { data: volume } = useQuery({
    queryKey: ['stats-volume'],
    queryFn: async () => (await axios.get('/api/stats/volume')).data as Point[]
  })
  const { data: prs } = useQuery({
    queryKey: ['stats-prs'],
    queryFn: async () => (await axios.get('/api/stats/prs')).data as Point[]
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Progress</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded p-4">
          <div className="mb-2 font-medium">Training Volume</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volume ?? []}>
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="y" stroke="#7CFF6B" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="border rounded p-4">
          <div className="mb-2 font-medium">Personal Records</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prs ?? []}>
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="y" fill="#0b1b38" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}


