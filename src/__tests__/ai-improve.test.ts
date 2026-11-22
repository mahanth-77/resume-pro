import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('AI Improve API contract', () => {
  beforeEach(() => {
    vi.resetModules()
    process.env.GROQ_API_KEY = 'test-key'
    process.env.VITE_SUPABASE_URL = 'https://test.supabase.co'
    process.env.VITE_SUPABASE_ANON_KEY = 'test-anon'
  })

  it('rejects non-POST methods', async () => {
    const handler = (await import('../../api/ai-improve')).default
    const req = { method: 'GET', headers: {}, body: {} } as any
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' })
  })

  it('returns 500 when GROQ_API_KEY is missing', async () => {
    delete process.env.GROQ_API_KEY
    const handler = (await import('../../api/ai-improve')).default
    const req = { method: 'POST', headers: {}, body: {} } as any
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'AI service is not configured' })
  })

  it('returns 401 when no auth header', async () => {
    const handler = (await import('../../api/ai-improve')).default
    const req = { method: 'POST', headers: {}, body: { resumeText: 'test' } } as any
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('returns 400 for missing resumeText', async () => {
    vi.mock('@supabase/supabase-js', () => ({
      createClient: () => ({
        auth: {
          getUser: async () => ({ data: { user: { id: 'user-1' } }, error: null }),
        },
      }),
    }))
    const handler = (await import('../../api/ai-improve')).default
    const req = {
      method: 'POST',
      headers: { authorization: 'Bearer valid-token' },
      body: {},
    } as any
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })
})
