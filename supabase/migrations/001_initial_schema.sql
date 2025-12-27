-- Enable UUID extension in extensions schema (for Supabase hosted)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Create enums
CREATE TYPE "UserRole" AS ENUM ('BRAND', 'INFLUENCER', 'ADMIN');
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'COMPLETED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'ESCROW', 'RELEASED', 'REFUNDED', 'FAILED');
CREATE TYPE "CollaborationStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUBMITTED', 'APPROVED', 'DISPUTED', 'COMPLETED', 'CANCELLED');

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    role "UserRole" DEFAULT 'INFLUENCER',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create brand_profiles table
CREATE TABLE public.brand_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    website TEXT,
    description TEXT,
    logo_url TEXT,
    industry TEXT,
    company_size TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create influencer_profiles table
CREATE TABLE public.influencer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    niche TEXT[],
    platforms TEXT[],
    followers_count INTEGER DEFAULT 0,
    engagement_rate REAL,
    instagram_url TEXT,
    tiktok_url TEXT,
    youtube_url TEXT,
    twitter_url TEXT,
    other_url TEXT,
    base_rate INTEGER,
    media_kit_url TEXT,
    avg_views INTEGER,
    avg_likes INTEGER,
    location TEXT,
    languages TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolio_items table
CREATE TABLE public.portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL REFERENCES public.influencer_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL,
    platform TEXT,
    views INTEGER,
    likes INTEGER,
    links TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaigns table
CREATE TABLE public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    brief TEXT,
    requirements TEXT,
    budget_min INTEGER NOT NULL,
    budget_max INTEGER NOT NULL,
    platforms TEXT[],
    target_niches TEXT[],
    target_locations TEXT[],
    target_age_range TEXT,
    target_gender TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    application_deadline TIMESTAMP WITH TIME ZONE,
    deliverables JSONB,
    status "CampaignStatus" DEFAULT 'DRAFT',
    is_public BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    match_score REAL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    influencer_id UUID NOT NULL REFERENCES public.influencer_profiles(id) ON DELETE CASCADE,
    pitch TEXT NOT NULL,
    proposed_rate INTEGER,
    proposed_timeline TEXT,
    attachments JSONB,
    portfolio_links TEXT,
    status "ApplicationStatus" DEFAULT 'PENDING',
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, influencer_id)
);

-- Create collaborations table
CREATE TABLE public.collaborations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    brand_id UUID NOT NULL REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
    influencer_id UUID NOT NULL REFERENCES public.influencer_profiles(id) ON DELETE CASCADE,
    application_id UUID UNIQUE NOT NULL,
    agreed_rate INTEGER NOT NULL,
    timeline TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    contract_url TEXT,
    terms TEXT,
    status "CollaborationStatus" DEFAULT 'PENDING',
    payment_status "PaymentStatus" DEFAULT 'PENDING',
    escrow_id TEXT,
    deliverables JSONB,
    content_links TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by TEXT,
    feedback TEXT,
    metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachments JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    metadata JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES public.influencer_profiles(id) ON DELETE CASCADE,
    collaboration_id UUID UNIQUE NOT NULL REFERENCES public.collaborations(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT NOT NULL,
    communication INTEGER CHECK (communication >= 1 AND communication <= 5),
    quality INTEGER CHECK (quality >= 1 AND quality <= 5),
    professionalism INTEGER CHECK (professionalism >= 1 AND professionalism <= 5),
    timeliness INTEGER CHECK (timeliness >= 1 AND timeliness <= 5),
    is_public BOOLEAN DEFAULT true,
    response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_matches table
CREATE TABLE public.ai_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL,
    influencer_id UUID NOT NULL,
    relevance_score REAL NOT NULL,
    engagement_score REAL NOT NULL,
    niche_score REAL NOT NULL,
    overall_score REAL NOT NULL,
    reasons TEXT[],
    was_viewed BOOLEAN DEFAULT false,
    was_contacted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_brand_profiles_user_id ON public.brand_profiles(user_id);
CREATE INDEX idx_influencer_profiles_user_id ON public.influencer_profiles(user_id);
CREATE INDEX idx_influencer_profiles_niche ON public.influencer_profiles USING GIN(niche);
CREATE INDEX idx_influencer_profiles_platforms ON public.influencer_profiles USING GIN(platforms);
CREATE INDEX idx_portfolio_items_influencer_id ON public.portfolio_items(influencer_id);
CREATE INDEX idx_campaigns_brand_id ON public.campaigns(brand_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaigns_platforms ON public.campaigns USING GIN(platforms);
CREATE INDEX idx_campaigns_target_niches ON public.campaigns USING GIN(target_niches);
CREATE INDEX idx_applications_campaign_id ON public.applications(campaign_id);
CREATE INDEX idx_applications_influencer_id ON public.applications(influencer_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_collaborations_campaign_id ON public.collaborations(campaign_id);
CREATE INDEX idx_collaborations_influencer_id ON public.collaborations(influencer_id);
CREATE INDEX idx_collaborations_brand_id ON public.collaborations(brand_id);
CREATE INDEX idx_collaborations_status ON public.collaborations(status);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_reviews_brand_id ON public.reviews(brand_id);
CREATE INDEX idx_reviews_influencer_id ON public.reviews(influencer_id);
CREATE INDEX idx_ai_matches_campaign_id ON public.ai_matches(campaign_id);
CREATE INDEX idx_ai_matches_influencer_id ON public.ai_matches(influencer_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_matches ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read and update their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Brand profiles
CREATE POLICY "Brand profiles are viewable by everyone" ON public.brand_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own brand profile" ON public.brand_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own brand profile" ON public.brand_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Influencer profiles
CREATE POLICY "Influencer profiles are viewable by everyone" ON public.influencer_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own influencer profile" ON public.influencer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own influencer profile" ON public.influencer_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Portfolio items
CREATE POLICY "Portfolio items are viewable by everyone" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "Influencers can manage own portfolio" ON public.portfolio_items FOR ALL USING (
    EXISTS (SELECT 1 FROM public.influencer_profiles WHERE id = influencer_id AND user_id = auth.uid())
);

-- Campaigns
CREATE POLICY "Campaigns are viewable by everyone" ON public.campaigns FOR SELECT USING (is_public = true);
CREATE POLICY "Brands can manage own campaigns" ON public.campaigns FOR ALL USING (
    EXISTS (SELECT 1 FROM public.brand_profiles WHERE id = brand_id AND user_id = auth.uid())
);

-- Applications
CREATE POLICY "Applications viewable by campaign owner and applicant" ON public.applications FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.influencer_profiles WHERE id = influencer_id AND user_id = auth.uid())
    OR EXISTS (
        SELECT 1 FROM public.campaigns c 
        JOIN public.brand_profiles bp ON c.brand_id = bp.id 
        WHERE c.id = campaign_id AND bp.user_id = auth.uid()
    )
);
CREATE POLICY "Influencers can create applications" ON public.applications FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.influencer_profiles WHERE id = influencer_id AND user_id = auth.uid())
);
CREATE POLICY "Influencers can update own applications" ON public.applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.influencer_profiles WHERE id = influencer_id AND user_id = auth.uid())
);

-- Messages
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, first_name, last_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_brand_profiles_updated_at BEFORE UPDATE ON public.brand_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_influencer_profiles_updated_at BEFORE UPDATE ON public.influencer_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_collaborations_updated_at BEFORE UPDATE ON public.collaborations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();