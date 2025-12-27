-- =============================================
-- INFLUENCER CONNECT - COMPREHENSIVE DEMO DATA
-- =============================================

DO $$
DECLARE
    brand_user_id UUID := '8dc26405-8bfa-4af3-a485-e92d383ec94d';
    influencer_user_id UUID := '8b05c10d-af82-47af-aeee-55b3db4b61d9';
    
    -- Additional demo user IDs (fake, for other influencers)
    inf2_id UUID := gen_random_uuid();
    inf3_id UUID := gen_random_uuid();
    inf4_id UUID := gen_random_uuid();
    inf5_id UUID := gen_random_uuid();
    inf6_id UUID := gen_random_uuid();
    
    brand_profile_id UUID;
    brand2_profile_id UUID;
    inf_profile_id UUID;
    inf2_profile_id UUID;
    inf3_profile_id UUID;
    inf4_profile_id UUID;
    inf5_profile_id UUID;
    inf6_profile_id UUID;
    
    camp1_id UUID;
    camp2_id UUID;
    camp3_id UUID;
    camp4_id UUID;
    camp5_id UUID;
    camp6_id UUID;
    
    app1_id UUID;
    collab1_id UUID;
BEGIN

-- =============================================
-- USERS - Update main users + create demo influencers
-- =============================================

UPDATE public.users SET 
    first_name = 'Sarah', last_name = 'Johnson',
    avatar_url = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
WHERE id = brand_user_id;

UPDATE public.users SET 
    first_name = 'Emma', last_name = 'Williams',
    avatar_url = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
WHERE id = influencer_user_id;

