# LUMA — Implementation Plan

## Stack

| Layer | Service |
|-------|---------|
| Frontend | Next.js on Vercel |
| Auth | Firebase Auth (Google, GitHub, Magic Link) |
| Database | Supabase Cloud (Postgres) |
| Video Storage | AWS S3 + CloudFront CDN |
| AI Pipeline | AWS Transcribe + Bedrock (Claude Haiku) |
| Payments | Dodo Payments |
| Lifetime Deals | AppSumo |

---

## PHASE 1 — Interactive Video Player (Core Product)

**Goal:** The "wow" moment — video pauses, blurs, shows question, resumes.

**Build:**
- Custom HTML5 video player component with controls (play/pause, progress bar, volume, fullscreen)
- Question markers on the progress bar (visual dots at timestamps)
- `timeupdate` listener that triggers pause at defined timestamps
- Blur overlay with animated question modal (MCQ, Yes/No, One Word, Multi-Select)
- Answer selection → record response → dismiss overlay → resume playback
- Skip protection logic (optional: prevent seeking past unanswered questions)
- Mobile responsive + fullscreen support
- Campaign config format: JSON with `{ timestamp, question, type, options, required }`

**Test with:** A hardcoded video URL + hardcoded question array. No backend needed yet.

**Deliverable:** A working `/play/[campaignId]` page that anyone can open and experience the interactive video.

---

## PHASE 2 — Infrastructure & Auth

**Goal:** Users can sign up, log in, and have persistent accounts.

**Build:**
- Firebase Auth integration in Next.js
  - Google OAuth
  - GitHub OAuth
  - Magic link (email passwordless)
- Firebase Auth SDK setup (client + admin)
- Auth middleware for protected routes (`/dashboard/*`)
- Supabase Cloud project setup (Postgres database)
- User profile table in Supabase Postgres (linked by Firebase UID)
- Session management via Firebase tokens
- Wire existing login/signup pages to real Firebase auth (no UI changes)

**Deliverable:** Users can sign up, log in, access dashboard, log out. Protected routes work.

---

## PHASE 3 — Database Schema & Campaign CRUD

**Goal:** Users can create, read, update, delete campaigns — stored in Supabase Postgres.

**Database tables (Supabase):**

```sql
users (id, firebase_uid, email, name, company, plan, created_at)
campaigns (id, user_id, name, description, status, use_case, language, settings, video_url, thumbnail_url, created_at)
campaign_questions (id, campaign_id, timestamp_sec, text, type, options, required, order)
viewer_sessions (id, campaign_id, viewer_id, started_at, completed_at, watch_time, region, device)
viewer_responses (id, session_id, question_id, answer, correct, answered_at)
```

**Build:**
- API routes (or Supabase client direct) for campaign CRUD
- Wire campaigns page to real data (create, list, edit, delete)
- Wire the "New Campaign" wizard to actually save to DB
- Campaign settings stored as JSONB in Supabase Postgres
- Row-level security via Firebase UID matching: users only see their own campaigns

**Deliverable:** Full campaign management works with real persistence.

---

## PHASE 4 — Video Upload & Storage

**Goal:** Users upload videos, get stored on S3, served via CloudFront.

**Build:**
- S3 bucket for video uploads (private, presigned URLs for upload)
- CloudFront distribution in front of S3 (public read for video playback)
- Upload flow in frontend: presigned URL → direct browser upload to S3
- Upload progress tracking
- Video metadata extraction (duration, resolution) via client-side or Lambda
- Thumbnail generation (Lambda + FFmpeg layer, or client-side canvas capture)
- Store video URL + metadata in `campaigns` table

**Deliverable:** Users upload videos through the UI, videos play from CDN.

---

## PHASE 5 — AI Pipeline

**Goal:** Upload triggers AI processing — transcript, questions, timestamps auto-generated.

**Build:**
- S3 upload event → Lambda trigger
- Lambda Step 1: Send audio to AWS Transcribe → get transcript with word-level timestamps
- Lambda Step 2: Send transcript to Bedrock (Claude Haiku) with prompt:
  - "Generate N contextual MCQs from this transcript"
  - "Place them at optimal timestamps"
  - "Return JSON format: [{timestamp, question, type, options, correct_answer}]"
- Lambda Step 3: Store generated questions in `campaign_questions` table
- Update campaign status: processing → ready
- Frontend polls or uses webhook/realtime to show processing progress
- Translation step (optional): AWS Translate for multilingual

**Deliverable:** User uploads video → AI generates questions automatically → campaign is ready to publish.

---

## PHASE 6 — Analytics & Viewer Tracking

**Goal:** Track every viewer interaction, surface insights on dashboards.

**Build:**
- Viewer session tracking: create session on play, track watch time, completion
- Response recording: store each answer with timestamp
- Analytics queries (Postgres views or functions):
  - Completion rate, avg watch time, engagement score
  - Region-wise (from IP geolocation — lightweight, no tracking)
  - Hourly distribution
  - Question performance (correct/incorrect rates)
  - Drop-off analysis (which timestamp viewers leave)
  - Most replayed moments (track seek events)
