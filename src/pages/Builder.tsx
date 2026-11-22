import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { calculateATSScore } from '../lib/atsScore'
import { improveResume } from '../lib/improveResume'
import { supabase, saveResume } from '../lib/supabase'

type Experience = { title: string; company: string; dates: string; bullets: string }
type Education = { degree: string; school: string; dates: string }
type Project = { name: string; description: string; link: string }
type Certification = { name: string; issuer: string; date: string }

type ResumeData = {
  fullName: string
  headline: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  portfolio: string
  summary: string
  experience: Experience[]
  internships: Experience[]
  education: Education[]
  skills: string
  projects: Project[]
  certifications: Certification[]
  achievements: string
}

const initialData: ResumeData = {
  fullName: '',
  headline: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  portfolio: '',
  summary: '',
  experience: [{ title: '', company: '', dates: '', bullets: '' }],
  internships: [{ title: '', company: '', dates: '', bullets: '' }],
  education: [{ degree: '', school: '', dates: '' }],
  skills: '',
  projects: [{ name: '', description: '', link: '' }],
  certifications: [{ name: '', issuer: '', date: '' }],
  achievements: '',
}

const steps = [
  { id: 'personal', label: 'Personal' },
  { id: 'summary', label: 'Summary' },
  { id: 'experience', label: 'Experience' },
  { id: 'internships', label: 'Internships' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certs', label: 'Certifications' },
  { id: 'achievements', label: 'Achievements' },
]

const templates = [
  { id: 'classic', name: 'Classic' },
  { id: 'modern', name: 'Modern' },
  { id: 'minimal', name: 'Minimal' },
]

export default function Builder() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<ResumeData>(initialData)
  const [showScore, setShowScore] = useState(false)
  const [template, setTemplate] = useState('classic')
  const [saving, setSaving] = useState(false)

  const update = (field: keyof ResumeData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const score = useMemo(() => calculateATSScore({
    ...data,
    experience: [...data.experience, ...data.internships],
  }), [data])

  const applyImprovements = () => {
    const improved = improveResume({
      ...data,
      experience: [...data.experience, ...data.internships],
    }) as any
    setData({ ...data, ...improved, experience: improved.experience?.slice(0, data.experience.length) || data.experience })
    setShowScore(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Please sign in to save.')
        return
      }
      await saveResume(user.id, data, score.overall)
      alert('Resume saved!')
    } catch (err: any) {
      alert(err.message || 'Save failed. Check Supabase setup.')
    } finally {
      setSaving(false)
    }
  }

  const downloadPDF = () => window.print()

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const prev = () => setStep((s) => Math.max(s - 1, 0))

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
          <div className="flex items-center gap-2">
            <select value={template} onChange={(e) => setTemplate(e.target.value)} className="text-sm border border-border rounded-lg px-2 py-1.5">
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button onClick={() => setShowScore(!showScore)} className="text-sm border border-border px-3 py-1.5 rounded-lg">
              Score: {score.overall}/100
            </button>
            <button onClick={applyImprovements} className="text-sm border border-accent text-accent px-3 py-1.5 rounded-lg">
              Improve
            </button>
            <button onClick={handleSave} disabled={saving} className="text-sm border border-border px-3 py-1.5 rounded-lg">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={downloadPDF} className="bg-accent text-white text-sm px-4 py-2 rounded-lg">
              Download PDF
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6 grid lg:grid-cols-5 gap-8 print:block">
        <div className="lg:col-span-2 print:hidden">
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="flex gap-1 mb-6 overflow-x-auto text-xs">
              {steps.map((s, i) => (
                <button key={s.id} onClick={() => setStep(i)} className={`px-3 py-1.5 rounded-full whitespace-nowrap ${i === step ? 'bg-accent text-white' : 'bg-background text-stone'}`}>
                  {s.label}
                </button>
              ))}
            </div>
            {step === 0 && (
              <div className="space-y-3">
                <h2 className="font-serif text-xl font-semibold">Personal Info</h2>
                <input placeholder="Full Name" value={data.fullName} onChange={e => update('fullName', e.target.value)} className="w-full border border-border rounded-lg px-3 py-2" />
                <input placeholder="Professional Headline" value={data.headline} onChange={e => update('headline', e.target.value)} className="w-full border border-border rounded-lg px-3 py-2" />
                <input placeholder="Email" value={data.email} onChange={e => update('email', e.target.value)} className="w-full border border-border rounded-lg px-3 py-2" />
                <input placeholder="Phone" value={data.phone} onChange={e => update('phone', e.target.value)} className="w-full border border-border rounded-lg px-3 py-2" />
                <input placeholder="Location" value={data.location} onChange={e => update('location', e.target.value)} className="w-full border border-border rounded-lg px-3 py-2" />
                <input placeholder="LinkedIn URL" value={data.linkedin} onChange={e => update('linkedin', e.target.value)} className="w-full border border-border rounded-lg px-3 py-2" />
                <input placeholder="GitHub URL" value={data.github} onChange={e => update('github', e.target.value)} className="w-full border border-border rounded-lg px-3 py-2" />
                <input placeholder="Portfolio URL" value={data.portfolio} onChange={e => update('portfolio', e.target.value)} className="w-full border border-border rounded-lg px-3 py-2" />
              </div>
            )}
            {step === 1 && (
              <div className="space-y-3">
                <h2 className="font-serif text-xl font-semibold">Summary</h2>
                <textarea placeholder="Professional summary" value={data.summary} onChange={e => update('summary', e.target.value)} rows={6} className="w-full border border-border rounded-lg px-3 py-2" />
              </div>
            )}
            {step === 2 && (
              <div className="space-y-3">
                <h2 className="font-serif text-xl font-semibold">Experience</h2>
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="border border-border rounded-lg p-3 space-y-2">
                    <input placeholder="Title" value={exp.title} onChange={e => { const u = [...data.experience]; u[idx].title = e.target.value; update('experience', u) }} className="w-full border rounded px-2 py-1.5 text-sm" />
                    <input placeholder="Company" value={exp.company} onChange={e => { const u = [...data.experience]; u[idx].company = e.target.value; update('experience', u) }} className="w-full border rounded px-2 py-1.5 text-sm" />
                    <input placeholder="Dates" value={exp.dates} onChange={e => { const u = [...data.experience]; u[idx].dates = e.target.value; update('experience', u) }} className="w-full border rounded px-2 py-1.5 text-sm" />
                    <textarea placeholder="Bullets (one per line)" value={exp.bullets} onChange={e => { const u = [...data.experience]; u[idx].bullets = e.target.value; update('experience', u) }} rows={3} className="w-full border rounded px-2 py-1.5 text-sm" />
                  </div>
                ))}
                <button onClick={() => update('experience', [...data.experience, { title: '', company: '', dates: '', bullets: '' }])} className="text-sm text-accent">+ Add</button>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-3">
                <h2 className="font-serif text-xl font-semibold">Internships</h2>
                {data.internships.map((exp, idx) => (
                  <div key={idx} className="border border-border rounded-lg p-3 space-y-2">
                    <input placeholder="Role" value={exp.title} onChange={e => { const u = [...data.internships]; u[idx].title = e.target.value; update('internships', u) }} className="w-full border rounded px-2 py-1.5 text-sm" />
                    <input placeholder="Company" value={exp.company} onChange={e => { const u = [...data.internships]; u[idx].company = e.target.value; update('internships', u) }} className="w-full border rounded px-2 py-1.5 text-sm" />
                    <input placeholder="Dates" value={exp.dates} onChange={e => { const u = [...data.internships]; u[idx].dates = e.target.value; update('internships', u) }} className="w-full border rounded px-2 py-1.5 text-sm" />
                    <textarea placeholder="Bullets" value={exp.bullets} onChange={e => { const u = [...data.internships]; u[idx].bullets = e.target.value; update('internships', u) }} rows={3} className="w-full border rounded px-2 py-1.5 text-sm" />
                  </div>
                ))}
                <button onClick={() => update('internships', [...data.internships, { title: '', company: '', dates: '', bullets: '' }])} className="text-sm text-accent">+ Add</button>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-3">
                <h2 className="font-serif text-xl font-semibold">Education</h2>
                {data.education.map((edu, idx) => (
                  <div key={idx} className="border border-border rounded-lg p-3 space-y-2">
                    <input placeholder="Degree" value={edu.degree} onChange={e => { const u = [...data.education]; u[idx].degree = e.target.value; update('education', u) }} className="w-full border rounded px-2 py-1.5 text-sm" />
                    <input placeholder="School" value={edu.school} onChange={e => { const u = [...data.education]; u[idx].school = e.target.value; update('education', u) }} className="w-full border rounded px-2 py-1.5 text-sm" />
                    <input placeholder="Dates" value={edu.dates} onChange={e => { const u = [...data.education]; u[idx].dates = e.target.value; update('education', u) }} className="w-full border rounded px-2 py-1.5 text-sm" />
                  </div>
                ))}
                <button onClick={() => update('education', [...data.education, { degree: '', school: '', dates: '' }])} className="text-sm text-accent">+ Add</button>
              </div>
            )}
            {step === 5 && (
              <div className="space-y-3">
                <h2 className="font-serif text-xl font-semibold">Skills</h2>
                <textarea placeholder="Skills (comma or line separated)" value={data.skills} onChange={e => update('skills', e.target.value)} rows={5} className="w-full border border-border rounded-lg px-3 py-2" />
              </div>
            )}
            {step === 6 && (
              <div className="space-y-3">
                <h2 className="font-serif text-xl font-semibold">Projects</h2>
                {data.projects.map((p, idx) => (
                  <div key={idx} className="border border-border rounded-lg p-3 space-y-2">
                    <input placeholder="Project Name" value={p.name} onChange={e => { const u = [...data.projects]; u[idx].name = e.target.value; update('projects', u) }} className="w-full border rounded px-2 py-1.5 text-sm" />
                    <textarea placeholder="Description" value={p.description} onChange={e => { const u = [...data.projects]; u[idx].description = e.target.value; update('projects', u) }} rows={2} className="w-full border rounded px-2 py-1.5 text-sm" />
                    <input placeholder="Link" value={p.link} onChange={e => { const u = [...data.projects]; u[idx].link = e.target.value; update('projects', u) }} className="w-full border rounded px-2 py-1.5 text-sm" />
                  </div>
                ))}
                <button onClick={() => update('projects', [...data.projects, { name: '', description: '', link: '' }])} className="text-sm text-accent">+ Add</button>
              </div>
            )}
            {step === 7 && (
              <div className="space-y-3">
                <h2 className="font-serif text-xl font-semibold">Certifications</h2>
                {data.certifications.map((c, idx) => (
                  <div key={idx} className="border border-border rounded-lg p-3 space-y-2">
                    <input placeholder="Name" value={c.name} onChange={e => { const u = [...data.certifications]; u[idx].name = e.target.value; update('certifications', u) }} className="w-full border rounded px-2 py-1.5 text-sm" />
                    <input placeholder="Issuer" value={c.issuer} onChange={e => { const u = [...data.certifications]; u[idx].issuer = e.target.value; update('certifications', u) }} className="w-full border rounded px-2 py-1.5 text-sm" />
                    <input placeholder="Date" value={c.date} onChange={e => { const u = [...data.certifications]; u[idx].date = e.target.value; update('certifications', u) }} className="w-full border rounded px-2 py-1.5 text-sm" />
                  </div>
                ))}
                <button onClick={() => update('certifications', [...data.certifications, { name: '', issuer: '', date: '' }])} className="text-sm text-accent">+ Add</button>
              </div>
            )}
            {step === 8 && (
              <div className="space-y-3">
                <h2 className="font-serif text-xl font-semibold">Achievements</h2>
                <textarea placeholder="Achievements (one per line)" value={data.achievements} onChange={e => update('achievements', e.target.value)} rows={5} className="w-full border border-border rounded-lg px-3 py-2" />
              </div>
            )}
            <div className="flex justify-between mt-6">
              <button onClick={prev} disabled={step === 0} className="px-4 py-2 border border-border rounded-lg text-sm disabled:opacity-40">Back</button>
              <button onClick={next} disabled={step === steps.length - 1} className="px-4 py-2 bg-accent text-white rounded-lg text-sm disabled:opacity-40">Next</button>
            </div>
          </div>
          {showScore && (
            <div className="mt-4 bg-surface border border-border rounded-2xl p-6 text-sm">
              <div className="text-3xl font-semibold text-accent mb-2">{score.overall}<span className="text-base text-stone">/100</span></div>
              <p className="text-xs text-stone mb-3">Transparent rule-based score. Not an external ATS score.</p>
              {score.strengths.length > 0 && <div className="mb-2"><strong className="text-success">Strengths:</strong> {score.strengths.join(', ')}</div>}
              {score.improvements.length > 0 && <div><strong className="text-warning">Improvements:</strong> {score.improvements.join(', ')}</div>}
            </div>
          )}
        </div>
        <div className="lg:col-span-3">
          <div className={`bg-white border border-border rounded-2xl shadow-sm p-8 min-h-[900px] text-sm print:border-0 print:shadow-none print:p-4 ${template === 'minimal' ? 'font-sans' : ''}`}>
            <div className={`text-center mb-6 ${template === 'modern' ? 'border-b-2 border-accent pb-4' : ''}`}>
              <h1 className={`font-serif font-semibold tracking-tight ${template === 'minimal' ? 'text-xl' : 'text-2xl'}`}>{data.fullName || 'Your Name'}</h1>
              <div className="text-accent text-xs tracking-widest uppercase mt-1">{data.headline || 'Headline'}</div>
              <div className="text-stone text-xs mt-2 space-x-2">
                {data.email && <span>{data.email}</span>}
                {data.phone && <span>· {data.phone}</span>}
                {data.location && <span>· {data.location}</span>}
                {data.linkedin && <span>· LinkedIn</span>}
                {data.github && <span>· GitHub</span>}
                {data.portfolio && <span>· Portfolio</span>}
              </div>
            </div>
            {data.summary && (
              <div className="mb-4">
                <div className="text-xs font-medium text-accent tracking-wider mb-1">SUMMARY</div>
                <p className="text-stone leading-relaxed">{data.summary}</p>
              </div>
            )}
            {data.experience.some(e => e.title) && (
              <div className="mb-4">
                <div className="text-xs font-medium text-accent tracking-wider mb-1">EXPERIENCE</div>
                {data.experience.filter(e => e.title).map((exp, i) => (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between font-medium text-sm">
                      <span>{exp.title}</span><span className="text-stone text-xs">{exp.dates}</span>
                    </div>
                    <div className="text-stone text-xs">{exp.company}</div>
                    {exp.bullets && <ul className="list-disc list-inside text-stone text-xs mt-0.5">{exp.bullets.split('\n').filter(Boolean).map((b, j) => <li key={j}>{b.replace(/^[-•]\s*/, '')}</li>)}</ul>}
                  </div>
                ))}
              </div>
            )}
            {data.internships.some(e => e.title) && (
              <div className="mb-4">
                <div className="text-xs font-medium text-accent tracking-wider mb-1">INTERNSHIPS</div>
                {data.internships.filter(e => e.title).map((exp, i) => (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between font-medium text-sm">
                      <span>{exp.title}</span><span className="text-stone text-xs">{exp.dates}</span>
                    </div>
                    <div className="text-stone text-xs">{exp.company}</div>
                    {exp.bullets && <ul className="list-disc list-inside text-stone text-xs mt-0.5">{exp.bullets.split('\n').filter(Boolean).map((b, j) => <li key={j}>{b.replace(/^[-•]\s*/, '')}</li>)}</ul>}
                  </div>
                ))}
              </div>
            )}
            {data.education.some(e => e.degree) && (
              <div className="mb-4">
                <div className="text-xs font-medium text-accent tracking-wider mb-1">EDUCATION</div>
                {data.education.filter(e => e.degree).map((edu, i) => (
                  <div key={i} className="mb-1">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{edu.degree}</span><span className="text-stone text-xs">{edu.dates}</span>
                    </div>
                    <div className="text-stone text-xs">{edu.school}</div>
                  </div>
                ))}
              </div>
            )}
            {data.skills && (
              <div className="mb-4">
                <div className="text-xs font-medium text-accent tracking-wider mb-1">SKILLS</div>
                <p className="text-stone text-xs">{data.skills}</p>
              </div>
            )}
            {data.projects.some(p => p.name) && (
              <div className="mb-4">
                <div className="text-xs font-medium text-accent tracking-wider mb-1">PROJECTS</div>
                {data.projects.filter(p => p.name).map((p, i) => (
                  <div key={i} className="mb-1 text-xs">
                    <span className="font-medium">{p.name}</span>
                    {p.description && <span className="text-stone"> — {p.description}</span>}
                  </div>
                ))}
              </div>
            )}
            {data.certifications.some(c => c.name) && (
              <div className="mb-4">
                <div className="text-xs font-medium text-accent tracking-wider mb-1">CERTIFICATIONS</div>
                {data.certifications.filter(c => c.name).map((c, i) => (
                  <div key={i} className="text-xs text-stone">{c.name} {c.issuer && `· ${c.issuer}`} {c.date && `· ${c.date}`}</div>
                ))}
              </div>
            )}
            {data.achievements && (
              <div>
                <div className="text-xs font-medium text-accent tracking-wider mb-1">ACHIEVEMENTS</div>
                <ul className="list-disc list-inside text-stone text-xs">
                  {data.achievements.split('\n').filter(Boolean).map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
