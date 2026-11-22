export type ScoreCategory = {
  name: string
  score: number
  max: number
  feedback: string
}

export type ATSResult = {
  overall: number
  categories: ScoreCategory[]
  strengths: string[]
  improvements: string[]
  missing: string[]
}

export function calculateATSScore(data: {
  fullName: string
  headline: string
  email: string
  phone: string
  location: string
  summary: string
  experience: Array<{ title: string; company: string; dates: string; bullets: string }>
  education: Array<{ degree: string; school: string; dates: string }>
  skills: string
}): ATSResult {
  const categories: ScoreCategory[] = []
  const strengths: string[] = []
  const improvements: string[] = []
  const missing: string[] = []

  // 1. Contact & Basics (20 pts)
  let contactScore = 0
  if (data.fullName.trim().length > 2) contactScore += 5
  else missing.push('Full name')
  if (data.email.includes('@')) contactScore += 5
  else missing.push('Valid email')
  if (data.phone.trim().length > 6) contactScore += 5
  else missing.push('Phone number')
  if (data.location.trim()) contactScore += 5
  else improvements.push('Add location for better ATS parsing')
  categories.push({
    name: 'Contact Information',
    score: contactScore,
    max: 20,
    feedback: contactScore === 20 ? 'Complete contact details' : 'Some contact fields are missing',
  })
  if (contactScore === 20) strengths.push('Complete contact information')

  // 2. Professional Summary (15 pts)
  const summaryLen = data.summary.trim().length
  let summaryScore = 0
  if (summaryLen > 40) summaryScore += 8
  if (summaryLen > 80 && summaryLen < 400) summaryScore += 7
  else if (summaryLen >= 400) improvements.push('Summary is quite long — aim for 3–5 concise lines')
  else if (summaryLen > 0) improvements.push('Expand your professional summary')
  else missing.push('Professional summary')
  categories.push({
    name: 'Professional Summary',
    score: summaryScore,
    max: 15,
    feedback: summaryScore >= 12 ? 'Strong summary' : 'Summary needs improvement',
  })
  if (summaryScore >= 12) strengths.push('Clear professional summary')

  // 3. Experience (30 pts)
  const validExp = data.experience.filter(e => e.title.trim() && e.company.trim())
  let expScore = 0
  if (validExp.length >= 1) expScore += 10
  if (validExp.length >= 2) expScore += 5
  const hasBullets = validExp.some(e => e.bullets.trim().length > 20)
  if (hasBullets) expScore += 10
  const hasMetrics = validExp.some(e => /\d+%|\d+\+|\$\d+|increased|reduced|improved/i.test(e.bullets))
  if (hasMetrics) expScore += 5
  else if (validExp.length > 0) improvements.push('Add measurable achievements (numbers, %, results) where possible')
  categories.push({
    name: 'Experience',
    score: expScore,
    max: 30,
    feedback: expScore >= 20 ? 'Solid experience section' : 'Experience section needs more detail',
  })
  if (expScore >= 20) strengths.push('Relevant work experience with details')
  if (validExp.length === 0) missing.push('Work experience')

  // 4. Education (15 pts)
  const validEdu = data.education.filter(e => e.degree.trim() && e.school.trim())
  let eduScore = validEdu.length > 0 ? 15 : 0
  categories.push({
    name: 'Education',
    score: eduScore,
    max: 15,
    feedback: eduScore === 15 ? 'Education included' : 'Add education details',
  })
  if (eduScore === 15) strengths.push('Education section present')
  else missing.push('Education')

  // 5. Skills (20 pts)
  const skillList = data.skills.split(/[,;\n]/).map(s => s.trim()).filter(Boolean)
  let skillScore = 0
  if (skillList.length >= 5) skillScore += 10
  if (skillList.length >= 8) skillScore += 5
  if (skillList.length >= 3) skillScore += 5
  categories.push({
    name: 'Skills',
    score: skillScore,
    max: 20,
    feedback: skillScore >= 15 ? 'Good skill coverage' : 'Add more relevant skills',
  })
  if (skillScore >= 15) strengths.push('Relevant skills listed')
  else if (skillList.length === 0) missing.push('Skills')
  else improvements.push('List more specific technical and soft skills')

  const overall = Math.round(
    categories.reduce((sum, c) => sum + c.score, 0)
  )

  // General improvements
  if (!data.headline.trim()) improvements.push('Add a professional headline')
  if (validExp.length > 0 && !hasBullets) improvements.push('Use bullet points for experience achievements')

  return { overall, categories, strengths, improvements, missing }
}
