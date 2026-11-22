import { supabase } from './supabase'

async function callAI(resumeText: string, jobDescription: string | undefined, mode: 'improve' | 'match'): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) {
    throw new Error('Please sign in to use AI features')
  }

  const res = await fetch('/api/ai-improve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ resumeText, jobDescription, mode }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'AI request failed')
  }
  return data.result
}

export async function improveWithAI(resumeText: string, jobDescription?: string): Promise<string> {
  return callAI(resumeText, jobDescription, 'improve')
}

export async function matchJobDescription(resumeText: string, jobDescription: string): Promise<string> {
  return callAI(resumeText, jobDescription, 'match')
}
