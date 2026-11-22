import { useState } from 'react'
import { improveWithAI, matchJobDescription } from '../lib/aiImprove'
import { analyzeResumeText } from '../lib/detailedATS'
import { Link } from 'react-router-dom'

export default function Improve() {
  const [original, setOriginal] = useState('')
  const [improved, setImproved] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [gaps, setGaps] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const originalScore = original ? analyzeResumeText(original).overall : null
  const improvedScore = improved ? analyzeResumeText(improved).overall : null

  const runImprove = async () => {
    if (!original.trim()) return
    setLoading(true)
    setError('')
    try {
      const result = await improveWithAI(original, jobDesc || undefined)
      setImproved(result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const runMatch = async () => {
    if (!original.trim() || !jobDesc.trim()) return
    setLoading(true)
    setError('')
    try {
      const result = await matchJobDescription(original, jobDesc)
      setGaps(result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
              <span className="text-white font-serif font-semibold text-lg">R</span>
            </div>
            <span className="font-serif text-xl font-semibold">Resume Pro</span>
          </Link>
          <Link to="/builder" className="text-sm text-accent">Builder</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-serif font-semibold mb-2">Intelligent Improvement</h1>
        <p className="text-stone mb-6">AI improves language and clarity while preserving every fact. Free Groq API key required.</p>

        {error && <p className="text-warning mb-4 text-sm">{error}</p>}

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Original Resume Text</label>
            <textarea
              value={original}
              onChange={e => setOriginal(e.target.value)}
              rows={12}
              placeholder="Paste your resume text here..."
              className="w-full border border-border rounded-xl px-3 py-2 text-sm"
            />
            {originalScore !== null && (
              <div className="mt-2 text-sm">Original Score: <span className="font-semibold text-accent">{originalScore}/100</span></div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Improved Version</label>
            <textarea
              value={improved}
              onChange={e => setImproved(e.target.value)}
              rows={12}
              placeholder="Improved text will appear here..."
              className="w-full border border-border rounded-xl px-3 py-2 text-sm"
            />
            {improvedScore !== null && (
              <div className="mt-2 text-sm">Improved Score: <span className="font-semibold text-accent">{improvedScore}/100</span></div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Target Job Description (optional)</label>
          <textarea
            value={jobDesc}
            onChange={e => setJobDesc(e.target.value)}
            rows={4}
            placeholder="Paste a job description for tailored improvement and gap analysis..."
            className="w-full border border-border rounded-xl px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={runImprove}
            disabled={loading || !original.trim()}
            className="bg-accent text-white px-5 py-2.5 rounded-lg text-sm disabled:opacity-50"
          >
            {loading ? 'Improving...' : 'Improve with AI'}
          </button>
          <button
            onClick={runMatch}
            disabled={loading || !original.trim() || !jobDesc.trim()}
            className="border border-border px-5 py-2.5 rounded-lg text-sm disabled:opacity-50"
          >
            Analyze Job Match
          </button>
        </div>

        {gaps && (
          <div className="bg-surface border border-border rounded-xl p-4">
            <h3 className="font-medium mb-2">Missing / Gap Analysis</h3>
            <pre className="text-sm text-stone whitespace-pre-wrap">{gaps}</pre>
          </div>
        )}
      </div>
    </div>
  )
}