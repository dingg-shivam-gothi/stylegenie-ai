-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profile table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'non-binary', 'prefer-not-to-say')),
  avatar_url TEXT,
  location JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  subscription TEXT DEFAULT 'free' CHECK (subscription IN ('free', 'pro', 'elite')),
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analyses table
CREATE TABLE public.analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('full', 'hair', 'skin', 'nails')),
  ai_provider TEXT CHECK (ai_provider IN ('gemini', 'openai')),
  raw_result JSONB,
  style_score INTEGER CHECK (style_score >= 0 AND style_score <= 100),
  hair_analysis JSONB,
  skin_analysis JSONB,
  nail_analysis JSONB,
  grooming_analysis JSONB,
  preferences JSONB DEFAULT '{}',
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  processing_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recommendations table
CREATE TABLE public.recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('hair', 'skin', 'nails', 'grooming', 'spa')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('quick_win', 'major_impact', 'maintenance')),
  expected_outcome TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Analyses: users can read their own, service role can insert
CREATE POLICY "Users can view own analyses" ON public.analyses
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can insert analyses" ON public.analyses
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update analyses" ON public.analyses
  FOR UPDATE USING (true);

-- Recommendations: readable if user owns the analysis
CREATE POLICY "Users can view own recommendations" ON public.recommendations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.analyses
      WHERE analyses.id = recommendations.analysis_id
      AND analyses.user_id = auth.uid()
    )
  );
CREATE POLICY "Service role can insert recommendations" ON public.recommendations
  FOR INSERT WITH CHECK (true);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Indexes
CREATE INDEX idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX idx_analyses_status ON public.analyses(status);
CREATE INDEX idx_recommendations_analysis_id ON public.recommendations(analysis_id);
