-- ============================================================
-- TradeDex – Initial Database Schema
-- ============================================================
-- Run this in the Supabase SQL editor or via the Supabase CLI.
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TYPES / ENUMS
-- ============================================================

CREATE TYPE card_status AS ENUM ('FOR_TRADE', 'WANTED', 'COLLECTION');
CREATE TYPE card_condition AS ENUM ('MINT', 'NEAR_MINT', 'EXCELLENT', 'GOOD', 'LIGHT_PLAYED', 'PLAYED', 'POOR');
CREATE TYPE card_language AS ENUM ('EN', 'JP', 'DE', 'FR', 'ES', 'IT', 'PT', 'KO', 'ZH_HANS', 'ZH_HANT');
CREATE TYPE review_type AS ENUM ('POSITIVE', 'NEGATIVE', 'NEUTRAL');
CREATE TYPE report_reason AS ENUM ('SCAM', 'FAKE_CARDS', 'HARASSMENT', 'SPAM', 'MISLEADING_LISTING', 'OTHER');
CREATE TYPE report_status AS ENUM ('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED');

-- ============================================================
-- PROFILES
-- ============================================================

CREATE TABLE profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username     TEXT NOT NULL UNIQUE,
  avatar_url   TEXT,
  bio          TEXT,
  location     TEXT,
  rating       INTEGER NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 100),
  rating_count INTEGER NOT NULL DEFAULT 0 CHECK (rating_count >= 0),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_username ON profiles (username);

-- ============================================================
-- USER CARDS (Collection)
-- ============================================================

CREATE TABLE user_cards (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  -- Pokémon TCG API fields (denormalized for performance)
  card_id          TEXT NOT NULL,   -- e.g. "base1-4"
  card_name        TEXT NOT NULL,
  card_image_small TEXT NOT NULL,
  card_image_large TEXT NOT NULL,
  card_set_name    TEXT NOT NULL,
  card_number      TEXT NOT NULL,
  -- Collection metadata
  status           card_status NOT NULL DEFAULT 'COLLECTION',
  condition        card_condition,
  language         card_language NOT NULL DEFAULT 'EN',
  quantity         INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1 AND quantity <= 99),
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_cards_user_id ON user_cards (user_id);
CREATE INDEX idx_user_cards_card_id ON user_cards (card_id);
CREATE INDEX idx_user_cards_status ON user_cards (status);
CREATE INDEX idx_user_cards_user_status ON user_cards (user_id, status);
-- Composite index for matching queries
CREATE INDEX idx_user_cards_card_status ON user_cards (card_id, status);

-- ============================================================
-- CONVERSATIONS
-- ============================================================

CREATE TABLE conversations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_1   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Ensure no duplicate conversations between the same pair
  UNIQUE (participant_1, participant_2),
  CHECK (participant_1 <> participant_2)
);

CREATE INDEX idx_conversations_participant_1 ON conversations (participant_1);
CREATE INDEX idx_conversations_participant_2 ON conversations (participant_2);
CREATE INDEX idx_conversations_last_message_at ON conversations (last_message_at DESC NULLS LAST);

-- ============================================================
-- MESSAGES
-- ============================================================

CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content         TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 2000),
  read_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON messages (conversation_id, created_at ASC);
CREATE INDEX idx_messages_sender_id ON messages (sender_id);

-- ============================================================
-- REVIEWS
-- ============================================================

CREATE TABLE reviews (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewed_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type         review_type NOT NULL,
  comment      TEXT CHECK (char_length(comment) <= 500),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- One review per reviewer per reviewed user
  UNIQUE (reviewer_id, reviewed_id),
  CHECK (reviewer_id <> reviewed_id)
);

CREATE INDEX idx_reviews_reviewed_id ON reviews (reviewed_id, created_at DESC);
CREATE INDEX idx_reviews_reviewer_id ON reviews (reviewer_id);

-- ============================================================
-- REPORTS
-- ============================================================

CREATE TABLE reports (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason           report_reason NOT NULL,
  description      TEXT CHECK (char_length(description) <= 1000),
  status           report_status NOT NULL DEFAULT 'PENDING',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (reporter_id <> reported_user_id)
);

CREATE INDEX idx_reports_reported_user_id ON reports (reported_user_id);
CREATE INDEX idx_reports_status ON reports (status);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_user_cards_updated_at
  BEFORE UPDATE ON user_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on auth.users insert
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Recalculate rating after review insert/delete
CREATE OR REPLACE FUNCTION recalculate_rating()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_user_id UUID;
  v_positive INTEGER;
  v_total    INTEGER;
BEGIN
  v_user_id := COALESCE(NEW.reviewed_id, OLD.reviewed_id);

  SELECT
    COUNT(*) FILTER (WHERE type = 'POSITIVE'),
    COUNT(*)
  INTO v_positive, v_total
  FROM reviews
  WHERE reviewed_id = v_user_id;

  UPDATE profiles
  SET
    rating       = CASE WHEN v_total > 0 THEN ROUND((v_positive::NUMERIC / v_total) * 100) ELSE 0 END,
    rating_count = v_total
  WHERE id = v_user_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_recalculate_rating_insert
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION recalculate_rating();

CREATE TRIGGER trg_recalculate_rating_delete
  AFTER DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION recalculate_rating();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Profiles are publicly readable"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- USER CARDS
CREATE POLICY "User cards are publicly readable"
  ON user_cards FOR SELECT USING (true);

CREATE POLICY "Users can insert their own cards"
  ON user_cards FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards"
  ON user_cards FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards"
  ON user_cards FOR DELETE USING (auth.uid() = user_id);

-- CONVERSATIONS
CREATE POLICY "Conversation participants can view conversations"
  ON conversations FOR SELECT USING (
    auth.uid() = participant_1 OR auth.uid() = participant_2
  );

CREATE POLICY "Authenticated users can create conversations"
  ON conversations FOR INSERT WITH CHECK (
    auth.uid() = participant_1 OR auth.uid() = participant_2
  );

CREATE POLICY "Participants can update conversations"
  ON conversations FOR UPDATE USING (
    auth.uid() = participant_1 OR auth.uid() = participant_2
  );

-- MESSAGES
CREATE POLICY "Message participants can view messages"
  ON messages FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = messages.conversation_id
        AND (participant_1 = auth.uid() OR participant_2 = auth.uid())
    )
  );

CREATE POLICY "Participants can insert messages"
  ON messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = conversation_id
        AND (participant_1 = auth.uid() OR participant_2 = auth.uid())
    )
  );

CREATE POLICY "Senders can update their messages"
  ON messages FOR UPDATE USING (auth.uid() = sender_id);

-- REVIEWS
CREATE POLICY "Reviews are publicly readable"
  ON reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated users can leave reviews"
  ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Reviewers can delete their own reviews"
  ON reviews FOR DELETE USING (auth.uid() = reviewer_id);

-- REPORTS
CREATE POLICY "Users can submit reports"
  ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Reporters can view their own reports"
  ON reports FOR SELECT USING (auth.uid() = reporter_id);

-- ============================================================
-- REALTIME
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
