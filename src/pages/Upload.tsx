import { useState } from 'react'
import { extractTextFromFile, parseResumeText } from '../lib/parseResume'
import { calculateATSScore } from '../lib/atsScore'
import { Link } from 'react-router-dom'

export default function Upload() {
  const [text, setText] = useState('')
  const [score, setScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const extracted = await extractTextFromFile(file)
      setText(extracted)
      const parsed = parseResumeText(extracted)
      const fakeData = {
        fullName: '',
        headline: '',
        email: '',
        phone: '',
        location: '',
        summary: parsed.summary,
        experience: [{ title: 'Imported', company: '', dates: '', bullets: extracted.slice(0, 500) }],
        education: [],
        skills: parsed.skills,
      }
      const result = calculateATSScore(fakeData)
      setScore(result.overall)
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

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-serif font-semibold mb-4">Upload Existing Resume</h1>
        <p className="text-stone mb-8">Upload a PDF or DOCX to extract text and get an initial ATS score.</p>

        <label className="block border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:border-accent transition-colors">
          <input type="file" accept=".pdf,.docx" onChange={handleFile} className="hidden" />
          <div className="text-stone">
            {loading ? 'Parsing...' : 'Click to upload PDF or DOCX'}
          </div>
        </label>

        {error && <p className="text-warning mt-4 text-sm">{error}</p>}

        {score !== null && (
          <div className="mt-8 bg-surface border border-border rounded-xl p-6">
            <div className="text-4xl font-semibold text-accent mb-2">{score}<span className="text-lg text-stone">/100</span></div>
            <p className="text-sm text-stone">Initial score based on extracted content. Open the builder to refine it.</p>
          </div>
        )}

        {text && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Extracted Text</h3>
            <pre className="bg-surface border border-border rounded-xl p-4 text-xs text-stone whitespace-pre-wrap max-h-96 overflow-auto">{text}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
