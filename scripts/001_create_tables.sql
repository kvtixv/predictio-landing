-- Tipster AI Database Schema
-- Create profiles table that references auth.users

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create predictions table
CREATE TABLE IF NOT EXISTS public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id TEXT NOT NULL,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  league TEXT NOT NULL,
  match_date DATE NOT NULL,
  market TEXT NOT NULL,
  prediction TEXT NOT NULL,
  confidence INTEGER CHECK (confidence >= 1 AND confidence <= 10),
  implied_probability TEXT,
  value_rating TEXT,
  risk TEXT CHECK (risk IN ('niskie', 'srednie', 'wysokie')),
  analysis TEXT,
  key_factors JSONB DEFAULT '[]'::JSONB,
  social_caption TEXT,
  result TEXT CHECK (result IN ('win', 'loss', 'void', NULL)),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create saved_matches table
CREATE TABLE IF NOT EXISTS public.saved_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id TEXT NOT NULL,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  league TEXT NOT NULL,
  match_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, match_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_matches ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles 
  FOR DELETE USING (auth.uid() = id);

-- Predictions policies
CREATE POLICY "predictions_select_own" ON public.predictions 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "predictions_insert_own" ON public.predictions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "predictions_update_own" ON public.predictions 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "predictions_delete_own" ON public.predictions 
  FOR DELETE USING (auth.uid() = user_id);

-- Saved matches policies
CREATE POLICY "saved_matches_select_own" ON public.saved_matches 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_matches_insert_own" ON public.saved_matches 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_matches_delete_own" ON public.saved_matches 
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS predictions_user_id_idx ON public.predictions(user_id);
CREATE INDEX IF NOT EXISTS predictions_created_at_idx ON public.predictions(created_at DESC);
CREATE INDEX IF NOT EXISTS saved_matches_user_id_idx ON public.saved_matches(user_id);
