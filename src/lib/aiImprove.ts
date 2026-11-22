const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export async function improveWithAI(resumeText: string, jobDescription?: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) {
    throw new Error('Add VITE_GROQ_API_KEY to .env (free at console.groq.com)')
  }

  const system = `You are a professional resume writer. Improve the resume for clarity, grammar, stronger action verbs, and ATS-friendly language.
CRITICAL RULES:
- NEVER invent companies, job titles, dates, skills, metrics, certifications, or achievements.
- ONLY rephrase and strengthen what is already provided.
- Keep all facts exactly the same.
- Return ONLY the improved resume text in clean plain text format.`

  const user = jobDescription
    ? `Improve this resume to better match the job description while preserving all facts.\n\nJOB DESCRIPTION:\n${jobDescription}\n\nRESUME:\n${resumeText}`
    : `Improve this resume while preserving all facts:\n\n${resumeText}`

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`AI request failed: ${err}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || resumeText
}

export async function matchJobDescription(resumeText: string, jobDescription: string) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) throw new Error('Groq API key required')

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'Extract required skills and qualifications from the job description. Then list which ones are missing from the resume. Be factual. Return a short bullet list of missing relevant items only.',
        },
        {
          role: 'user',
          content: `JOB:\n${jobDescription}\n\nRESUME:\n${resumeText}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 500,
    }),
  })

  if (!res.ok) throw new Error('Job matching failed')
  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || 'No gaps identified.'
}
