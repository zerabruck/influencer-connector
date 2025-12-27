'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DatabaseService } from './database';
import { UserRole } from '../types/shared';

// Query Keys
export const queryKeys = {
  // Auth
  currentUser: ['currentUser'],
  
  // Campaigns
  campaigns: {
    all: ['campaigns'] as const,
    list: (filters?: Record<string, unknown>) => ['campaigns', 'list', filters] as const,
    detail: (id: string) => ['campaigns', 'detail', id] as const,
    my: (role: string) => ['campaigns', 'my', role] as const,
    stats: (brandId: string) => ['campaigns', 'stats', brandId] as const,
  },
  
  // Applications
  applications: {
    all: ['applications'] as const,
    byCampaign: (campaignId: string) => ['applications', 'campaign', campaignId] as const,
    my: ['applications', 'my'] as const,
    detail: (id: string) => ['applications', 'detail', id] as const,
  },
  
  // Collaborations
  collaborations: {
    all: ['collaborations'] as const,
    my: ['collaborations', 'my'] as const,
    detail: (id: string) => ['collaborations', 'detail', id] as const,
    stats: ['collaborations', 'stats'] as const,
  },
  
  // Profiles
  profiles: {
    influencer: (userId: string) => ['profiles', 'influencer', userId] as const,
    brand: (userId: string) => ['profiles', 'brand', userId] as const,
    myInfluencer: ['profiles', 'my', 'influencer'] as const,
    myBrand: ['profiles', 'my', 'brand'] as const,
    portfolio: (influencerId: string) => ['profiles', 'portfolio', influencerId] as const,
  },
  
  // Discovery
  influencers: {
    all: ['influencers'] as const,
    list: (filters?: Record<string, unknown>) => ['influencers', 'list', filters] as const,
    detail: (id: string) => ['influencers', 'detail', id] as const,
  },
  
  // Messages
  messages: {
    all: ['messages'] as const,
    conversation: (userId: string, otherUserId: string) => ['messages', userId, otherUserId] as const,
    contacts: ['messages', 'contacts'] as const,
    unreadCount: ['messages', 'unread'] as const,
  },
  
  // Notifications
  notifications: {
    all: ['notifications'] as const,
    list: (filters?: Record<string, unknown>) => ['notifications', 'list', filters] as const,
    unreadCount: ['notifications', 'unread'] as const,
  },
  
  // Payments
  payments: {
    history: ['payments', 'history'] as const,
  },
  
  // Reviews
  reviews: {
    byInfluencer: (influencerId: string) => ['reviews', 'influencer', influencerId] as const,
  },
  
  // AI
  ai: {
    matches: (campaignId: string) => ['ai', 'matches', campaignId] as const,
  },

  // Wallet
  wallet: {
    balance: ['wallet', 'balance'] as const,
    transactions: ['wallet', 'transactions'] as const,
    withdrawals: ['wallet', 'withdrawals'] as const,
  },

  // User
  user: {
    devices: ['user', 'devices'] as const,
  },
};

// React Query Hooks - Using DatabaseService directly
export function useCampaigns(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.campaigns.list(filters),
    queryFn: () => DatabaseService.getCampaigns(filters),
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: queryKeys.campaigns.detail(id),
    queryFn: () => DatabaseService.getCampaign(id),
    enabled: !!id,
  });
}

export function useMyCampaigns() {
  return useQuery({
    queryKey: queryKeys.campaigns.my('brand'),
    queryFn: () => {
      const fetchCampaigns = async () => {
        const currentUser = await DatabaseService.getCurrentUser();
        if (currentUser.brand_profiles?.length > 0) {
          return DatabaseService.getCampaigns({ brand_id: currentUser.brand_profiles[0].id });
        }
        return [];
      };
      return fetchCampaigns();
    },
  });
}

export function useCampaignStats(brandId?: string) {
  return useQuery({
    queryKey: queryKeys.campaigns.stats(brandId || ''),
    queryFn: () => DatabaseService.getBrandStats(brandId!),
    enabled: !!brandId,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ data }: { data: Record<string, unknown> }) => {
      const createCampaign = async () => {
        const currentUser = await DatabaseService.getCurrentUser();
        if (!currentUser.brand_profiles || currentUser.brand_profiles.length === 0) {
          throw new Error('You need to create a brand profile first. Go to Settings to set up your brand profile.');
        }
        return DatabaseService.createCampaign(currentUser.brand_profiles[0].id, data);
      };
      return createCampaign();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      DatabaseService.updateCampaign(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.detail(variables.id) });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => DatabaseService.deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
    },
  });
}

