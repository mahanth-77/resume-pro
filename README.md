# Resume Pro

Premium ATS Resume Builder.

## Local setup

```bash
npm install
cp .env.example .env
# Add your Supabase URL and anon key to .env
npm run dev
```

## Supabase setup (free tier)

1. Create a project at supabase.com
2. Run this SQL in the SQL Editor:

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

3. Copy Project URL and anon key into `.env`

## Current features
- Premium homepage
- Multi-step builder with live preview
- Deterministic ATS scoring
- Fact-preserving improvement engine
- PDF export (print)
- File upload + PDF/DOCX parsing
- Supabase auth + save/load scaffolding

All free-tier ready.
