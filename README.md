# Resume Pro

Premium ATS Resume Builder — Phases 0–3 complete.

## Quick Start

```bash
git clone https://github.com/mahanth-77/resume-pro.git
cd resume-pro
npm install
cp .env.example .env
# Edit .env with your Supabase keys (see below)
npm run dev
```

Open http://localhost:5173

## Required Free Services

### 1. Supabase (Auth + Database)
1. Create a free project at https://supabase.com
2. Go to SQL Editor and run:

```sql
create table resumes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  content jsonb not null,
  ats_score integer,
  created_at timestamp with time zone default now()
);

alter table resumes enable row level security;

create policy "Users can manage their own resumes"
  on resumes for all
  using (auth.uid() = user_id);
```

3. Copy Project URL and anon key into `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### 2. Groq (AI Improvement) — server-side only
1. Create a free account at https://console.groq.com
2. Create an API key
3. **Never** put the Groq key in frontend code or `VITE_` variables.
4. For local API testing, set `GROQ_API_KEY` in your environment (or use Vercel CLI).
5. On Vercel: Project Settings → Environment Variables → add `GROQ_API_KEY` (Production + Preview).

The frontend calls `/api/ai-improve`. The serverless function reads `process.env.GROQ_API_KEY` and never exposes it.

## Features by Phase

- **Phase 1**: Landing, real Supabase auth, full multi-step builder, 3 templates, live preview, PDF download, dashboard
- **Phase 2**: Upload PDF/DOCX, deterministic ATS scoring (`/upload`)
- **Phase 3**: Secure AI improvement via server endpoint, original vs improved scores, job matching (`/improve`)

## Routes
- `/` — Homepage
- `/login` — Sign up / Sign in
- `/dashboard` — Resume list (protected)
- `/builder` — Full builder (protected)
- `/upload` — ATS checker
- `/improve` — AI improvement (requires sign-in)

## Deploy
1. Push to GitHub
2. Import on Vercel
3. Add environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `GROQ_API_KEY` (server-only)
4. Deploy

## Security notes
- Groq API key is never sent to the browser.
- AI endpoints require a valid Supabase session.
- Rate limiting and input length limits are enforced server-side.
