-- =============================================
-- INFLUENCER CONNECT - DEMO DATA SEED
-- =============================================
-- This script populates the database with realistic demo data
-- for showcasing the platform to stakeholders.
--
-- DEMO ACCOUNTS:
-- Brand: brand@demo.com / Demo123!
-- Influencer: influencer@demo.com / Demo123!
-- =============================================

-- First, create demo users in auth.users (you'll need to create these via Supabase Auth UI or API)
-- The UUIDs below should match the users created in Supabase Auth

-- For demo purposes, we'll use placeholder UUIDs
-- IMPORTANT: Replace these UUIDs with actual user IDs after creating accounts via sign-up

DO $$
DECLARE
    brand_user_id UUID := '11111111-1111-1111-1111-111111111111';
    brand_user_id_2 UUID := '22222222-2222-2222-2222-222222222222';
    influencer_user_id UUID := '33333333-3333-3333-3333-333333333333';
    influencer_user_id_2 UUID := '44444444-4444-4444-4444-444444444444';
    influencer_user_id_3 UUID := '55555555-5555-5555-5555-555555555555';
    influencer_user_id_4 UUID := '66666666-6666-6666-6666-666666666666';
    influencer_user_id_5 UUID := '77777777-7777-7777-7777-777777777777';
    
    brand_profile_id UUID;
    brand_profile_id_2 UUID;
    influencer_profile_id UUID;
    influencer_profile_id_2 UUID;
    influencer_profile_id_3 UUID;
    influencer_profile_id_4 UUID;
    influencer_profile_id_5 UUID;
    
    campaign_id_1 UUID;
    campaign_id_2 UUID;
    campaign_id_3 UUID;
    campaign_id_4 UUID;
    campaign_id_5 UUID;
    
    application_id_1 UUID;
    application_id_2 UUID;
    application_id_3 UUID;
    
    collaboration_id_1 UUID;
    collaboration_id_2 UUID;
BEGIN

-- =============================================
-- USERS
-- =============================================

-- Insert demo users (these link to Supabase Auth users)
INSERT INTO public.users (id, email, first_name, last_name, avatar_url, role, is_active) VALUES
(brand_user_id, 'brand@demo.com', 'Sarah', 'Johnson', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'BRAND', true),
(brand_user_id_2, 'brand2@demo.com', 'Michael', 'Chen', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'BRAND', true),
(influencer_user_id, 'influencer@demo.com', 'Emma', 'Williams', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 'INFLUENCER', true),
(influencer_user_id_2, 'alex@demo.com', 'Alex', 'Rivera', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'INFLUENCER', true),
(influencer_user_id_3, 'jessica@demo.com', 'Jessica', 'Park', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'INFLUENCER', true),
(influencer_user_id_4, 'marcus@demo.com', 'Marcus', 'Thompson', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', 'INFLUENCER', true),
(influencer_user_id_5, 'sophia@demo.com', 'Sophia', 'Martinez', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 'INFLUENCER', true)
ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    avatar_url = EXCLUDED.avatar_url,
    role = EXCLUDED.role;

-- =============================================
-- BRAND PROFILES
-- =============================================

INSERT INTO public.brand_profiles (id, user_id, company_name, website, description, logo_url, industry, company_size, location)
VALUES 
(gen_random_uuid(), brand_user_id, 'GlowUp Cosmetics', 'https://glowupcosmetics.com', 
 'Premium skincare and beauty brand focused on clean, sustainable ingredients. We believe in enhancing natural beauty through science-backed formulations.',
 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200', 'Beauty & Skincare', '50-200', 'Los Angeles, CA')
RETURNING id INTO brand_profile_id;

INSERT INTO public.brand_profiles (id, user_id, company_name, website, description, logo_url, industry, company_size, location)
VALUES
(gen_random_uuid(), brand_user_id_2, 'FitLife Athletics', 'https://fitlifeathletics.com',
 'Performance sportswear brand for athletes and fitness enthusiasts. Our mission is to help everyone achieve their fitness goals with premium quality gear.',
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200', 'Fitness & Sports', '200-500', 'Austin, TX')
RETURNING id INTO brand_profile_id_2;

-- =============================================
-- INFLUENCER PROFILES
-- =============================================

INSERT INTO public.influencer_profiles (id, user_id, display_name, bio, avatar_url, niche, platforms, followers_count, engagement_rate, instagram_url, tiktok_url, youtube_url, base_rate, avg_views, avg_likes, location, languages)
VALUES
(gen_random_uuid(), influencer_user_id, 'Emma Beauty', 
 'Beauty & skincare enthusiast 💄 Sharing honest reviews and tutorials. Helping you find your perfect routine! 500K+ community of beauty lovers.',
 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
 ARRAY['Beauty', 'Skincare', 'Fashion'], ARRAY['instagram', 'tiktok', 'youtube'],
 520000, 4.8, '@emmabeauty', '@emmabeauty', 'EmmaBeautyOfficial', 2500, 85000, 12000, 'New York, NY', ARRAY['English', 'Spanish'])
RETURNING id INTO influencer_profile_id;

INSERT INTO public.influencer_profiles (id, user_id, display_name, bio, avatar_url, niche, platforms, followers_count, engagement_rate, instagram_url, tiktok_url, base_rate, avg_views, avg_likes, location, languages)
VALUES
(gen_random_uuid(), influencer_user_id_2, 'Alex Fitness',
 'Certified personal trainer & nutrition coach 💪 Transforming lives one workout at a time. Join my fitness journey!',
 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
 ARRAY['Fitness', 'Health', 'Lifestyle'], ARRAY['instagram', 'youtube', 'tiktok'],
 380000, 5.2, '@alexfitness', '@alexfitpro', 2000, 95000, 18000, 'Miami, FL', ARRAY['English'])
RETURNING id INTO influencer_profile_id_2;

INSERT INTO public.influencer_profiles (id, user_id, display_name, bio, avatar_url, niche, platforms, followers_count, engagement_rate, instagram_url, tiktok_url, youtube_url, base_rate, avg_views, avg_likes, location, languages)
VALUES
(gen_random_uuid(), influencer_user_id_3, 'Jess Travels',
 'Travel blogger exploring hidden gems around the world ✈️ 50+ countries and counting! Tips, guides & wanderlust.',
 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
 ARRAY['Travel', 'Lifestyle', 'Photography'], ARRAY['instagram', 'youtube', 'tiktok'],
 890000, 3.9, '@jesstravels', '@jesstravels', 'JessTravelsWorld', 4500, 120000, 25000, 'San Francisco, CA', ARRAY['English', 'French'])
RETURNING id INTO influencer_profile_id_3;

INSERT INTO public.influencer_profiles (id, user_id, display_name, bio, avatar_url, niche, platforms, followers_count, engagement_rate, instagram_url, tiktok_url, base_rate, avg_views, avg_likes, location, languages)
VALUES
(gen_random_uuid(), influencer_user_id_4, 'Marcus Tech',
 'Tech reviewer & gadget enthusiast 📱 Honest reviews on the latest tech. Making technology accessible for everyone.',
 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
 ARRAY['Tech', 'Gaming', 'Digital'], ARRAY['youtube', 'twitter', 'tiktok'],
 1200000, 4.1, '@marcustech', '@marcustechreviews', 6000, 250000, 45000, 'Seattle, WA', ARRAY['English'])
RETURNING id INTO influencer_profile_id_4;

INSERT INTO public.influencer_profiles (id, user_id, display_name, bio, avatar_url, niche, platforms, followers_count, engagement_rate, instagram_url, tiktok_url, base_rate, avg_views, avg_likes, location, languages)
VALUES
(gen_random_uuid(), influencer_user_id_5, 'Sophia Cooks',
 'Home chef & recipe developer 🍳 Easy recipes for busy people. Making cooking fun and accessible!',
 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
 ARRAY['Food', 'Lifestyle', 'Home'], ARRAY['instagram', 'tiktok', 'youtube'],
 650000, 5.5, '@sophiacooks', '@sophiacooks', 'SophiaCooksOfficial', 3000, 110000, 22000, 'Chicago, IL', ARRAY['English', 'Italian'])
RETURNING id INTO influencer_profile_id_5;

-- =============================================
-- CAMPAIGNS
-- =============================================

-- Active campaign from GlowUp Cosmetics
INSERT INTO public.campaigns (id, brand_id, title, description, brief, requirements, budget_min, budget_max, platforms, target_niches, target_locations, target_age_range, start_date, end_date, application_deadline, status, is_public, is_featured)
VALUES
(gen_random_uuid(), brand_profile_id, 
 'Summer Glow Collection Launch',
 'We''re launching our new Summer Glow Collection and looking for beauty influencers to create authentic content showcasing our products. This collection features SPF-infused skincare and radiant makeup perfect for the summer season.',
 '## Campaign Brief

### About the Collection
Our Summer Glow Collection includes:
- Radiant SPF 50 Moisturizer
- Glow Drops Highlighting Serum
- Sun-Kissed Bronzer Palette
- Hydrating Lip Oils (4 shades)

### Content Requirements
- 1 Instagram Reel (60-90 seconds)
- 3 Instagram Stories
- 1 TikTok video
- Honest review and demonstration

### Key Messages
- Clean, sustainable ingredients
- SPF protection for summer
- Buildable, natural-looking coverage
- Cruelty-free and vegan

### Timeline
- Product delivery: Within 5 days of acceptance
- Content due: 2 weeks after receiving products
- Posting window: June 15-30',
 'Must have 50K+ followers on Instagram or TikTok. Beauty/skincare niche preferred. Must be based in the US. Previous brand collaboration experience required.',
 150000, 350000, ARRAY['instagram', 'tiktok'], ARRAY['Beauty', 'Skincare', 'Fashion'],
 ARRAY['New York', 'Los Angeles', 'Miami', 'Chicago'], '18-35',
 NOW() + INTERVAL '7 days', NOW() + INTERVAL '45 days', NOW() + INTERVAL '14 days',
 'OPEN', true, true)
RETURNING id INTO campaign_id_1;

-- Another active campaign
INSERT INTO public.campaigns (id, brand_id, title, description, brief, requirements, budget_min, budget_max, platforms, target_niches, target_locations, start_date, end_date, application_deadline, status, is_public)
VALUES
(gen_random_uuid(), brand_profile_id,
 'Clean Beauty Ambassador Program',
 'Join our exclusive ambassador program! We''re looking for passionate beauty creators who align with our clean beauty values for a 3-month partnership.',
 '## Ambassador Program Details

### What You''ll Get
- Monthly product packages ($500 value)
- Exclusive discount code for your followers (20% off)
- 15% commission on sales
- Early access to new launches
- Feature on our website and social media

### Your Commitment
- 2 posts per month minimum
- Authentic content showcasing products
- Engage with our brand community
- Attend virtual brand events (quarterly)

### Ideal Ambassador
- Genuine passion for clean beauty
- Engaged, authentic community
- Consistent posting schedule
- Professional communication',
 'Minimum 100K followers. Must align with clean beauty values. 3-month commitment required.',
 300000, 500000, ARRAY['instagram', 'youtube', 'tiktok'], ARRAY['Beauty', 'Skincare', 'Lifestyle'],
 ARRAY['New York', 'Los Angeles', 'Austin', 'Seattle'],
 NOW() + INTERVAL '5 days', NOW() + INTERVAL '90 days', NOW() + INTERVAL '21 days',
 'OPEN', true)
RETURNING id INTO campaign_id_2;

-- FitLife campaign
INSERT INTO public.campaigns (id, brand_id, title, description, brief, requirements, budget_min, budget_max, platforms, target_niches, target_locations, start_date, end_date, application_deadline, status, is_public, is_featured)
VALUES
(gen_random_uuid(), brand_profile_id_2,
 'New Year Fitness Challenge',
 'Partner with us for our biggest campaign of the year! We''re launching a 30-day fitness challenge and need motivating fitness influencers to lead the way.',
 '## Fitness Challenge Campaign

### Campaign Overview
Lead your community through our 30-day transformation challenge featuring our new performance wear line.

### Deliverables
- Launch video announcing the challenge
- Weekly check-in posts (4 total)
- Daily story updates during challenge
- Before/after transformation content
- Workout videos featuring our gear

### Products Provided
- Complete performance wear set ($400 value)
- Exclusive challenge merchandise
- Supplements package

### Compensation
- Base fee + performance bonus
- Affiliate commission (10%)
- Potential for long-term partnership',
 'Fitness niche required. Minimum 200K followers. Must be able to commit to 30-day content schedule.',
 400000, 800000, ARRAY['instagram', 'youtube', 'tiktok'], ARRAY['Fitness', 'Health', 'Lifestyle'],
 ARRAY['Miami', 'Los Angeles', 'Austin', 'Denver'],
 NOW() + INTERVAL '14 days', NOW() + INTERVAL '60 days', NOW() + INTERVAL '10 days',
 'OPEN', true, true)
RETURNING id INTO campaign_id_3;

-- Draft campaign
INSERT INTO public.campaigns (id, brand_id, title, description, budget_min, budget_max, platforms, target_niches, status, is_public)
VALUES
(gen_random_uuid(), brand_profile_id,
 'Fall Collection Preview (Draft)',
 'Upcoming fall collection campaign - still in planning phase.',
 200000, 400000, ARRAY['instagram', 'tiktok'], ARRAY['Beauty', 'Fashion'],
 'DRAFT', false)
RETURNING id INTO campaign_id_4;

-- Completed campaign
INSERT INTO public.campaigns (id, brand_id, title, description, brief, budget_min, budget_max, platforms, target_niches, start_date, end_date, status, is_public)
VALUES
(gen_random_uuid(), brand_profile_id,
 'Spring Skincare Routine',
 'Completed campaign featuring our spring skincare essentials.',
 'Campaign successfully completed with 5 influencers.',
 100000, 250000, ARRAY['instagram', 'tiktok'], ARRAY['Beauty', 'Skincare'],
 NOW() - INTERVAL '60 days', NOW() - INTERVAL '30 days',
 'COMPLETED', true)
RETURNING id INTO campaign_id_5;

-- =============================================
-- APPLICATIONS
-- =============================================

-- Emma's application to Summer Glow (Accepted)
INSERT INTO public.applications (id, campaign_id, influencer_id, pitch, proposed_rate, proposed_timeline, status, reviewed_at, review_notes)
VALUES
(gen_random_uuid(), campaign_id_1, influencer_profile_id,
 'Hi! I''m so excited about the Summer Glow Collection! As a beauty creator with 520K followers, I specialize in skincare and makeup tutorials. My audience loves honest reviews and I''ve worked with similar clean beauty brands before. I''d love to create a "Get Ready With Me" style video showcasing the full collection, plus detailed stories about each product. My engagement rate is 4.8% and my content consistently performs well in the beauty space. Looking forward to potentially working together!',
 280000, '2 weeks from product receipt', 'ACCEPTED', NOW() - INTERVAL '3 days',
 'Great fit for our brand! Love her content style and engagement.')
RETURNING id INTO application_id_1;

-- Alex's application to Fitness Challenge (Pending)
INSERT INTO public.applications (id, campaign_id, influencer_id, pitch, proposed_rate, proposed_timeline, status)
VALUES
(gen_random_uuid(), campaign_id_3, influencer_profile_id_2,
 'This campaign is perfect for my audience! I''m a certified personal trainer with 380K engaged followers who trust my fitness recommendations. I''ve led similar challenges before with great results - my last 21-day challenge had over 10,000 participants. I can create high-energy workout content and really motivate my community to join the challenge. Would love to discuss the details!',
 500000, 'Full 30-day commitment', 'PENDING')
RETURNING id INTO application_id_2;

-- Jessica's application to Ambassador Program (Pending)
INSERT INTO public.applications (id, campaign_id, influencer_id, pitch, proposed_rate, proposed_timeline, status)
VALUES
(gen_random_uuid(), campaign_id_2, influencer_profile_id_3,
 'I''ve been following GlowUp Cosmetics for a while and love your commitment to clean beauty! While I''m primarily a travel creator, beauty and skincare are huge parts of my content - especially travel-friendly routines. My audience of 890K is very engaged and always asking for product recommendations. I think I could bring a unique angle to your ambassador program!',
 450000, '3-month commitment', 'PENDING')
RETURNING id INTO application_id_3;

-- More applications for variety
INSERT INTO public.applications (campaign_id, influencer_id, pitch, proposed_rate, status)
VALUES
(campaign_id_1, influencer_profile_id_5,
 'Love the Summer Glow concept! My cooking content often features lifestyle and beauty segments. Would love to create content around summer self-care routines.',
 200000, 'PENDING'),
(campaign_id_3, influencer_profile_id_4,
 'While I''m primarily in tech, I''ve been documenting my fitness journey and my audience has been very receptive. Would bring a unique perspective!',
 350000, 'REJECTED');

-- =============================================
-- COLLABORATIONS
-- =============================================

-- Active collaboration from accepted application
INSERT INTO public.collaborations (id, campaign_id, brand_id, influencer_id, application_id, agreed_rate, timeline, start_date, end_date, status, payment_status, terms)
VALUES
(gen_random_uuid(), campaign_id_1, brand_profile_id, influencer_profile_id, application_id_1,
 280000, '2 weeks', NOW(), NOW() + INTERVAL '14 days', 'ACTIVE', 'ESCROW',
 'Deliverables: 1 Instagram Reel, 3 Stories, 1 TikTok. Payment released upon content approval.')
RETURNING id INTO collaboration_id_1;

-- Completed collaboration
INSERT INTO public.collaborations (id, campaign_id, brand_id, influencer_id, application_id, agreed_rate, start_date, end_date, status, payment_status, content_links, submitted_at, approved_at, feedback, metrics)
VALUES
(gen_random_uuid(), campaign_id_5, brand_profile_id, influencer_profile_id_2, 
 (SELECT id FROM public.applications WHERE campaign_id = campaign_id_5 LIMIT 1),
 200000, NOW() - INTERVAL '45 days', NOW() - INTERVAL '30 days', 'COMPLETED', 'RELEASED',
 'https://instagram.com/p/example1, https://tiktok.com/@example/video1',
 NOW() - INTERVAL '32 days', NOW() - INTERVAL '30 days',
 'Excellent content! Great engagement and authentic presentation.',
 '{"views": 125000, "likes": 8500, "comments": 342, "saves": 1200}'::jsonb)
RETURNING id INTO collaboration_id_2;

-- =============================================
-- PORTFOLIO ITEMS
-- =============================================

INSERT INTO public.portfolio_items (influencer_id, title, description, media_url, media_type, platform, views, likes) VALUES
(influencer_profile_id, 'Summer Skincare Routine', 'My complete morning skincare routine for glowing summer skin', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600', 'image', 'instagram', 95000, 8200),
(influencer_profile_id, 'Clean Beauty Favorites', 'Top 10 clean beauty products I can''t live without', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600', 'image', 'youtube', 180000, 15000),
(influencer_profile_id, 'Get Ready With Me - Date Night', 'Full glam makeup tutorial', 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600', 'video', 'tiktok', 250000, 22000),
(influencer_profile_id_2, '30-Day Transformation', 'My fitness journey results', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600', 'image', 'instagram', 320000, 28000),
(influencer_profile_id_2, 'Home Workout Series', 'No equipment needed full body workout', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600', 'video', 'youtube', 450000, 35000),
(influencer_profile_id_3, 'Hidden Gems of Portugal', 'Off the beaten path travel guide', 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600', 'video', 'youtube', 520000, 42000),
(influencer_profile_id_4, 'iPhone 15 Pro Max Review', 'Honest review after 30 days', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600', 'video', 'youtube', 890000, 65000),
(influencer_profile_id_5, '15-Minute Dinner Recipes', 'Quick and healthy weeknight meals', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', 'video', 'tiktok', 680000, 55000);

-- =============================================
-- MESSAGES
-- =============================================

INSERT INTO public.messages (sender_id, receiver_id, content, is_read, created_at) VALUES
(brand_user_id, influencer_user_id, 'Hi Emma! We loved your application for the Summer Glow Collection campaign. Your content style is exactly what we''re looking for!', true, NOW() - INTERVAL '4 days'),
(influencer_user_id, brand_user_id, 'Thank you so much! I''m really excited about this opportunity. When can I expect to receive the products?', true, NOW() - INTERVAL '4 days' + INTERVAL '2 hours'),
(brand_user_id, influencer_user_id, 'We''ll ship them out tomorrow! You should receive them within 3-5 business days. Let me know if you have any questions about the brief.', true, NOW() - INTERVAL '3 days'),
(influencer_user_id, brand_user_id, 'Perfect! I''ve reviewed the brief and everything looks clear. I''m planning to create a "Summer Morning Routine" theme - does that work for you?', true, NOW() - INTERVAL '2 days'),
(brand_user_id, influencer_user_id, 'That sounds amazing! Can''t wait to see what you create. Feel free to reach out if you need anything!', false, NOW() - INTERVAL '1 day'),
(brand_user_id_2, influencer_user_id_2, 'Hi Alex! Your application for the Fitness Challenge caught our attention. Would love to discuss the details!', false, NOW() - INTERVAL '1 day');

-- =============================================
-- NOTIFICATIONS
-- =============================================

INSERT INTO public.notifications (user_id, type, title, message, link, is_read, created_at) VALUES
(influencer_user_id, 'APPLICATION_ACCEPTED', 'Application Accepted! 🎉', 'Your application for "Summer Glow Collection Launch" has been accepted!', '/dashboard/collaborations', true, NOW() - INTERVAL '3 days'),
(influencer_user_id, 'NEW_MESSAGE', 'New Message from GlowUp Cosmetics', 'Sarah from GlowUp Cosmetics sent you a message', '/dashboard/messages', false, NOW() - INTERVAL '1 day'),
(influencer_user_id, 'COLLABORATION_STARTED', 'Collaboration Started', 'Your collaboration with GlowUp Cosmetics is now active!', '/dashboard/collaborations', true, NOW() - INTERVAL '2 days'),
(brand_user_id, 'NEW_APPLICATION', 'New Application Received', 'Sophia Cooks applied to your "Summer Glow Collection Launch" campaign', '/dashboard/applications', false, NOW() - INTERVAL '12 hours'),
(brand_user_id, 'NEW_APPLICATION', 'New Application Received', 'You have 3 new applications to review', '/dashboard/applications', false, NOW() - INTERVAL '6 hours'),
(influencer_user_id_2, 'APPLICATION_SUBMITTED', 'Application Submitted', 'Your application for "New Year Fitness Challenge" was submitted successfully', '/dashboard/applications', true, NOW() - INTERVAL '2 days'),
(brand_user_id_2, 'NEW_APPLICATION', 'New Application Received', 'Alex Fitness applied to your "New Year Fitness Challenge" campaign', '/dashboard/applications', false, NOW() - INTERVAL '2 days');

-- =============================================
-- REVIEWS
-- =============================================

INSERT INTO public.reviews (brand_id, influencer_id, collaboration_id, rating, title, content, communication, quality, professionalism, timeliness, is_public) VALUES
(brand_profile_id, influencer_profile_id_2, collaboration_id_2, 5, 'Exceptional Partnership!', 
 'Working with Alex was an absolute pleasure. The content exceeded our expectations and the engagement was phenomenal. Highly recommend for any fitness brand!',
 5, 5, 5, 5, true);

-- =============================================
-- AI MATCHES (for brand discovery)
-- =============================================

INSERT INTO public.ai_matches (campaign_id, influencer_id, relevance_score, engagement_score, niche_score, overall_score, reasons, was_viewed, was_contacted) VALUES
(campaign_id_1, influencer_profile_id, 0.95, 0.92, 0.98, 0.95, ARRAY['Perfect niche match', 'High engagement rate', 'Previous beauty brand experience', 'Target demographic alignment'], true, true),
(campaign_id_1, influencer_profile_id_5, 0.75, 0.88, 0.70, 0.78, ARRAY['Lifestyle content overlap', 'Strong engagement', 'Growing beauty content'], true, false),
(campaign_id_3, influencer_profile_id_2, 0.98, 0.94, 0.99, 0.97, ARRAY['Exact niche match', 'Certified trainer', 'Challenge experience', 'Highly engaged fitness audience'], true, true),
(campaign_id_2, influencer_profile_id_3, 0.65, 0.82, 0.60, 0.69, ARRAY['Lifestyle overlap', 'Large audience', 'Travel beauty content potential'], false, false);

RAISE NOTICE 'Demo data seeded successfully!';
RAISE NOTICE 'Brand Profile ID: %', brand_profile_id;
RAISE NOTICE 'Influencer Profile ID: %', influencer_profile_id;

END $$;

-- =============================================
-- IMPORTANT: After running this script, create actual users via Supabase Auth
-- with these emails and then update the UUIDs in this script to match.
--
-- Demo Accounts to Create:
-- 1. brand@demo.com / Demo123! (Role: BRAND)
-- 2. influencer@demo.com / Demo123! (Role: INFLUENCER)
-- =============================================
