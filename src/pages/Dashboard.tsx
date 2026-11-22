import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, loadResumes } from '../lib/supabase'

export default function Dashboard() {
  const [resumes, setResumes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || '')
        try {
          const data = await loadResumes(user.id)
          setResumes(data || [])
        } catch {
          // table may not exist yet
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
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
          <div className="flex items-center gap-4">
            <span className="text-sm text-stone">{userEmail}</span>
            <button onClick={logout} className="text-sm text-stone hover:text-ink">
              Log out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-serif font-semibold mb-2">Dashboard</h1>
        <p className="text-stone mb-8">Your resumes and scores.</p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="text-sm text-stone mb-1">Total Resumes</div>
            <div className="text-3xl font-semibold">{resumes.length}</div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="text-sm text-stone mb-1">Latest ATS Score</div>
            <div className="text-3xl font-semibold text-accent">
              {resumes[0]?.ats_score ?? '—'}
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="text-sm text-stone mb-1">Top Score</div>
            <div className="text-3xl font-semibold">
              {resumes.length ? Math.max(...resumes.map(r => r.ats_score || 0)) : '—'}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-8">
          <Link to="/builder" className="inline-block bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg font-medium">
            Create New Resume
          </Link>
          <Link to="/upload" className="inline-block border border-border px-6 py-3 rounded-lg font-medium">
            Upload Existing
          </Link>
        </div>

        {loading ? (
          <p className="text-stone">Loading resumes...</p>
        ) : resumes.length === 0 ? (
          <p className="text-stone">No resumes yet. Create your first one.</p>
        ) : (
          <div className="space-y-3">
            {resumes.map((r) => (
              <div key={r.id} className="bg-surface border border-border rounded-xl p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium">{r.content?.fullName || 'Untitled Resume'}</div>
                  <div className="text-xs text-stone">
                    Score: {r.ats_score ?? '—'} · {new Date(r.created_at).toLocaleDateString()}
                  </div>
                </div>
                <Link to="/builder" className="text-sm text-accent">Edit</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}