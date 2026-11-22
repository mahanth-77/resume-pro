export function improveResume(data: {
  fullName: string
  headline: string
  email: string
  phone: string
  location: string
  summary: string
  experience: Array<{ title: string; company: string; dates: string; bullets: string }>
  education: Array<{ degree: string; school: string; dates: string }>
  skills: string
}) {
  const improved = { ...data, experience: data.experience.map(e => ({ ...e })), education: data.education.map(e => ({ ...e })) }

  // Improve summary: make it more professional if thin
  if (improved.summary.trim().length > 0 && improved.summary.trim().length < 120) {
    improved.summary = improved.summary.trim()
      .replace(/^(i am|i'm|my name is)/i, '')
      .trim()
    if (!improved.summary.toLowerCase().includes('experience') && improved.experience.some(e => e.title)) {
      improved.summary += ' Experienced professional focused on delivering clear results.'
    }
  }

  // Improve experience bullets: strengthen action verbs where weak
  const weakVerbs = /^(worked|helped|did|made|was responsible for|assisted)/i
  const strongMap: Record<string, string> = {
    worked: 'Executed',
    helped: 'Supported',
    did: 'Delivered',
    made: 'Created',
    'was responsible for': 'Led',
    assisted: 'Contributed to',
  }

  improved.experience = improved.experience.map(exp => {
    if (!exp.bullets.trim()) return exp
    const lines = exp.bullets.split('\n').map(line => {
      const clean = line.replace(/^[-•]\s*/, '').trim()
      if (!clean) return line
      const match = clean.match(weakVerbs)
      if (match) {
        const verb = match[0].toLowerCase()
        const replacement = strongMap[verb] || 'Drove'
        return clean.replace(weakVerbs, replacement)
      }
      return clean
    })
    return { ...exp, bullets: lines.filter(Boolean).join('\n') }
  })

  // Ensure headline exists
  if (!improved.headline.trim() && improved.experience[0]?.title) {
    improved.headline = improved.experience[0].title
  }

  return improved
}
