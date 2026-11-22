import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function saveResume(userId: string, data: any, score: number) {
  const { data: result, error } = await supabase
    .from('resumes')
    .insert({ user_id: userId, content: data, ats_score: score })
    .select()
    .single()
  if (error) throw error
  return result
}

export async function loadResumes(userId: string) {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
