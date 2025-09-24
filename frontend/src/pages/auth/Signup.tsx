import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

type Form = { name: string; email: string; password: string }

export function Signup() {
  const { register, handleSubmit } = useForm<Form>()
  const navigate = useNavigate()
  const onSubmit = async (data: Form) => {
    const res = await axios.post('/api/auth/signup', data)
    localStorage.setItem('token', res.data.token)
    navigate('/dashboard')
  }
  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-80 space-y-3 border rounded p-6">
        <h1 className="text-xl font-semibold">Create account</h1>
        <input className="w-full border rounded px-3 py-2 bg-transparent" placeholder="Name" {...register('name', { required: true })} />
        <input className="w-full border rounded px-3 py-2 bg-transparent" placeholder="Email" type="email" {...register('email', { required: true })} />
        <input className="w-full border rounded px-3 py-2 bg-transparent" placeholder="Password" type="password" {...register('password', { required: true, minLength: 6 })} />
        <button className="w-full bg-brand-accent text-black rounded py-2">Sign up</button>
        <div className="text-sm text-center">Already have an account? <Link to="/login" className="underline">Login</Link></div>
      </form>
    </div>
  )
}


