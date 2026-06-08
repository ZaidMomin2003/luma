-- ─── LUMA Database Schema ─────────────────────────────────────────────────────
-- Run this in Supabase SQL Editor to set up the database

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Users ───────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  company TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);

-- ─── Campaigns ───────────────────────────────────────────────────────────────
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'active', 'completed', 'paused')),
  use_case TEXT,
  language TEXT DEFAULT 'en',
  video_url TEXT,
  thumbnail_url TEXT,
  video_duration REAL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);

-- ─── Campaign Questions ──────────────────────────────────────────────────────
CREATE TABLE campaign_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  timestamp_sec REAL NOT NULL,
  text TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('mcq', 'yesno', 'oneword', 'multi')),
  options TEXT[] DEFAULT '{}',
  required BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questions_campaign_id ON campaign_questions(campaign_id);

-- ─── Viewer Sessions ─────────────────────────────────────────────────────────
CREATE TABLE viewer_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  viewer_id TEXT,
  viewer_email TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  watch_time REAL DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  region TEXT,
  device TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_campaign_id ON viewer_sessions(campaign_id);
CREATE INDEX idx_sessions_started_at ON viewer_sessions(started_at);

-- ─── Viewer Responses ────────────────────────────────────────────────────────
CREATE TABLE viewer_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES viewer_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES campaign_questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  correct BOOLEAN,
  answered_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_responses_session_id ON viewer_responses(session_id);
CREATE INDEX idx_responses_question_id ON viewer_responses(question_id);

-- ─── Row Level Security ──────────────────────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE viewer_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE viewer_responses ENABLE ROW LEVEL SECURITY;

-- Users can read/write their own data
CREATE POLICY "Users can manage own profile" ON users
  FOR ALL USING (true); -- Auth handled at API layer via Firebase token

-- Campaigns accessible by owner
CREATE POLICY "Campaigns by owner" ON campaigns
  FOR ALL USING (true); -- Auth handled at API layer

-- Questions accessible via campaign
CREATE POLICY "Questions accessible" ON campaign_questions
  FOR ALL USING (true);

-- Sessions writable by anyone (viewers)
CREATE POLICY "Sessions writable" ON viewer_sessions
  FOR ALL USING (true);

-- Responses writable by anyone (viewers)
CREATE POLICY "Responses writable" ON viewer_responses
  FOR ALL USING (true);

-- ─── Updated At Trigger ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