-- Create additional demo users for influencers
INSERT INTO public.users (id, email, first_name, last_name, avatar_url, role, is_active) VALUES
(inf2_id, 'alex.fitness@demo.com', 'Alex', 'Rivera', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'INFLUENCER', true),
(inf3_id, 'jessica.travel@demo.com', 'Jessica', 'Park', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'INFLUENCER', true),
(inf4_id, 'marcus.tech@demo.com', 'Marcus', 'Thompson', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', 'INFLUENCER', true),
(inf5_id, 'sophia.food@demo.com', 'Sophia', 'Martinez', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 'INFLUENCER', true),
(inf6_id, 'david.lifestyle@demo.com', 'David', 'Kim', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'INFLUENCER', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- BRAND PROFILES
-- =============================================

INSERT INTO public.brand_profiles (user_id, company_name, website, description, logo_url, industry, company_size, location)
VALUES (brand_user_id, 'GlowUp Cosmetics', 'https://glowupcosmetics.com', 
 'Premium skincare and beauty brand focused on clean, sustainable ingredients.',
 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200', 'Beauty & Skincare', '50-200', 'Los Angeles, CA')
ON CONFLICT (user_id) DO UPDATE SET company_name = EXCLUDED.company_name
RETURNING id INTO brand_profile_id;

-- =============================================
-- INFLUENCER PROFILES (6 total)
-- =============================================

INSERT INTO public.influencer_profiles (user_id, display_name, bio, avatar_url, niche, platforms, followers_count, engagement_rate, instagram_url, tiktok_url, youtube_url, base_rate, avg_views, avg_likes, location, languages)
VALUES (influencer_user_id, 'Emma Beauty', 
 'Beauty and skincare enthusiast. Sharing honest reviews and tutorials. 500K+ community!',
 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
 ARRAY['Beauty', 'Skincare', 'Fashion'], ARRAY['instagram', 'tiktok', 'youtube'],
 520000, 4.8, '@emmabeauty', '@emmabeauty', 'EmmaBeautyOfficial', 2500, 85000, 12000, 'New York, NY', ARRAY['English', 'Spanish'])
ON CONFLICT (user_id) DO UPDATE SET display_name = EXCLUDED.display_name
RETURNING id INTO inf_profile_id;

INSERT INTO public.influencer_profiles (user_id, display_name, bio, avatar_url, niche, platforms, followers_count, engagement_rate, instagram_url, tiktok_url, base_rate, avg_views, avg_likes, location, languages)
VALUES (inf2_id, 'Alex Fitness Pro',
 'Certified personal trainer and nutrition coach. Transforming lives one workout at a time!',
 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
 ARRAY['Fitness', 'Health', 'Lifestyle'], ARRAY['instagram', 'youtube', 'tiktok'],
 380000, 5.2, '@alexfitness', '@alexfitpro', 2000, 95000, 18000, 'Miami, FL', ARRAY['English'])
RETURNING id INTO inf2_profile_id;

INSERT INTO public.influencer_profiles (user_id, display_name, bio, avatar_url, niche, platforms, followers_count, engagement_rate, instagram_url, tiktok_url, youtube_url, base_rate, avg_views, avg_likes, location, languages)
VALUES (inf3_id, 'Jess Travels World',
 'Travel blogger exploring hidden gems. 50+ countries and counting! Tips, guides and wanderlust.',
 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
 ARRAY['Travel', 'Lifestyle', 'Photography'], ARRAY['instagram', 'youtube', 'tiktok'],
 890000, 3.9, '@jesstravels', '@jesstravels', 'JessTravelsWorld', 4500, 120000, 25000, 'San Francisco, CA', ARRAY['English', 'French'])
RETURNING id INTO inf3_profile_id;

INSERT INTO public.influencer_profiles (user_id, display_name, bio, avatar_url, niche, platforms, followers_count, engagement_rate, instagram_url, tiktok_url, base_rate, avg_views, avg_likes, location, languages)
VALUES (inf4_id, 'Marcus Tech Reviews',
 'Tech reviewer and gadget enthusiast. Honest reviews on the latest tech!',
 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
 ARRAY['Tech', 'Gaming', 'Digital'], ARRAY['youtube', 'twitter', 'tiktok'],
 1200000, 4.1, '@marcustech', '@marcustechreviews', 6000, 250000, 45000, 'Seattle, WA', ARRAY['English'])
RETURNING id INTO inf4_profile_id;

INSERT INTO public.influencer_profiles (user_id, display_name, bio, avatar_url, niche, platforms, followers_count, engagement_rate, instagram_url, tiktok_url, base_rate, avg_views, avg_likes, location, languages)
VALUES (inf5_id, 'Sophia Cooks',
 'Home chef and recipe developer. Easy recipes for busy people!',
 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
 ARRAY['Food', 'Lifestyle', 'Home'], ARRAY['instagram', 'tiktok', 'youtube'],
 650000, 5.5, '@sophiacooks', '@sophiacooks', 3000, 110000, 22000, 'Chicago, IL', ARRAY['English', 'Italian'])
RETURNING id INTO inf5_profile_id;

INSERT INTO public.influencer_profiles (user_id, display_name, bio, avatar_url, niche, platforms, followers_count, engagement_rate, instagram_url, tiktok_url, base_rate, avg_views, avg_likes, location, languages)
VALUES (inf6_id, 'David Lifestyle',
 'Lifestyle and fashion content creator. Mens fashion, grooming, and daily inspiration.',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
 ARRAY['Fashion', 'Lifestyle', 'Grooming'], ARRAY['instagram', 'tiktok', 'youtube'],
 420000, 4.5, '@davidlifestyle', '@davidstyle', 2200, 78000, 15000, 'Austin, TX', ARRAY['English', 'Korean'])
RETURNING id INTO inf6_profile_id;

-- =============================================
-- CAMPAIGNS (6 total - various statuses)
-- =============================================

-- Campaign 1: OPEN - Summer Glow (Featured)
INSERT INTO public.campaigns (brand_id, title, description, brief, requirements, budget_min, budget_max, platforms, target_niches, target_locations, target_age_range, start_date, end_date, application_deadline, status, is_public, is_featured)
VALUES (brand_profile_id, 
 'Summer Glow Collection Launch',
 'Launching our new Summer Glow Collection! Looking for beauty influencers to create authentic content showcasing SPF-infused skincare and radiant makeup.',
 E'## Campaign Brief\n\n### Products\n- Radiant SPF 50 Moisturizer\n- Glow Drops Highlighting Serum\n- Sun-Kissed Bronzer Palette\n- Hydrating Lip Oils\n\n### Deliverables\n- 1 Instagram Reel (60-90 sec)\n- 3 Instagram Stories\n- 1 TikTok video\n\n### Key Messages\n- Clean, sustainable ingredients\n- SPF protection\n- Cruelty-free and vegan',
 'Must have 50K+ followers on Instagram or TikTok. Beauty/skincare niche. US-based.',
 150000, 350000, ARRAY['instagram', 'tiktok'], ARRAY['Beauty', 'Skincare', 'Fashion'],
 ARRAY['New York', 'Los Angeles', 'Miami', 'Chicago'], '18-35',
 NOW() + INTERVAL '7 days', NOW() + INTERVAL '45 days', NOW() + INTERVAL '14 days',
 'OPEN', true, true)
RETURNING id INTO camp1_id;

-- Campaign 2: OPEN - Ambassador Program
INSERT INTO public.campaigns (brand_id, title, description, brief, budget_min, budget_max, platforms, target_niches, target_locations, start_date, end_date, application_deadline, status, is_public, is_featured)
VALUES (brand_profile_id,
 'Clean Beauty Ambassador Program',
 'Join our exclusive 3-month ambassador program! Monthly products, exclusive discount codes, and 15% commission on sales.',
 E'## Ambassador Benefits\n- Monthly product packages ($500 value)\n- 20% discount code for followers\n- 15% commission on sales\n- Early access to launches\n\n## Commitment\n- 2 posts per month minimum\n- Attend quarterly virtual events',
 300000, 500000, ARRAY['instagram', 'youtube', 'tiktok'], ARRAY['Beauty', 'Skincare', 'Lifestyle'],
 ARRAY['New York', 'Los Angeles', 'Austin', 'Seattle'],
 NOW() + INTERVAL '5 days', NOW() + INTERVAL '90 days', NOW() + INTERVAL '21 days',
 'OPEN', true, true)
RETURNING id INTO camp2_id;

-- Campaign 3: OPEN - Holiday Collection
INSERT INTO public.campaigns (brand_id, title, description, budget_min, budget_max, platforms, target_niches, target_locations, start_date, end_date, application_deadline, status, is_public)
VALUES (brand_profile_id,
 'Holiday Glam Collection Preview',
 'Be the first to showcase our limited edition Holiday Glam Collection! Rich, festive colors and luxurious packaging.',
 200000, 400000, ARRAY['instagram', 'tiktok', 'youtube'], ARRAY['Beauty', 'Fashion', 'Lifestyle'],
 ARRAY['New York', 'Los Angeles', 'Chicago', 'Dallas'],
 NOW() + INTERVAL '30 days', NOW() + INTERVAL '75 days', NOW() + INTERVAL '25 days',
 'OPEN', true)
RETURNING id INTO camp3_id;

-- Campaign 4: IN_PROGRESS
INSERT INTO public.campaigns (brand_id, title, description, budget_min, budget_max, platforms, target_niches, start_date, end_date, status, is_public)
VALUES (brand_profile_id,
 'Spring Skincare Essentials',
 'Ongoing campaign featuring our spring skincare line. Content creation in progress.',
 100000, 250000, ARRAY['instagram', 'tiktok'], ARRAY['Beauty', 'Skincare'],
 NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days',
 'IN_PROGRESS', true)
RETURNING id INTO camp4_id;

-- Campaign 5: DRAFT
INSERT INTO public.campaigns (brand_id, title, description, budget_min, budget_max, platforms, target_niches, status, is_public)
VALUES (brand_profile_id,
 'Fall Collection Preview (Draft)',
 'Upcoming fall collection campaign - still finalizing details and budget.',
 200000, 400000, ARRAY['instagram', 'tiktok'], ARRAY['Beauty', 'Fashion'],
 'DRAFT', false)
RETURNING id INTO camp5_id;

-- Campaign 6: COMPLETED
INSERT INTO public.campaigns (brand_id, title, description, budget_min, budget_max, platforms, target_niches, start_date, end_date, status, is_public)
VALUES (brand_profile_id,
 'Valentine Day Special',
 'Successfully completed campaign for our Valentine limited edition collection.',
 150000, 300000, ARRAY['instagram', 'tiktok'], ARRAY['Beauty', 'Lifestyle'],
 NOW() - INTERVAL '60 days', NOW() - INTERVAL '30 days',
 'COMPLETED', true)
RETURNING id INTO camp6_id;

-- =============================================
-- APPLICATIONS (12 total - various statuses)
-- =============================================

-- Applications for Campaign 1 (Summer Glow)
INSERT INTO public.applications (campaign_id, influencer_id, pitch, proposed_rate, proposed_timeline, status, reviewed_at, review_notes)
VALUES (camp1_id, inf_profile_id,
 'Hi! I am so excited about the Summer Glow Collection! As a beauty creator with 520K followers, I specialize in skincare tutorials. My engagement rate is 4.8% and I have worked with similar clean beauty brands. Would love to create a Get Ready With Me style video!',
 280000, '2 weeks from product receipt', 'ACCEPTED', NOW() - INTERVAL '3 days', 'Perfect fit! Love her content style.')
RETURNING id INTO app1_id;

INSERT INTO public.applications (campaign_id, influencer_id, pitch, proposed_rate, status)
VALUES (camp1_id, inf3_profile_id,
 'While I am primarily a travel creator, beauty and skincare are huge parts of my content - especially travel-friendly routines. My 890K audience loves product recommendations!',
 350000, 'PENDING');

INSERT INTO public.applications (campaign_id, influencer_id, pitch, proposed_rate, status)
VALUES (camp1_id, inf5_profile_id,
 'Love the Summer Glow concept! My cooking content often features lifestyle and self-care segments. Would create content around summer morning routines.',
 200000, 'PENDING');

INSERT INTO public.applications (campaign_id, influencer_id, pitch, proposed_rate, status, reviewed_at, review_notes)
VALUES (camp1_id, inf4_profile_id,
 'I know I am in tech, but I have been expanding into lifestyle content. Would bring a unique male perspective to your products.',
 180000, 'REJECTED', NOW() - INTERVAL '2 days', 'Not the right fit for this campaign, but keep in mind for future.');

-- Applications for Campaign 2 (Ambassador Program)
INSERT INTO public.applications (campaign_id, influencer_id, pitch, proposed_rate, status)
VALUES (camp2_id, inf_profile_id,
 'Would love to be part of your ambassador program! Clean beauty aligns perfectly with my values and my audience trusts my recommendations.',
 450000, 'PENDING');

INSERT INTO public.applications (campaign_id, influencer_id, pitch, proposed_rate, status)
VALUES (camp2_id, inf6_profile_id,
 'As a mens lifestyle creator, I think I could bring a unique angle to your ambassador program. Skincare for men is growing!',
 380000, 'PENDING');

-- Applications for Campaign 3 (Holiday Collection)
INSERT INTO public.applications (campaign_id, influencer_id, pitch, proposed_rate, status)
VALUES (camp3_id, inf_profile_id,
 'Holiday content is my favorite! I would love to create festive glam tutorials featuring your collection.',
 320000, 'PENDING');

INSERT INTO public.applications (campaign_id, influencer_id, pitch, proposed_rate, status)
VALUES (camp3_id, inf3_profile_id,
 'Holiday travel content with glam looks would be perfect for my audience!',
 400000, 'PENDING');

INSERT INTO public.applications (campaign_id, influencer_id, pitch, proposed_rate, status)
VALUES (camp3_id, inf5_profile_id,
 'Holiday party looks while cooking festive recipes - a unique content angle!',
 250000, 'PENDING');

-- Applications for Campaign 4 (In Progress - already accepted)
INSERT INTO public.applications (campaign_id, influencer_id, pitch, proposed_rate, status, reviewed_at)
VALUES (camp4_id, inf2_profile_id,
 'Skincare is essential for fitness enthusiasts. Would love to show my post-workout skincare routine!',
 220000, 'ACCEPTED', NOW() - INTERVAL '15 days');

-- Applications for Completed Campaign
INSERT INTO public.applications (campaign_id, influencer_id, pitch, proposed_rate, status, reviewed_at)
VALUES (camp6_id, inf_profile_id,
 'Valentine themed beauty content is perfect for my audience!',
 250000, 'COMPLETED', NOW() - INTERVAL '65 days');

INSERT INTO public.applications (campaign_id, influencer_id, pitch, proposed_rate, status, reviewed_at)
VALUES (camp6_id, inf6_profile_id,
 'Mens grooming for Valentine - gift guide and date night looks.',
 200000, 'COMPLETED', NOW() - INTERVAL '65 days');

-- =============================================
-- COLLABORATIONS
-- =============================================

-- Active collaboration from accepted application
INSERT INTO public.collaborations (campaign_id, brand_id, influencer_id, application_id, agreed_rate, timeline, start_date, end_date, status, payment_status, terms)
VALUES (camp1_id, brand_profile_id, inf_profile_id, app1_id,
 280000, '2 weeks', NOW(), NOW() + INTERVAL '14 days', 'ACTIVE', 'ESCROW',
 'Deliverables: 1 Instagram Reel, 3 Stories, 1 TikTok. Payment released upon content approval.')
RETURNING id INTO collab1_id;

-- Completed collaborations
INSERT INTO public.collaborations (campaign_id, brand_id, influencer_id, application_id, agreed_rate, start_date, end_date, status, payment_status, content_links, submitted_at, approved_at, feedback, metrics)
SELECT camp6_id, brand_profile_id, inf_profile_id, id, 250000,
 NOW() - INTERVAL '55 days', NOW() - INTERVAL '35 days', 'COMPLETED', 'RELEASED',
 'https://instagram.com/p/example1, https://tiktok.com/@emmabeauty/video1',
 NOW() - INTERVAL '38 days', NOW() - INTERVAL '35 days',
 'Excellent content! Great engagement and authentic presentation.',
 '{"views": 125000, "likes": 8500, "comments": 342, "saves": 1200}'::jsonb
FROM public.applications WHERE campaign_id = camp6_id AND influencer_id = inf_profile_id LIMIT 1;

INSERT INTO public.collaborations (campaign_id, brand_id, influencer_id, application_id, agreed_rate, start_date, end_date, status, payment_status, content_links, submitted_at, approved_at, feedback, metrics)
SELECT camp6_id, brand_profile_id, inf6_profile_id, id, 200000,
 NOW() - INTERVAL '55 days', NOW() - INTERVAL '35 days', 'COMPLETED', 'RELEASED',
 'https://instagram.com/p/example2, https://tiktok.com/@davidstyle/video1',
 NOW() - INTERVAL '40 days', NOW() - INTERVAL '35 days',
 'Great male perspective on our products!',
 '{"views": 95000, "likes": 6200, "comments": 280, "saves": 890}'::jsonb
FROM public.applications WHERE campaign_id = camp6_id AND influencer_id = inf6_profile_id LIMIT 1;

-- =============================================
-- PORTFOLIO ITEMS
-- =============================================

INSERT INTO public.portfolio_items (influencer_id, title, description, media_url, media_type, platform, views, likes) VALUES
(inf_profile_id, 'Summer Skincare Routine', 'My complete morning skincare routine', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600', 'image', 'instagram', 95000, 8200),
(inf_profile_id, 'Clean Beauty Favorites', 'Top 10 clean beauty products', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600', 'image', 'youtube', 180000, 15000),
(inf_profile_id, 'Get Ready With Me', 'Full glam makeup tutorial', 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600', 'video', 'tiktok', 250000, 22000),
(inf2_profile_id, '30-Day Transformation', 'My fitness journey results', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600', 'image', 'instagram', 320000, 28000),
(inf2_profile_id, 'Home Workout Series', 'No equipment full body workout', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600', 'video', 'youtube', 450000, 35000),
(inf3_profile_id, 'Hidden Gems of Portugal', 'Off the beaten path guide', 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600', 'video', 'youtube', 520000, 42000),
(inf4_profile_id, 'iPhone 15 Pro Review', 'Honest review after 30 days', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600', 'video', 'youtube', 890000, 65000),
(inf5_profile_id, '15-Minute Dinners', 'Quick weeknight meals', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', 'video', 'tiktok', 680000, 55000),
(inf6_profile_id, 'Mens Grooming Essentials', 'Daily grooming routine', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600', 'video', 'instagram', 210000, 18000);

-- =============================================
-- MESSAGES
-- =============================================

INSERT INTO public.messages (sender_id, receiver_id, content, is_read, created_at) VALUES
(brand_user_id, influencer_user_id, 'Hi Emma! We loved your application for the Summer Glow Collection. Your content style is exactly what we are looking for!', true, NOW() - INTERVAL '4 days'),
(influencer_user_id, brand_user_id, 'Thank you so much! I am really excited about this opportunity. When can I expect the products?', true, NOW() - INTERVAL '4 days' + INTERVAL '2 hours'),
(brand_user_id, influencer_user_id, 'We will ship them tomorrow! You should receive them within 3-5 business days.', true, NOW() - INTERVAL '3 days'),
(influencer_user_id, brand_user_id, 'Perfect! I am planning a Summer Morning Routine theme - does that work for you?', true, NOW() - INTERVAL '2 days'),
(brand_user_id, influencer_user_id, 'That sounds amazing! Cannot wait to see what you create. Feel free to reach out if you need anything!', false, NOW() - INTERVAL '1 day');

-- =============================================
-- NOTIFICATIONS
-- =============================================

INSERT INTO public.notifications (user_id, type, title, message, link, is_read, created_at) VALUES
-- Influencer notifications
(influencer_user_id, 'APPLICATION_ACCEPTED', 'Application Accepted!', 'Your application for Summer Glow Collection Launch has been accepted!', '/dashboard/collaborations', true, NOW() - INTERVAL '3 days'),
(influencer_user_id, 'NEW_MESSAGE', 'New Message', 'Sarah from GlowUp Cosmetics sent you a message', '/dashboard/messages', false, NOW() - INTERVAL '1 day'),
(influencer_user_id, 'COLLABORATION_STARTED', 'Collaboration Started', 'Your collaboration with GlowUp Cosmetics is now active!', '/dashboard/collaborations', true, NOW() - INTERVAL '2 days'),
(influencer_user_id, 'CAMPAIGN_REMINDER', 'Content Due Soon', 'Your content for Summer Glow Collection is due in 5 days', '/dashboard/collaborations', false, NOW() - INTERVAL '6 hours'),
-- Brand notifications
(brand_user_id, 'NEW_APPLICATION', 'New Application', 'Jessica Park applied to Summer Glow Collection Launch', '/dashboard/applications', false, NOW() - INTERVAL '12 hours'),
(brand_user_id, 'NEW_APPLICATION', 'New Application', 'Sophia Martinez applied to Summer Glow Collection Launch', '/dashboard/applications', false, NOW() - INTERVAL '8 hours'),
(brand_user_id, 'NEW_APPLICATION', 'New Application', 'You have 3 new applications for Holiday Glam Collection', '/dashboard/applications', false, NOW() - INTERVAL '4 hours'),
(brand_user_id, 'COLLABORATION_STARTED', 'Collaboration Active', 'Your collaboration with Emma Beauty is now active', '/dashboard/collaborations', true, NOW() - INTERVAL '3 days');

-- =============================================
-- REVIEWS
-- =============================================

INSERT INTO public.reviews (brand_id, influencer_id, collaboration_id, rating, title, content, communication, quality, professionalism, timeliness, is_public)
SELECT brand_profile_id, inf_profile_id, c.id, 5, 'Outstanding Partnership!',
 'Working with Emma was fantastic. Her content exceeded expectations and engagement was phenomenal. Highly recommend!',
 5, 5, 5, 5, true
FROM public.collaborations c WHERE c.influencer_id = inf_profile_id AND c.status = 'COMPLETED' LIMIT 1;

INSERT INTO public.reviews (brand_id, influencer_id, collaboration_id, rating, title, content, communication, quality, professionalism, timeliness, is_public)
SELECT brand_profile_id, inf6_profile_id, c.id, 4, 'Great Collaboration',
 'David brought a fresh perspective to our products. Content was creative and well-received by his audience.',
 4, 5, 4, 4, true
FROM public.collaborations c WHERE c.influencer_id = inf6_profile_id AND c.status = 'COMPLETED' LIMIT 1;

-- =============================================
-- AI MATCHES (for brand discovery)
-- =============================================

INSERT INTO public.ai_matches (campaign_id, influencer_id, relevance_score, engagement_score, niche_score, overall_score, reasons, was_viewed, was_contacted) VALUES
(camp1_id, inf_profile_id, 0.95, 0.92, 0.98, 0.95, ARRAY['Perfect niche match', 'High engagement rate', 'Previous beauty brand experience'], true, true),
(camp1_id, inf3_profile_id, 0.75, 0.82, 0.70, 0.76, ARRAY['Lifestyle content overlap', 'Large audience', 'Travel beauty potential'], true, false),
(camp1_id, inf5_profile_id, 0.68, 0.88, 0.65, 0.74, ARRAY['Lifestyle overlap', 'Strong engagement', 'Growing beauty content'], false, false),
(camp1_id, inf6_profile_id, 0.72, 0.85, 0.75, 0.77, ARRAY['Mens grooming angle', 'Fashion crossover', 'Engaged male audience'], false, false),
(camp2_id, inf_profile_id, 0.92, 0.92, 0.95, 0.93, ARRAY['Brand alignment', 'Consistent posting', 'Ambassador experience'], true, true),
(camp3_id, inf_profile_id, 0.90, 0.92, 0.94, 0.92, ARRAY['Holiday content expertise', 'High engagement', 'Previous success'], false, false);

RAISE NOTICE 'Comprehensive demo data seeded successfully!';
RAISE NOTICE 'Created: 6 influencer profiles, 6 campaigns, 12 applications, collaborations, messages, and more!';

END $$;
