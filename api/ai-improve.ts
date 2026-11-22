import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MAX_RESUME_LENGTH = 15000
const MAX_JOB_LENGTH = 8000
const MAX_OUTPUT_TOKENS = 2000

const rateLimitMap = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60 * 1000

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(userId)
  if (!entry || now > entry.reset) {
    rateLimitMap.set(userId, { count: 1, reset: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

function safeError(res: VercelResponse, status: number, message: string) {
  return res.status(status).json({ error: message })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return safeError(res, 405, 'Method not allowed')
  }

  const groqKey = process.env.GROQ_API_KEY
  if (!groqKey) {
    return safeError(res, 500, 'AI service is not configured')
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    return safeError(res, 500, 'Authentication service is not configured')
  }

  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return safeError(res, 401, 'Authentication required')
  }

  const token = authHeader.slice(7)
  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return safeError(res, 401, 'Invalid or expired session')
  }

  if (!checkRateLimit(user.id)) {
    return safeError(res, 429, 'Too many requests. Please try again later.')
  }

  const { resumeText, jobDescription, mode } = req.body || {}

  if (typeof resumeText !== 'string' || !resumeText.trim()) {
    return safeError(res, 400, 'resumeText is required')
  }
  if (resumeText.length > MAX_RESUME_LENGTH) {
    return safeError(res, 400, `Resume text exceeds ${MAX_RESUME_LENGTH} characters`)
  }
  if (jobDescription && (typeof jobDescription !== 'string' || jobDescription.length > MAX_JOB_LENGTH)) {
    return safeError(res, 400, `Job description exceeds ${MAX_JOB_LENGTH} characters`)
  }

  const action = mode === 'match' ? 'match' : 'improve'

  try {
    let system: string
    let userPrompt: string
    let maxTokens: number

    if (action === 'match') {
      if (!jobDescription?.trim()) {
        return safeError(res, 400, 'jobDescription is required for match mode')
      }
      system = 'Extract required skills and qualifications from the job description. Then list which ones are missing from the resume. Be factual. Return a short bullet list of missing relevant items only.'
      userPrompt = `JOB:\n${jobDescription}\n\nRESUME:\n${resumeText}`
      maxTokens = 500
    } else {
      system = `You are a professional resume writer. Improve the resume for clarity, grammar, stronger action verbs, and ATS-friendly language.
CRITICAL RULES:
- NEVER invent companies, job titles, dates, skills, metrics, certifications, or achievements.
- ONLY rephrase and strengthen what is already provided.
- Keep all facts exactly the same.
- Return ONLY the improved resume text in clean plain text format.`
      userPrompt = jobDescription
        ? `Improve this resume to better match the job description while preserving all facts.\n\nJOB DESCRIPTION:\n${jobDescription}\n\nRESUME:\n${resumeText}`
        : `Improve this resume while preserving all facts:\n\n${resumeText}`
      maxTokens = MAX_OUTPUT_TOKENS
    }

    const groqRes = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userPrompt },
        ],
        temperature: action === 'match' ? 0.2 : 0.3,
        max_tokens: maxTokens,
      }),
    })

    if (!groqRes.ok) {
      return safeError(res, 502, 'AI service temporarily unavailable')
    }

    const data = await groqRes.json()
    const content = data.choices?.[0]?.message?.content?.trim()
    if (!content) {
      return safeError(res, 502, 'AI service returned an empty response')
    }

    return res.status(200).json({ result: content })
  } catch {
    return safeError(res, 500, 'An unexpected error occurred')
  }
}