export function useApplications(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.applications.all,
    queryFn: () => {
      const fetchApplications = async () => {
        const currentUser = await DatabaseService.getCurrentUser();
        return DatabaseService.getApplications(currentUser.id, currentUser.role);
      };
      return fetchApplications();
    },
  });
}

export function useMyApplications() {
  return useQuery({
    queryKey: queryKeys.applications.my,
    queryFn: () => {
      const fetchApplications = async () => {
        const currentUser = await DatabaseService.getCurrentUser();
        return DatabaseService.getApplications(currentUser.id, currentUser.role);
      };
      return fetchApplications();
    },
  });
}

export function useCampaignApplications(campaignId: string) {
  return useQuery({
    queryKey: queryKeys.applications.byCampaign(campaignId),
    queryFn: () => {
      const fetchApplications = async () => {
        const campaign = await DatabaseService.getCampaign(campaignId);
        return campaign.applications || [];
      };
      return fetchApplications();
    },
    enabled: !!campaignId,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ campaignId, data }: { campaignId: string; data: Record<string, unknown> }) => {
      const createApplication = async () => {
        const currentUser = await DatabaseService.getCurrentUser();
        if (currentUser.influencer_profiles?.length === 0) {
          throw new Error('User must have an influencer profile to apply to campaigns');
        }
        return DatabaseService.createApplication({
          campaign_id: campaignId,
          influencer_id: currentUser.influencer_profiles[0].id,
          ...data,
        });
      };
      return createApplication();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      DatabaseService.updateApplication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
    },
  });
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => DatabaseService.updateApplication(id, { status: 'WITHDRAWN' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
    },
  });
}

export function useCollaborations(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.collaborations.all,
    queryFn: () => {
      const fetchCollaborations = async () => {
        const currentUser = await DatabaseService.getCurrentUser();
        if (currentUser.role === UserRole.BRAND && currentUser.brand_profiles?.length > 0) {
          return DatabaseService.getCollaborations({ brand_id: currentUser.brand_profiles[0].id });
        } else if (currentUser.role === UserRole.INFLUENCER && currentUser.influencer_profiles?.length > 0) {
          return DatabaseService.getCollaborations({ influencer_id: currentUser.influencer_profiles[0].id });
        }
        return [];
      };
      return fetchCollaborations();
    },
  });
}

export function useMyCollaborations() {
  return useQuery({
    queryKey: queryKeys.collaborations.my,
    queryFn: () => {
      const fetchCollaborations = async () => {
        const currentUser = await DatabaseService.getCurrentUser();
        if (currentUser.role === UserRole.BRAND && currentUser.brand_profiles?.length > 0) {
          return DatabaseService.getCollaborations({ brand_id: currentUser.brand_profiles[0].id });
        } else if (currentUser.role === UserRole.INFLUENCER && currentUser.influencer_profiles?.length > 0) {
          return DatabaseService.getCollaborations({ influencer_id: currentUser.influencer_profiles[0].id });
        }
        return [];
      };
      return fetchCollaborations();
    },
  });
}

export function useCollaboration(id: string) {
  return useQuery({
    queryKey: queryKeys.collaborations.detail(id),
    queryFn: () => DatabaseService.getCollaboration(id),
    enabled: !!id,
  });
}

export function useCollaborationStats() {
  return useQuery({
    queryKey: queryKeys.collaborations.stats,
    queryFn: () => {
      const fetchStats = async () => {
        const currentUser = await DatabaseService.getCurrentUser();
        if (currentUser.role === UserRole.BRAND && currentUser.brand_profiles?.length > 0) {
          return DatabaseService.getBrandStats(currentUser.brand_profiles[0].id);
        } else if (currentUser.role === UserRole.INFLUENCER && currentUser.influencer_profiles?.length > 0) {
          return DatabaseService.getInfluencerStats(currentUser.influencer_profiles[0].id);
        }
        return {};
      };
      return fetchStats();
    },
  });
}

export function useConfirmCollaboration() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => DatabaseService.updateCollaboration(id, { status: 'ACTIVE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collaborations.all });
    },
  });
}

export function useSubmitDeliverables() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { contentLinks: string; feedback?: string } }) =>
      DatabaseService.submitDeliverables(id, data.contentLinks, data.feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collaborations.all });
    },
  });
}

export function useApproveCollaboration() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, feedback }: { id: string; feedback?: string }) =>
      DatabaseService.approveCollaboration(id, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collaborations.all });
    },
  });
}

export function useRejectCollaboration() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, feedback }: { id: string; feedback: string }) =>
      DatabaseService.rejectCollaboration(id, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collaborations.all });
    },
  });
}

export function useInfluencers(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.influencers.list(filters),
    queryFn: () => DatabaseService.discoverInfluencers(filters),
  });
}

