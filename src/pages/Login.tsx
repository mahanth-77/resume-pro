import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock auth — replace with real Supabase Auth later
    if (email && password) {
      localStorage.setItem('resume-pro-auth', 'true')
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-8">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
            <span className="text-white font-serif font-semibold text-lg">R</span>
          </div>
          <span className="font-serif text-xl font-semibold">Resume Pro</span>
        </div>
        <h1 className="text-2xl font-serif font-semibold mb-2">Welcome back</h1>
        <p className="text-stone text-sm mb-6">Sign in to continue building your resume.</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent hover:bg-accent-hover text-white py-2.5 rounded-lg font-medium transition-colors"
          >
            Sign in
          </button>
        </form>
        <p className="text-xs text-stone mt-6 text-center">
          Demo mode: any email + password works. Replace with Supabase Auth for production.
        </p>
      </div>
    </div>
  )
}