'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Users,
  Clock,
  DollarSign,
  Loader2
} from 'lucide-react';
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useCampaigns, useMyCampaigns, useDeleteCampaign } from '@/lib/queries';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel, getPlatformIcon } from '@/lib/helpers';
import { toast } from '@/hooks/use-toast';

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'DRAFT', label: 'Draft' },
];

export default function CampaignsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  const { data: campaignsData, isLoading } = useMyCampaigns();
  const { data: publicCampaigns } = useCampaigns({ skip: (page - 1) * 10, take: 10 });
  
  const deleteCampaign = useDeleteCampaign();

  const campaigns = campaignsData || [];
  const publicData = publicCampaigns || [];

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this campaign? This cannot be undone.')) {
      try {
        await deleteCampaign.mutateAsync(id);
        toast({ title: 'Success', description: 'Campaign deleted' });
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
      }
    }
  };

  const filteredCampaigns = campaigns.filter((campaign: any) => {
    const matchesSearch = campaign.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'all' || campaign.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-500 mt-1">Manage your marketing campaigns</p>
        </div>
        <Link href="/dashboard/campaigns/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="my" className="w-full">
        <TabsList>
          <TabsTrigger value="my">My Campaigns</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>

        <TabsContent value="my" className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-gray-500 mb-4">No campaigns created yet</p>
                <Link href="/dashboard/campaigns/create">
                  <Button>Create First Campaign</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredCampaigns.map((campaign: any) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onDelete={() => handleDelete(campaign.id)}
                  isDeleting={deleteCampaign.isPending}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="discover" className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : publicData.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-gray-500">No campaigns available</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {publicData.map((campaign: any) => (
                <PublicCampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CampaignCard({ campaign, onDelete, isDeleting }: { 
  campaign: any; 
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
              <Badge className={getStatusColor(campaign.status)}>
                {getStatusLabel(campaign.status)}
              </Badge>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{formatCurrency(campaign.budgetMin)} - {formatCurrency(campaign.budgetMax)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDate(campaign.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{campaign._count?.applications || 0} Applications</span>
              </div>
              <div className="flex items-center gap-1">
                {campaign.platforms?.map((p: string) => (
                  <span key={p} className="mr-1">{getPlatformIcon(p)}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/dashboard/campaigns/${campaign.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            </Link>
            {campaign.status === 'DRAFT' && (
              <Link href={`/dashboard/campaigns/${campaign.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </Link>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onDelete} disabled={isDeleting}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PublicCampaignCard({ campaign }: { campaign: any }) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
              <Badge className={getStatusColor(campaign.status)}>
                {getStatusLabel(campaign.status)}
              </Badge>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{formatCurrency(campaign.budgetMin)} - {formatCurrency(campaign.budgetMax)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{campaign._count?.applications || 0} Applications</span>
              </div>
            </div>
          </div>

          <Link href={`/dashboard/campaigns/${campaign.id}`}>
            <Button size="sm">View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