export function useInfluencerProfile(userId: string) {
  return useQuery({
    queryKey: queryKeys.profiles.influencer(userId),
    queryFn: () => DatabaseService.getUserProfile(userId),
    enabled: !!userId,
  });
}

export function useMyInfluencerProfile() {
  return useQuery({
    queryKey: queryKeys.profiles.myInfluencer,
    queryFn: () => {
      const fetchProfile = async () => {
        const currentUser = await DatabaseService.getCurrentUser();
        return currentUser.influencer_profiles?.[0] || null;
      };
      return fetchProfile();
    },
  });
}

export function useMyBrandProfile() {
  return useQuery({
    queryKey: queryKeys.profiles.myBrand,
    queryFn: () => {
      const fetchProfile = async () => {
        const currentUser = await DatabaseService.getCurrentUser();
        return currentUser.brand_profiles?.[0] || null;
      };
      return fetchProfile();
    },
  });
}

export function useUpdateInfluencerProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => {
      const updateProfile = async () => {
        const currentUser = await DatabaseService.getCurrentUser();
        return DatabaseService.updateInfluencerProfile(currentUser.id, data);
      };
      return updateProfile();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.myInfluencer });
    },
  });
}

export function useCreateBrandProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => {
      const createProfile = async () => {
        const currentUser = await DatabaseService.getCurrentUser();
        return DatabaseService.createBrandProfile(currentUser.id, data);
      };
      return createProfile();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.myBrand });
    },
  });
}

export function useUpdateBrandProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => {
      const updateProfile = async () => {
        const currentUser = await DatabaseService.getCurrentUser();
        return DatabaseService.updateBrandProfile(currentUser.id, data);
      };
      return updateProfile();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.myBrand });
    },
  });
}

export function useMessages(otherUserId: string) {
  return useQuery({
    queryKey: queryKeys.messages.conversation('current', otherUserId),
    queryFn: () => {
      const fetchMessages = async () => {
        // For now, return empty array - can be enhanced with proper conversation query
        const currentUser = await DatabaseService.getCurrentUser();
        return DatabaseService.getMessages(currentUser.id);
      };
      return fetchMessages();
    },
    enabled: !!otherUserId,
  });
}

export function useMessageContacts() {
  return useQuery({
    queryKey: queryKeys.messages.contacts,
    queryFn: () => {
      const fetchContacts = async () => {
        const currentUser = await DatabaseService.getCurrentUser();
        const messages = await DatabaseService.getMessages(currentUser.id);
        // Extract unique contacts from messages
        const contacts = messages.reduce((acc: any[], msg: any) => {
          const contact = msg.sender_id === currentUser.id ? msg.receiver : msg.sender;
          if (contact && !acc.find(c => c.id === contact.id)) {
            acc.push(contact);
          }
          return acc;
        }, []);
        return contacts;
      };
      return fetchContacts();
    },
  });
}

export function useUnreadMessageCount() {
  return useQuery({
    queryKey: queryKeys.messages.unreadCount,
    queryFn: () => {
      const fetchCount = async () => {
        const currentUser = await DatabaseService.getCurrentUser();
        const messages = await DatabaseService.getMessages(currentUser.id);
        return messages.filter((m: any) => !m.is_read && m.receiver_id === currentUser.id).length;
      };
      return fetchCount();
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ receiverId, content }: { receiverId: string; content: string }) => {
      const sendMessage = async () => {
        const currentUser = await DatabaseService.getCurrentUser();
        return DatabaseService.sendMessage({
          sender_id: currentUser.id,
          receiver_id: receiverId,
          content,
        });
      };
      return sendMessage();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.all });
    },
  });
}

export function useNotifications(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.notifications.list(filters),
    queryFn: () => {
      const fetchNotifications = async () => {
        const currentUser = await DatabaseService.getCurrentUser();
        return DatabaseService.getNotifications(currentUser.id);
      };
      return fetchNotifications();
    },
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount,
    queryFn: () => {
      const fetchCount = async () => {
        const currentUser = await DatabaseService.getCurrentUser();
        const notifications = await DatabaseService.getNotifications(currentUser.id);
        return notifications.filter((n: any) => !n.is_read).length;
      };
      return fetchCount();
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => DatabaseService.markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => {
      const markAllRead = async () => {
        const currentUser = await DatabaseService.getCurrentUser();
        const notifications = await DatabaseService.getNotifications(currentUser.id);
        const unreadNotifications = notifications.filter((n: any) => !n.is_read);
        
        // Mark all as read
        await Promise.all(
          unreadNotifications.map((n: any) => DatabaseService.markNotificationAsRead(n.id))
        );
        
        return { success: true };
      };
      return markAllRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

// User hooks
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: () => DatabaseService.getCurrentUser(),
    retry: false,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => {
      const updateUser = async () => {
        const currentUser = await DatabaseService.getCurrentUser();
        return DatabaseService.updateUserProfile(currentUser.id, data);
      };
      return updateUser();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
    },
  });
}