- Wire all dashboard charts to real data
- AI Insights button: send analytics summary to Bedrock, get natural language insights

**Deliverable:** All dashboard analytics are real and live.

---

## PHASE 7 — Sharing, Embedding & Public Player

**Goal:** Campaigns can be shared publicly and embedded anywhere.

**Build:**
- Public campaign URL: `/play/[slug]` (no auth required for viewers)
- Embed code generation: `<iframe src="https://luma.online/embed/[slug]" />`
- Embed page (minimal, no header/footer, just the player)
- Optional: password-protected campaigns
- Optional: viewer identity collection (email before watching)
- Custom branding on player (logo, accent color from campaign settings)
- Open Graph meta tags for share link previews

**Deliverable:** Shareable links and embed codes work. Anyone can watch and respond.

---

## PHASE 8 — Payments & Plans

**Goal:** Subscription billing with plan limits enforced.

**Build:**
- Dodo Payments integration (subscription creation, webhook handling)
- Plan limits enforcement in middleware:
  - Campaign count check before creation
  - Session count check before viewer plays
  - AI processing minutes tracking
- Upgrade/downgrade flows
- Billing history in profile
- Webhook handler: payment success → update user plan in Postgres
- Grace period logic for failed payments

**Deliverable:** Users pay for plans, limits are enforced, billing works.

---

## PHASE 9 — AppSumo Launch

**Goal:** Lifetime deal campaign with license redemption.

**Build:**
- AppSumo license code redemption page (`/redeem`)
- License code validation against AppSumo's API
- Map license tiers to plan levels (1 code = Starter, 2 codes = Pro, etc.)
- LTD-specific limits (generous but not unlimited)
- AppSumo-specific onboarding flow
- Landing page tweaks for AppSumo traffic

**Deliverable:** AppSumo listing goes live, codes work, users onboard smoothly.

---

## PHASE 10 — Polish & Enterprise

**Goal:** Production hardening + enterprise features for big contracts.

**Build:**
- Error handling, loading states, edge cases across all flows
- Email notifications (campaign completed, weekly digest)
- Team collaboration (invite members, role-based access)
- White-label (custom domains, remove Luma branding)
- SSO (SAML/OIDC for enterprise clients)
- API key generation + public API for integrations
- SCORM/xAPI export for LMS integration
- Performance optimization (lazy loading, caching)
- Monitoring + alerting (CloudWatch, Sentry)

---

## Timeline Estimate

| Phase | Effort | Can parallelize? |
|-------|--------|-----------------|
| 1 — Interactive Player | 3-5 days | No (foundational) |
| 2 — Auth + Infra | 2-3 days | No (needed for everything) |
| 3 — Campaign CRUD | 3-4 days | No |
| 4 — Video Upload | 2-3 days | Yes (with Phase 3) |
| 5 — AI Pipeline | 4-5 days | Yes (after Phase 4) |
| 6 — Analytics | 4-5 days | Yes (after Phase 3) |
| 7 — Sharing/Embed | 2-3 days | Yes |
| 8 — Payments | 3-4 days | Yes |
| 9 — AppSumo | 2-3 days | After Phase 8 |
| 10 — Enterprise | Ongoing | After launch |

**Realistic MVP (Phases 1-7):** 3-4 weeks of focused building  
**Full product with payments (Phases 1-9):** 5-6 weeks  
**AppSumo-ready:** ~6 weeks from now

---

## Architecture Diagram

```
User uploads video
  → AWS S3 (storage)
  → Lambda trigger → AWS Transcribe (transcript)
  → Lambda → Bedrock Haiku (generate MCQs + timestamps)
  → Store config in Supabase Postgres (campaign doc with questions array)

Viewer watches campaign
  → CloudFront serves video
  → Frontend loads question config from Supabase
  → Player pauses at timestamps, blurs video, shows overlay
  → Responses written to Supabase

Dashboard reads
  → Supabase Postgres queries for campaign data
  → Analytics aggregations via SQL views/functions
  → AI Insights via Bedrock summarization

Auth flow
  → Firebase Auth handles sign-in (Google/GitHub/Magic Link)
  → Firebase token passed to API routes
  → API routes verify token, use Firebase UID to query Supabase
```

---

## Key Technical Decisions

1. **No video re-encoding** — interactivity is a frontend overlay layer, not baked into the video file
2. **JSON config per campaign** — questions/timestamps stored as structured data, player reads it
3. **Presigned uploads** — browser uploads directly to S3, no server bandwidth cost
4. **Postgres for analytics** — SQL aggregations are 100x simpler than NoSQL for this use case
5. **Supabase Cloud for database** — free tier handles 2,500+ users, Pro ($25/mo) for scale
6. **Firebase for auth** — battle-tested, truly free at scale, handles OAuth natively
7. **Bedrock over OpenAI** — stays within AWS ecosystem, cheaper, no API key management
7. **CloudFront CDN** — global video delivery, low latency, integrates with S3 natively
