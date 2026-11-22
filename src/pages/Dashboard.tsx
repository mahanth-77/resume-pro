import { Link } from 'react-router-dom'

export default function Dashboard() {
  const logout = () => {
    localStorage.removeItem('resume-pro-auth')
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
              <span className="text-white font-serif font-semibold text-lg">R</span>
            </div>
            <span className="font-serif text-xl font-semibold">Resume Pro</span>
          </div>
          <button onClick={logout} className="text-sm text-stone hover:text-ink">
            Log out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-serif font-semibold mb-2">Dashboard</h1>
        <p className="text-stone mb-8">Your resumes and scores.</p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="text-sm text-stone mb-1">Total Resumes</div>
            <div className="text-3xl font-semibold">0</div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="text-sm text-stone mb-1">Latest ATS Score</div>
            <div className="text-3xl font-semibold text-accent">—</div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="text-sm text-stone mb-1">Top Score</div>
            <div className="text-3xl font-semibold">—</div>
          </div>
        </div>

        <Link
          to="/builder"
          className="inline-block bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg font-medium"
        >
          Create New Resume
        </Link>
      </div>
    </div>
  )
}