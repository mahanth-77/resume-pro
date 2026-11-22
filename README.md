# Resume Pro

Premium ATS Resume Builder — Phases 0–3 complete.

## Quick Start

```bash
git clone https://github.com/mahanth-77/resume-pro.git
cd resume-pro
npm install
cp .env.example .env
# Edit .env with your keys (see below)
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

### 2. Groq (Free AI Improvement) — optional but recommended
1. Create free account at https://console.groq.com
2. Create an API key
3. Add to `.env`:
   - `VITE_GROQ_API_KEY`

## Features by Phase

- **Phase 1**: Landing, real Supabase auth, full multi-step builder (all sections), 3 templates, live preview, PDF download, dashboard with resume list
- **Phase 2**: Upload PDF/DOCX, deterministic ATS scoring with category breakdowns and suggestions (`/upload`)
- **Phase 3**: AI improvement (fact-preserving), original vs improved scores, job description matching (`/improve`)

## Routes
- `/` — Homepage
- `/login` — Sign up / Sign in
- `/dashboard` — Resume list (protected)
- `/builder` — Full builder (protected)
- `/upload` — ATS checker
- `/improve` — AI improvement

## Deploy
Push to GitHub → import on Vercel (free). Add the same environment variables in Vercel project settings.
