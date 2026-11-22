import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { calculateATSScore } from '../lib/atsScore'

type ResumeData = {
  fullName: string
  headline: string
  email: string
  phone: string
  location: string
  summary: string
  experience: Array<{ title: string; company: string; dates: string; bullets: string }>
  education: Array<{ degree: string; school: string; dates: string }>
  skills: string
}

const initialData: ResumeData = {
  fullName: '',
  headline: '',
  email: '',
  phone: '',
  location: '',
  summary: '',
  experience: [{ title: '', company: '', dates: '', bullets: '' }],
  education: [{ degree: '', school: '', dates: '' }],
  skills: '',
}

const steps = [
  { id: 'personal', label: 'Personal Info' },
  { id: 'summary', label: 'Summary' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
]

export default function Builder() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<ResumeData>(initialData)
  const [showScore, setShowScore] = useState(false)

  const update = (field: keyof ResumeData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const score = useMemo(() => calculateATSScore(data), [data])

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const prev = () => setStep((s) => Math.max(s - 1, 0))

  const downloadPDF = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-background print:bg-white">
      <nav className="border-b border-border bg-surface print:hidden">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
              <span className="text-white font-serif font-semibold text-lg">R</span>
            </div>
            <span className="font-serif text-xl font-semibold">Resume Pro</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowScore(!showScore)}
              className="text-sm border border-border px-3 py-1.5 rounded-lg hover:bg-background"
            >
              ATS Score: {score.overall}/100
            </button>
            <button onClick={downloadPDF} className="bg-accent text-white text-sm px-4 py-2 rounded-lg">
              Download PDF
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6 grid lg:grid-cols-5 gap-8 print:block">
        {/* Left: Form */}
        <div className="lg:col-span-2 print:hidden">
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="flex gap-1 mb-6 overflow-x-auto">
              {steps.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setStep(i)}
                  className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap ${
                    i === step ? 'bg-accent text-white' : 'bg-background text-stone'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {step === 0 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl font-semibold">Personal Information</h2>
                <input placeholder="Full Name" value={data.fullName} onChange={(e) => update('fullName', e.target.value)} className="w-full border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:border-accent" />
                <input placeholder="Professional Headline" value={data.headline} onChange={(e) => update('headline', e.target.value)} className="w-full border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:border-accent" />
                <input placeholder="Email" value={data.email} onChange={(e) => update('email', e.target.value)} className="w-full border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:border-accent" />
                <input placeholder="Phone" value={data.phone} onChange={(e) => update('phone', e.target.value)} className="w-full border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:border-accent" />
                <input placeholder="Location" value={data.location} onChange={(e) => update('location', e.target.value)} className="w-full border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:border-accent" />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl font-semibold">Professional Summary</h2>
                <textarea placeholder="Write a concise professional summary..." value={data.summary} onChange={(e) => update('summary', e.target.value)} rows={6} className="w-full border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:border-accent" />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl font-semibold">Work Experience</h2>
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-2 border border-border rounded-lg p-4">
                    <input placeholder="Job Title" value={exp.title} onChange={(e) => { const u = [...data.experience]; u[idx].title = e.target.value; update('experience', u) }} className="w-full border border-border rounded-lg px-3 py-2" />
                    <input placeholder="Company" value={exp.company} onChange={(e) => { const u = [...data.experience]; u[idx].company = e.target.value; update('experience', u) }} className="w-full border border-border rounded-lg px-3 py-2" />
                    <input placeholder="Dates (e.g. 2021 – Present)" value={exp.dates} onChange={(e) => { const u = [...data.experience]; u[idx].dates = e.target.value; update('experience', u) }} className="w-full border border-border rounded-lg px-3 py-2" />
                    <textarea placeholder="Bullet points (one per line)" value={exp.bullets} onChange={(e) => { const u = [...data.experience]; u[idx].bullets = e.target.value; update('experience', u) }} rows={4} className="w-full border border-border rounded-lg px-3 py-2" />
                  </div>
                ))}
                <button onClick={() => update('experience', [...data.experience, { title: '', company: '', dates: '', bullets: '' }])} className="text-sm text-accent">+ Add Experience</button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl font-semibold">Education</h2>
                {data.education.map((edu, idx) => (
                  <div key={idx} className="space-y-2 border border-border rounded-lg p-4">
                    <input placeholder="Degree" value={edu.degree} onChange={(e) => { const u = [...data.education]; u[idx].degree = e.target.value; update('education', u) }} className="w-full border border-border rounded-lg px-3 py-2" />
                    <input placeholder="School" value={edu.school} onChange={(e) => { const u = [...data.education]; u[idx].school = e.target.value; update('education', u) }} className="w-full border border-border rounded-lg px-3 py-2" />
                    <input placeholder="Dates" value={edu.dates} onChange={(e) => { const u = [...data.education]; u[idx].dates = e.target.value; update('education', u) }} className="w-full border border-border rounded-lg px-3 py-2" />
                  </div>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl font-semibold">Skills</h2>
                <textarea placeholder="List skills separated by commas or new lines" value={data.skills} onChange={(e) => update('skills', e.target.value)} rows={5} className="w-full border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:border-accent" />
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button onClick={prev} disabled={step === 0} className="px-4 py-2 border border-border rounded-lg text-sm disabled:opacity-40">Back</button>
              <button onClick={next} disabled={step === steps.length - 1} className="px-4 py-2 bg-accent text-white rounded-lg text-sm disabled:opacity-40">Next</button>
            </div>
          </div>

          {showScore && (
            <div className="mt-6 bg-surface border border-border rounded-2xl p-6">
              <h3 className="font-serif text-xl font-semibold mb-4">ATS Compatibility Score</h3>
              <div className="text-4xl font-semibold text-accent mb-4">{score.overall}<span className="text-lg text-stone">/100</span></div>
              <p className="text-xs text-stone mb-4">This is a transparent, rule-based score based on structure, completeness, and ATS best practices. It is not the exact score of any external ATS system.</p>
              <div className="space-y-3 mb-4">
                {score.categories.map((c) => (
                  <div key={c.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{c.name}</span>
                      <span>{c.score}/{c.max}</span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: `${(c.score / c.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              {score.strengths.length > 0 && (
                <div className="mb-3">
                  <div className="text-sm font-medium text-success mb-1">Strengths</div>
                  <ul className="text-sm text-stone list-disc list-inside">{score.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
              )}
              {score.improvements.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-warning mb-1">Suggested Improvements</div>
                  <ul className="text-sm text-stone list-disc list-inside">{score.improvements.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Live Preview */}
        <div className="lg:col-span-3 print:col-span-1">
          <div className="bg-white border border-border rounded-2xl shadow-sm p-8 min-h-[800px] text-sm print:border-0 print:shadow-none print:p-0">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-serif font-semibold tracking-tight">{data.fullName || 'Your Name'}</h1>
              <div className="text-accent text-xs tracking-widest uppercase mt-1">{data.headline || 'Professional Headline'}</div>
              <div className="text-stone text-xs mt-2 space-x-3">
                {data.email && <span>{data.email}</span>}
                {data.phone && <span>· {data.phone}</span>}
                {data.location && <span>· {data.location}</span>}
              </div>
            </div>

            {data.summary && (
              <div className="mb-5">
                <div className="text-xs font-medium text-accent tracking-wider mb-1.5">PROFESSIONAL SUMMARY</div>
                <p className="text-stone leading-relaxed">{data.summary}</p>
              </div>
            )}

            {data.experience.some(e => e.title) && (
              <div className="mb-5">
                <div className="text-xs font-medium text-accent tracking-wider mb-2">EXPERIENCE</div>
                {data.experience.map((exp, i) => exp.title && (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between font-medium">
                      <span>{exp.title}</span>
                      <span className="text-stone text-xs">{exp.dates}</span>
                    </div>
                    <div className="text-stone text-xs mb-1">{exp.company}</div>
                    {exp.bullets && (
                      <ul className="list-disc list-inside text-stone text-xs space-y-0.5">
                        {exp.bullets.split('\n').filter(Boolean).map((b, j) => (
                          <li key={j}>{b.replace(/^[-•]\s*/, '')}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {data.education.some(e => e.degree) && (
              <div className="mb-5">
                <div className="text-xs font-medium text-accent tracking-wider mb-2">EDUCATION</div>
                {data.education.map((edu, i) => edu.degree && (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{edu.degree}</span>
                      <span className="text-stone text-xs">{edu.dates}</span>
                    </div>
                    <div className="text-stone text-xs">{edu.school}</div>
                  </div>
                ))}
              </div>
            )}

            {data.skills && (
              <div>
                <div className="text-xs font-medium text-accent tracking-wider mb-1.5">SKILLS</div>
                <p className="text-stone text-xs">{data.skills}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
