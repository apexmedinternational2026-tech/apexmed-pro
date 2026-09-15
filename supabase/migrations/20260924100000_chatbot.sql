-- Website chatbot (client's Task 5 build prompt) — deliberately NOT backed
-- by an external LLM API (the client chose "offline": no API key, no
-- third-party dependency, no per-message cost). Instead this is a curated
-- Q&A knowledge base the admin panel edits directly, matched against a
-- visitor's typed message by simple keyword scoring in
-- lib/chatbot/match.ts — no tsvector/FTS index needed for a table this
-- size, and keyword scoring is trivially auditable/debuggable in a way a
-- black-box relevance function wouldn't be.

create table chatbot_faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  -- Extra search terms beyond what's already in question/answer (synonyms,
  -- abbreviations e.g. "FSP", "Approbation") — free text, space-separated,
  -- folded into the same keyword scoring as everything else.
  keywords text,
  category text,
  -- Shown as a tappable suggestion chip before the visitor types anything.
  is_starter boolean not null default false,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index chatbot_faqs_published_idx on chatbot_faqs (is_published);

alter table chatbot_faqs enable row level security;

-- Read-only, published-only for anon — same shape as services/programs'
-- own anon_select_published policies. The chat widget's Route Handler
-- reads through the public (anon) client, not the admin client, since
-- there's nothing sensitive in a published FAQ answer.
create policy "anon_select_published_chatbot_faqs" on chatbot_faqs
  for select
  to anon
  using (is_published = true);

revoke all on table chatbot_faqs from anon, authenticated;
grant select on table chatbot_faqs to anon;

-- Logs every visitor message the matcher couldn't answer with confidence —
-- the primary signal for growing the knowledge base, since there's no LLM
-- fallback to paper over a gap. Same PII posture as leads/applications:
-- anon insert-only, no anon read.
create table chatbot_unanswered_questions (
  id uuid primary key default gen_random_uuid(),
  question_text text not null,
  -- Client-generated per-tab id (crypto.randomUUID(), kept in
  -- sessionStorage by chat-widget.tsx) — lets the admin see "these 3
  -- unanswered questions were one visitor's conversation" without
  -- collecting any personally identifying info.
  session_id text,
  best_score real,
  reviewed boolean not null default false,
  admin_notes text,
  created_at timestamptz not null default now()
);

create index chatbot_unanswered_created_at_idx on chatbot_unanswered_questions (created_at);
create index chatbot_unanswered_reviewed_idx on chatbot_unanswered_questions (reviewed);

alter table chatbot_unanswered_questions enable row level security;

create policy "anon_insert_chatbot_unanswered" on chatbot_unanswered_questions
  for insert
  to anon
  with check (true);

revoke all on table chatbot_unanswered_questions from anon, authenticated;
grant insert on table chatbot_unanswered_questions to anon;
