'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Filter, Loader2, Users, Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useInfluencers } from '@/lib/queries';
import { formatCurrency, getInitials } from '@/lib/helpers';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

const filterSchema = z.object({
  search: z.string().optional(),
  niche: z.string().optional(),
  platform: z.string().optional(),
  minFollowers: z.number().optional(),
  maxFollowers: z.number().optional(),
  minEngagement: z.number().optional(),
});

type FilterData = z.infer<typeof filterSchema>;

const niches = [
  'Beauty', 'Skincare', 'Fashion', 'OOTD', 'Food', 'Travel', 'Fitness', 'Tech',
  'Gaming', 'Parenting', 'Home', 'Digital', 'Cars', 'Pets', 'Music', 'Photography'
];

const platforms = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'pinterest', label: 'Pinterest' },
  { value: 'snapchat', label: 'Snapchat' },
];

export default function DiscoveryPage() {
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterData>({
    search: '',
    niche: undefined,
    platform: undefined,
    minFollowers: 0,
    maxFollowers: 1000000,
    minEngagement: 0,
  });

  const { data, isLoading } = useInfluencers({
    skip: (page - 1) * 12,
    take: 12,
    ...filters,
  });

  const influencers = Array.isArray(data) ? data : [];
  const total = influencers.length;
  const totalPages = Math.ceil(total / 12) || 1;

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Discover Influencers</h1>
        <p className="text-gray-500 mt-1 text-sm lg:text-base">Browse and find high-quality influencers for your brand</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search influencers..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>
        
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Influencers</SheetTitle>
              <SheetDescription>
                Filter influencers based on criteria
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-6 mt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Niche</label>
                <Select
                  value={filters.niche}
                  onValueChange={(value) => setFilters({ ...filters, niche: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Niche" />
                  </SelectTrigger>
                  <SelectContent>
                    {niches.map((niche) => (
                      <SelectItem key={niche} value={niche}>{niche}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Platform</label>
                <Select
                  value={filters.platform}
                  onValueChange={(value) => setFilters({ ...filters, platform: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Followers</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minFollowers}
                    onChange={(e) => setFilters({ ...filters, minFollowers: Number(e.target.value) })}
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxFollowers}
                    onChange={(e) => setFilters({ ...filters, maxFollowers: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Engagement Rate</label>
                <Slider
                  value={[filters.minEngagement || 0]}
                  onValueChange={([value]) => setFilters({ ...filters, minEngagement: value })}
                  min={0}
                  max={10}
                  step={0.5}
                />
                <p className="text-sm text-gray-500">Min {filters.minEngagement}%</p>
              </div>

              <Button 
                className="w-full" 
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <div className="ml-auto text-sm text-gray-500">
          Found {total} influencers
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : influencers.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No influencers found</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setFilters({
                search: '',
                niche: undefined,
                platform: undefined,
                minFollowers: 0,
                maxFollowers: 1000000,
                minEngagement: 0,
              })}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {influencers.map((influencer: any) => (
            <InfluencerCard key={influencer.id} influencer={influencer} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            Page {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function InfluencerCard({ influencer }: { influencer: any }) {
  const handleMessage = () => {
    toast({
      title: 'Feature Info',
      description: 'Messaging feature is under development',
    });
  };

  const handleInvite = () => {
    toast({
      title: 'Feature Info',
      description: 'Invitation feature is under development',
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <Avatar className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
            <AvatarImage src={influencer.avatarUrl} />
            <AvatarFallback>
              {getInitials(influencer.user?.firstName, influencer.user?.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
              {influencer.displayName}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {influencer.location || 'Location Not Set'}
            </p>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 space-y-2">
          <div className="flex flex-wrap gap-1">
            {influencer.niche?.slice(0, 3).map((n: string) => (
              <Badge key={n} variant="secondary" className="text-xs">
                {n}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-1">
            {influencer.platforms?.map((p: string) => (
              <Badge key={p} variant="outline" className="text-xs">
                {p}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 text-xs sm:text-sm">
          <div>
            <p className="text-gray-500">Followers</p>
            <p className="font-semibold">
              {influencer.followersCount?.toLocaleString() || 0}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Engagement</p>
            <p className="font-semibold">
              {influencer.engagementRate?.toFixed(1) || 0}%
            </p>
          </div>
        </div>

        {influencer.baseRate && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
            <p className="text-xs sm:text-sm text-gray-500">Base Rate</p>
            <p className="text-base sm:text-lg font-semibold text-purple-600">
              {formatCurrency(influencer.baseRate)}
            </p>
          </div>
        )}

        <div className="mt-3 sm:mt-4 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs sm:text-sm"
            onClick={handleMessage}
          >
            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
            Message
          </Button>
          <Button 
            size="sm" 
            className="flex-1 text-xs sm:text-sm"
            onClick={handleInvite}
          >
            Invite
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