// AI hooks
export function useAIMatchInfluencers(campaignId: string) {
  return useQuery({
    queryKey: queryKeys.ai.matches(campaignId),
    queryFn: () => DatabaseService.getAIMatches(campaignId),
    enabled: !!campaignId,
  });
}

export function useAIGenerateBrief(campaignId: string) {
  return useMutation({
    mutationFn: () => {
      const generateBrief = async () => {
        // AI functionality would need to be implemented
        throw new Error('AI brief generation not implemented yet');
      };
      return generateBrief();
    },
  });
}

export function useAIAnalyzeInfluencer(influencerId: string) {
  return useQuery({
    queryKey: ['ai', 'analyze', influencerId],
    queryFn: () => {
      const analyzeInfluencer = async () => {
        // AI analysis functionality would need to be implemented
        throw new Error('AI analysis not implemented yet');
      };
      return analyzeInfluencer();
    },
    enabled: !!influencerId,
  });
}

// Portfolio hooks
export function usePortfolioItems(influencerId: string) {
  return useQuery({
    queryKey: queryKeys.profiles.portfolio(influencerId),
    queryFn: () => DatabaseService.getPortfolioItems(influencerId),
    enabled: !!influencerId,
  });
}

export function useCreatePortfolioItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ data }: { data: Record<string, unknown> }) => {
      const createItem = async () => {
        const currentUser = await DatabaseService.getCurrentUser();
        if (currentUser.influencer_profiles?.length === 0) {
          throw new Error('User must have an influencer profile');
        }
        return DatabaseService.createPortfolioItem(currentUser.influencer_profiles[0].id, data);
      };
      return createItem();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles', 'portfolio'] });
    },
  });
}

export function useUpdatePortfolioItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      DatabaseService.updatePortfolioItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles', 'portfolio'] });
    },
  });
}

export function useDeletePortfolioItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => DatabaseService.deletePortfolioItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles', 'portfolio'] });
    },
  });
}

// Reviews hooks
export function useReviews(filters?: { influencer_id?: string; brand_id?: string }) {
  return useQuery({
    queryKey: ['reviews', filters],
    queryFn: () => DatabaseService.getReviews(filters),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => DatabaseService.createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useRespondToReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, response }: { id: string; response: string }) =>
      DatabaseService.respondToReview(id, response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

// Discovery hooks
export function useDiscoverInfluencers(filters?: {
  niches?: string[];
  platforms?: string[];
  minFollowers?: number;
  minEngagementRate?: number;
}) {
  return useQuery({
    queryKey: ['discover', 'influencers', filters],
    queryFn: () => DatabaseService.discoverInfluencers(filters),
  });
}

export function useDiscoverCampaigns(filters?: {
  platforms?: string[];
  niches?: string[];
  budgetMin?: number;
}) {
  return useQuery({
    queryKey: ['discover', 'campaigns', filters],
    queryFn: () => DatabaseService.discoverCampaigns(filters),
  });
}


// Alias for useCurrentUser (used by settings page)
export const useUser = useCurrentUser;

// User devices hook (placeholder - implement with actual device tracking)
export function useUserDevices() {
  return useQuery({
    queryKey: queryKeys.user.devices,
    queryFn: async () => {
      // Placeholder - return mock data for now
      // In production, this would fetch from a device tracking service
      return [
        {
          id: '1',
          browser: 'Chrome',
          os: 'Windows',
          location: 'Unknown',
          ip: '127.0.0.1',
          lastActive: 'Now',
          isCurrent: true,
        },
      ];
    },
  });
}


// Wallet/Finance hooks
export function useWalletBalance() {
  return useQuery({
    queryKey: queryKeys.wallet.balance,
    queryFn: async () => {
      // Placeholder - implement with actual wallet service
      return {
        available: 0,
        pending: 0,
        total: 0,
        currency: 'USD',
      };
    },
  });
}

export function useTransactions(options?: { limit?: number }) {
  return useQuery({
    queryKey: queryKeys.wallet.transactions,
    queryFn: async () => {
      // Placeholder - implement with actual transaction service
      return [];
    },
  });
}

export function useWithdrawals() {
  return useQuery({
    queryKey: queryKeys.wallet.withdrawals,
    queryFn: async () => {
      // Placeholder - implement with actual withdrawal service
      return [];
    },
  });
}
