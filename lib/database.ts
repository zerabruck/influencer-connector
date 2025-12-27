import { supabase } from './supabase';
import { UserRole } from '../types/shared';

export class DatabaseService {
  // User operations
  static async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        brand_profiles(*),
        influencer_profiles(*)
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateUserProfile(userId: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateCampaign(id: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteCampaign(id: string) {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async updateApplication(id: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Brand profile operations
  static async createBrandProfile(userId: string, profileData: any) {
    const { data, error } = await supabase
      .from('brand_profiles')
      .insert({ user_id: userId, ...profileData })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateBrandProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('brand_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Influencer profile operations
  static async createInfluencerProfile(userId: string, profileData: any) {
    const { data, error } = await supabase
      .from('influencer_profiles')
      .insert({ user_id: userId, ...profileData })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateInfluencerProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('influencer_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Campaign operations
  static async getCampaigns(filters?: any) {
    let query = supabase
      .from('campaigns')
      .select(`
        *,
        brand_profiles(*)
      `)
      .eq('is_public', true);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.platforms) {
      query = query.overlaps('platforms', filters.platforms);
    }

    if (filters?.niches) {
      query = query.overlaps('target_niches', filters.niches);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getCampaign(id: string) {
    const { data, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        brand_profiles(*),
        applications(
          *,
          influencer_profiles(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createCampaign(brandId: string, campaignData: any) {
    const { data, error } = await supabase
      .from('campaigns')
      .insert({ brand_id: brandId, ...campaignData })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Application operations
  static async createApplication(applicationData: any) {
    const { data, error } = await supabase
      .from('applications')
      .insert(applicationData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getApplications(userId: string, role: UserRole) {
    let query = supabase
      .from('applications')
      .select(`
        *,
        campaigns(*),
        influencer_profiles(*)
      `);

    if (role === UserRole.INFLUENCER) {
      // Get applications by this influencer
      const { data: profile } = await supabase
        .from('influencer_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (profile) {
        query = query.eq('influencer_id', profile.id);
      }
    } else if (role === UserRole.BRAND) {
      // Get applications for this brand's campaigns
      const { data: profile } = await supabase
        .from('brand_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (profile) {
        query = query.in('campaign_id', 
          supabase
            .from('campaigns')
            .select('id')
            .eq('brand_id', profile.id)
        );
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Message operations
  static async getMessages(userId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!sender_id(*),
        receiver:users!receiver_id(*)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async sendMessage(messageData: any) {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Notification operations
  static async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async markNotificationAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Portfolio operations
  static async getPortfolioItems(influencerId: string) {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('influencer_id', influencerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createPortfolioItem(influencerId: string, itemData: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert({ influencer_id: influencerId, ...itemData })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePortfolioItem(itemId: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('portfolio_items')
      .update(updates)
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deletePortfolioItem(itemId: string) {
    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
  }

  // Reviews operations
  static async getReviews(filters?: {
    influencer_id?: string;
    brand_id?: string;
  }) {
    let query = supabase
      .from('reviews')
      .select(`
        *,
        brand_profiles(*),
        influencer_profiles(*)
      `)
      .eq('is_public', true);

    if (filters?.influencer_id) {
      query = query.eq('influencer_id', filters.influencer_id);
    }

    if (filters?.brand_id) {
      query = query.eq('brand_id', filters.brand_id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createReview(reviewData: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async respondToReview(reviewId: string, response: string) {
    const { data, error } = await supabase
      .from('reviews')
      .update({ response })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Collaborations operations
  static async getCollaborations(filters?: {
    brand_id?: string;
    influencer_id?: string;
    status?: string;
  }) {
    let query = supabase
      .from('collaborations')
      .select(`
        *,
        campaigns(*),
        brand_profiles(*),
        influencer_profiles(*)
      `);

    if (filters?.brand_id) {
      query = query.eq('brand_id', filters.brand_id);
    }

    if (filters?.influencer_id) {
      query = query.eq('influencer_id', filters.influencer_id);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getCollaboration(id: string) {
    const { data, error } = await supabase
      .from('collaborations')
      .select(`
        *,
        campaigns(*),
        brand_profiles(*),
        influencer_profiles(*),
        applications(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createCollaboration(collabData: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('collaborations')
      .insert(collabData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateCollaboration(id: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('collaborations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async submitDeliverables(id: string, contentLinks: string, feedback?: string) {
    const { data, error } = await supabase
      .from('collaborations')
      .update({
        content_links: contentLinks,
        feedback,
        status: 'SUBMITTED',
        submitted_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async approveCollaboration(id: string, feedback?: string) {
    const { data, error } = await supabase
      .from('collaborations')
      .update({
        status: 'APPROVED',
        approved_at: new Date().toISOString(),
        approved_by: (await supabase.auth.getUser()).data.user?.id,
        feedback,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async rejectCollaboration(id: string, feedback: string) {
    const { data, error } = await supabase
      .from('collaborations')
      .update({
        status: 'DISPUTED',
        feedback,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // AI Matching operations
  static async getAIMatches(campaignId: string) {
    const { data, error } = await supabase
      .from('ai_matches')
      .select(`
        *,
        influencer_profiles(*)
      `)
      .eq('campaign_id', campaignId)
      .order('overall_score', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createAIMatch(matchData: any) {
    const { data, error } = await supabase
      .from('ai_matches')
      .insert(matchData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async markAIMatchViewed(matchId: string) {
    const { data, error } = await supabase
      .from('ai_matches')
      .update({ was_viewed: true })
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async markAIMatchContacted(matchId: string) {
    const { data, error } = await supabase
      .from('ai_matches')
      .update({ was_contacted: true })
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Discovery operations
  static async discoverInfluencers(filters?: {
    niches?: string[];
    platforms?: string[];
    minFollowers?: number;
    minEngagementRate?: number;
  }) {
    let query = supabase
      .from('influencer_profiles')
      .select('*');

    if (filters?.niches) {
      query = query.overlaps('niche', filters.niches);
    }

    if (filters?.platforms) {
      query = query.overlaps('platforms', filters.platforms);
    }

    if (filters?.minFollowers) {
      query = query.gte('followers_count', filters.minFollowers);
    }

    if (filters?.minEngagementRate) {
      query = query.gte('engagement_rate', filters.minEngagementRate);
    }

    const { data, error } = await query
      .order('followers_count', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  }

  static async discoverCampaigns(filters?: {
    platforms?: string[];
    niches?: string[];
    budgetMin?: number;
  }) {
    let query = supabase
      .from('campaigns')
      .select(`
        *,
        brand_profiles(*)
      `)
      .eq('is_public', true)
      .eq('status', 'OPEN');

    if (filters?.platforms) {
      query = query.overlaps('platforms', filters.platforms);
    }

    if (filters?.niches) {
      query = query.overlaps('target_niches', filters.niches);
    }

    if (filters?.budgetMin) {
      query = query.gte('budget_max', filters.budgetMin);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  }

  // Utility methods
  static async getCurrentUser() {
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    
    if (!supabaseUser) {
      throw new Error('No authenticated user');
    }

    return await this.getUserProfile(supabaseUser.id);
  }

  static async getInfluencersForBrand(brandId: string) {
    const { data, error } = await supabase
      .from('influencer_profiles')
      .select(`
        *,
        applications(
          *,
          campaigns!inner(
            brand_id
          )
        )
      `)
      .eq('applications.campaigns.brand_id', brandId);

    if (error) throw error;
    return data;
  }

  static async getBrandStats(brandId: string) {
    // Get campaign stats
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('brand_id', brandId);

    if (campaignsError) throw campaignsError;

    // Get collaboration stats
    const { data: collaborations, error: collabError } = await supabase
      .from('collaborations')
      .select('*')
      .eq('brand_id', brandId);

    if (collabError) throw collabError;

    // Get application stats
    const { data: applications, error: appError } = await supabase
      .from('applications')
      .select('*')
      .in('campaign_id', campaigns?.map((c: { id: string }) => c.id) || []);

    if (appError) throw appError;

    return {
      totalCampaigns: campaigns?.length || 0,
      activeCampaigns: campaigns?.filter((c: { status: string }) => c.status === 'IN_PROGRESS').length || 0,
      totalCollaborations: collaborations?.length || 0,
      activeCollaborations: collaborations?.filter((c: { status: string }) => c.status === 'ACTIVE').length || 0,
      totalApplications: applications?.length || 0,
      pendingApplications: applications?.filter((a: { status: string }) => a.status === 'PENDING').length || 0,
    };
  }

  static async getInfluencerStats(influencerId: string) {
    // Get application stats
    const { data: applications, error: appError } = await supabase
      .from('applications')
      .select('*')
      .eq('influencer_id', influencerId);

    if (appError) throw appError;

    // Get collaboration stats
    const { data: collaborations, error: collabError } = await supabase
      .from('collaborations')
      .select('*')
      .eq('influencer_id', influencerId);

    if (collabError) throw collabError;

    return {
      totalApplications: applications?.length || 0,
      pendingApplications: applications?.filter((a: { status: string }) => a.status === 'PENDING').length || 0,
      acceptedApplications: applications?.filter((a: { status: string }) => a.status === 'ACCEPTED').length || 0,
      totalCollaborations: collaborations?.length || 0,
      activeCollaborations: collaborations?.filter((c: { status: string }) => c.status === 'ACTIVE').length || 0,
      completedCollaborations: collaborations?.filter((c: { status: string }) => c.status === 'COMPLETED').length || 0,
    };
  }
}
