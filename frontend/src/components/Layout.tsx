import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export function Layout() {
  const [dark, setDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark'
  })
  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-brand.accent text-black' : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'}`

  return (
    <div className="min-h-screen flex bg-white dark:bg-neutral-900">
      <aside className="w-60 hidden md:flex flex-col gap-2 p-4 border-r border-neutral-200 dark:border-neutral-800">
        <div className="text-xl font-bold text-brand-accent">Gymawy</div>
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/exercises" className={linkClass}>Exercises</NavLink>
        <NavLink to="/workouts" className={linkClass}>Workouts</NavLink>
        <NavLink to="/progress" className={linkClass}>Progress</NavLink>
        <NavLink to="/profile" className={linkClass}>Profile</NavLink>
        <div className="mt-auto flex gap-2">
          <button onClick={() => setDark(d => !d)} className="px-3 py-2 rounded-md bg-neutral-200 dark:bg-neutral-800">{dark ? 'Light' : 'Dark'}</button>
          <button onClick={logout} className="px-3 py-2 rounded-md bg-red-500 text-white">Logout</button>
        </div>
      </aside>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}


