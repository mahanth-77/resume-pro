import { useState } from 'react'
import { extractTextFromFile } from '../lib/parseResume'
import { analyzeResumeText } from '../lib/detailedATS'
import { Link } from 'react-router-dom'

export default function Upload() {
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeResumeText> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const text = await extractTextFromFile(file)
      const result = analyzeResumeText(text)
      setAnalysis(result)
    } catch (err: any) {
      setError(err.message || 'Failed to parse file')
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
          <Link to="/builder" className="text-sm text-accent">Go to Builder</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-serif font-semibold mb-2">ATS Resume Checker</h1>
        <p className="text-stone mb-8">Upload a PDF or DOCX for a transparent, rule-based analysis. This is not the exact score of any external ATS.</p>

        <label className="block border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-accent mb-8">
          <input type="file" accept=".pdf,.docx" onChange={handleFile} className="hidden" />
          <div className="text-stone">{loading ? 'Analyzing...' : 'Click to upload PDF or DOCX'}</div>
        </label>

        {error && <p className="text-warning mb-4">{error}</p>}

        {analysis && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="text-5xl font-semibold text-accent mb-2">{analysis.overall}<span className="text-xl text-stone">/100</span></div>
              <p className="text-xs text-stone mb-6">Transparent score based on structure, action verbs, keywords, and length.</p>
              <div className="space-y-4">
                {analysis.categories.map(c => (
                  <div key={c.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{c.name}</span>
                      <span>{c.score}/{c.max}</span>
                    </div>
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: `${(c.score / c.max) * 100}%` }} />
                    </div>
                    {c.issues.length > 0 && (
                      <ul className="text-xs text-warning mt-1 list-disc list-inside">
                        {c.issues.map((iss, i) => <li key={i}>{iss}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <h3 className="font-serif text-xl font-semibold mb-4">Improvement Suggestions</h3>
              {analysis.improvedSuggestions.length === 0 ? (
                <p className="text-stone text-sm">Strong structure detected. Minor refinements possible in the builder.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {analysis.improvedSuggestions.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-accent">→</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="font-medium mb-2">Original Extracted Text (preview)</h4>
                <pre className="text-xs text-stone bg-background p-3 rounded max-h-48 overflow-auto whitespace-pre-wrap">
                  {analysis.originalText.slice(0, 800)}{analysis.originalText.length > 800 ? '...' : ''}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}