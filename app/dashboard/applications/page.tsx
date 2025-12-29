'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyApplications, useWithdrawApplication, useApplications } from '@/lib/queries';
import { formatDate, formatRelativeTime, getStatusColor, getStatusLabel, getInitials } from '@/lib/helpers';
import { toast } from '@/hooks/use-toast';

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'WITHDRAWN', label: 'Withdrawn' },
];

export default function ApplicationsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('received');

  const { data: sentData, isLoading: sentLoading } = useMyApplications();
  const { data: receivedData, isLoading: receivedLoading } = useApplications();

  const withdrawApplication = useWithdrawApplication();

  const sentApplications = sentData || [];
  const receivedApplications = receivedData || [];

  const handleWithdraw = async (id: string) => {
    if (confirm('Are you sure you want to withdraw this application?')) {
      try {
        await withdrawApplication.mutateAsync(id);
        toast({ title: 'Success', description: 'Application withdrawn' });
      } catch (error) {
        toast({ title: 'Error', description: 'Withdrawal failed', variant: 'destructive' });
      }
    }
  };

  const filterApplications = (apps: any[]) => {
    return apps.filter((app: any) => {
      const matchesSearch = app.campaign?.title?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === 'all' || app.status === status;
      return matchesSearch && matchesStatus;
    });
  };

  const filteredSent = filterApplications(sentApplications);
  const filteredReceived = filterApplications(receivedApplications);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-500 mt-1 text-sm lg:text-base">Manage your sent and received applications</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-40">
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
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="received">
            Received ({receivedApplications.length})
          </TabsTrigger>
          <TabsTrigger value="sent">
            Sent ({sentApplications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-6">
          {receivedLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : filteredReceived.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-gray-500">No applications received yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredReceived.map((application: any) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  type="received"
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="mt-6">
          {sentLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : filteredSent.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-gray-500">No applications sent yet</p>
                <Link href="/dashboard/discover">
                  <Button className="mt-4">Discover Campaigns</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredSent.map((application: any) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  type="sent"
                  onWithdraw={() => handleWithdraw(application.id)}
                  isWithdrawing={withdrawApplication.isPending}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ApplicationCard({ 
  application, 
  type, 
  onWithdraw,
  isWithdrawing 
}: { 
  application: any; 
  type: 'received' | 'sent';
  onWithdraw?: () => void;
  isWithdrawing?: boolean;
}) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
      case 'ACCEPTED':
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
      case 'WITHDRAWN':
        return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />;
    }
  };

  const otherParty = type === 'received' 
    ? application.influencer 
    : application.campaign?.brand;

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
            <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
              <AvatarImage src={otherParty?.avatarUrl || otherParty?.user?.avatarUrl} />
              <AvatarFallback className="text-xs sm:text-sm">
                {type === 'received' 
                  ? getInitials(application.influencer?.displayName)
                  : getInitials(otherParty?.companyName)
                }
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {type === 'received' ? (
                  <Link href={`/dashboard/influencers/${application.influencer?.id}`}>
                    <h4 className="font-semibold text-gray-900 hover:text-purple-600 text-sm sm:text-base truncate">
                      {application.influencer?.displayName}
                    </h4>
                  </Link>
                ) : (
                  <Link href={`/dashboard/campaigns/${application.campaign?.id}`}>
                    <h4 className="font-semibold text-gray-900 hover:text-purple-600 text-sm sm:text-base truncate">
                      {application.campaign?.title}
                    </h4>
                  </Link>
                )}
                <Badge className={getStatusColor(application.status)}>
                  {getStatusLabel(application.status)}
                </Badge>
              </div>
              
              {type === 'received' ? (
                <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                  <p className="truncate">Niches: {application.influencer?.niche?.join(', ')}</p>
                  <p className="truncate">Platforms: {application.influencer?.platforms?.join(', ')}</p>
                </div>
              ) : (
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 truncate">
                  {application.campaign?.brand?.companyName}
                </p>
              )}

              <p className="mt-2 sm:mt-3 text-gray-700 text-sm line-clamp-2">{application.pitch}</p>

              <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                {application.proposedRate && (
                  <span>Rate: ${(application.proposedRate / 100).toFixed(2)}</span>
                )}
                <span>Submitted {formatRelativeTime(application.createdAt)}</span>
              </div>

              {application.reviewNotes && (
                <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600">
                    <span className="font-medium">Review Notes: </span>
                    {application.reviewNotes}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 self-start lg:self-center">
            {getStatusIcon(application.status)}
            
            {type === 'sent' && application.status === 'PENDING' && (
              <Button
                variant="outline"
                size="sm"
                onClick={onWithdraw}
                disabled={isWithdrawing}
                className="text-xs sm:text-sm"
              >
                {isWithdrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Withdraw'}
              </Button>
            )}

            {application.status === 'ACCEPTED' && (
              <Link href={`/dashboard/collaborations/${application.id}`}>
                <Button size="sm" className="text-xs sm:text-sm">View Collaboration</Button>
              </Link>
            )}

            {type === 'received' && application.status === 'PENDING' && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">Reject</Button>
                <Button size="sm" className="text-xs sm:text-sm">Accept</Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
