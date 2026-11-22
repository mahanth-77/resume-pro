export type DetailedScore = {
  overall: number
  categories: {
    name: string
    score: number
    max: number
    issues: string[]
    suggestions: string[]
  }[]
  originalText: string
  improvedSuggestions: string[]
}

export function analyzeResumeText(text: string): DetailedScore {
  const lower = text.toLowerCase()
  const wordCount = text.split(/\s+/).length

  const categories = [
    {
      name: 'Structure & Sections',
      score: 0,
      max: 25,
      issues: [] as string[],
      suggestions: [] as string[],
    },
    {
      name: 'Action Verbs & Impact',
      score: 0,
      max: 25,
      issues: [] as string[],
      suggestions: [] as string[],
    },
    {
      name: 'Keywords & Relevance',
      score: 0,
      max: 25,
      issues: [] as string[],
      suggestions: [] as string[],
    },
    {
      name: 'Length & Readability',
      score: 0,
      max: 25,
      issues: [] as string[],
      suggestions: [] as string[],
    },
  ]

  // Structure
  const hasSummary = /summary|profile|objective/i.test(text)
  const hasExperience = /experience|work history|employment/i.test(text)
  const hasEducation = /education|degree|university|college/i.test(text)
  const hasSkills = /skills|technical|competencies/i.test(text)
  if (hasSummary) categories[0].score += 6
  else { categories[0].issues.push('Missing clear summary section'); categories[0].suggestions.push('Add a Professional Summary section at the top') }
  if (hasExperience) categories[0].score += 7
  else { categories[0].issues.push('Experience section not clearly labeled'); categories[0].suggestions.push('Use a standard heading like EXPERIENCE') }
  if (hasEducation) categories[0].score += 6
  else categories[0].suggestions.push('Include an Education section')
  if (hasSkills) categories[0].score += 6
  else categories[0].suggestions.push('Add a Skills section with relevant keywords')

  // Action verbs
  const strongVerbs = ['led', 'developed', 'implemented', 'increased', 'reduced', 'managed', 'created', 'designed', 'optimized', 'delivered']
  const verbCount = strongVerbs.filter(v => lower.includes(v)).length
  categories[1].score = Math.min(25, verbCount * 4)
  if (verbCount < 3) {
    categories[1].issues.push('Few strong action verbs detected')
    categories[1].suggestions.push('Start bullet points with strong action verbs (Led, Developed, Increased, etc.)')
  }

  // Keywords
  const keywords = ['project', 'team', 'analysis', 'strategy', 'result', 'improve', 'collaborate', 'data']
  const kwCount = keywords.filter(k => lower.includes(k)).length
  categories[2].score = Math.min(25, kwCount * 3)
  if (kwCount < 4) {
    categories[2].issues.push('Limited relevant keywords')
    categories[2].suggestions.push('Incorporate more industry-relevant keywords naturally')
  }

  // Length
  if (wordCount > 150 && wordCount < 800) categories[3].score = 25
  else if (wordCount < 150) {
    categories[3].score = 10
    categories[3].issues.push('Resume is quite short')
    categories[3].suggestions.push('Expand key sections with more detail and achievements')
  } else {
    categories[3].score = 15
    categories[3].issues.push('Resume may be too long')
    categories[3].suggestions.push('Aim for 1 page (freshers) or 2 pages max')
  }

  const overall = categories.reduce((s, c) => s + c.score, 0)
  const improvedSuggestions = categories.flatMap(c => c.suggestions).filter(Boolean)

  return {
    overall,
    categories,
    originalText: text,
    improvedSuggestions,
  }
}
