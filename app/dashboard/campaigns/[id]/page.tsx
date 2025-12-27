'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  DollarSign, 
  Edit,
  Check,
  X,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useCampaign, useCampaignApplications, useUpdateApplicationStatus } from '@/lib/queries';
import { formatCurrency, formatDate, formatRelativeTime, getStatusColor, getStatusLabel, getPlatformIcon } from '@/lib/helpers';
import { toast } from '@/hooks/use-toast';

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const [activeTab, setActiveTab] = useState('overview');

  const { data: campaign, isLoading } = useCampaign(campaignId);
  const { data: applicationsData } = useCampaignApplications(campaignId);
  const updateStatus = useUpdateApplicationStatus();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Campaign not found</p>
        <Link href="/dashboard/campaigns">
          <Button className="mt-4">Back to List</Button>
        </Link>
      </div>
    );
  }

  const applications = applicationsData || [];

  const handleAccept = async (applicationId: string) => {
    try {
      await updateStatus.mutateAsync({
        id: applicationId,
        data: { status: 'ACCEPTED' },
      });
      toast({ title: 'Success', description: 'Application accepted' });
    } catch (error) {
      toast({ title: 'Error', description: 'Operation failed', variant: 'destructive' });
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      await updateStatus.mutateAsync({
        id: applicationId,
        data: { status: 'REJECTED', reviewNotes: 'Does not meet requirements' },
      });
      toast({ title: 'Success', description: 'Application rejected' });
    } catch (error) {
      toast({ title: 'Error', description: 'Operation failed', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/campaigns">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{campaign.title}</h1>
            <Badge className={getStatusColor(campaign.status)}>
              {getStatusLabel(campaign.status)}
            </Badge>
          </div>
          <p className="text-gray-500 mt-1">Created at {formatDate(campaign.createdAt)}</p>
        </div>
        {campaign.status === 'DRAFT' && (
          <Link href={`/dashboard/campaigns/${campaignId}/edit`}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Budget Range</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(campaign.budgetMin)} - {formatCurrency(campaign.budgetMax)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Applicants</p>
                <p className="text-lg font-semibold">{applications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                {campaign.platforms?.map((p: string) => (
                  <span key={p} className="text-lg">{getPlatformIcon(p)}</span>
                ))}
              </div>
              <div>
                <p className="text-sm text-gray-500">Target Platforms</p>
                <p className="text-lg font-semibold">{campaign.platforms?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Niches</p>
                <p className="text-lg font-semibold">{campaign.targetNiches?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">
            Applications ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{campaign.description}</p>
                </CardContent>
              </Card>

              {campaign.requirements && (
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-wrap">{campaign.requirements}</p>
                  </CardContent>
                </Card>
              )}

              {campaign.brief && (
                <Card>
                  <CardHeader>
                    <CardTitle>Brief Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                        {campaign.brief}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Target Platforms</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {campaign.platforms?.map((p: string) => (
                        <Badge key={p} variant="outline">
                          {getPlatformIcon(p)} {p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Target Niches</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {campaign.targetNiches?.map((n: string) => (
                        <Badge key={n} variant="outline">{n}</Badge>
                      ))}
                    </div>
                  </div>
                  {campaign.targetLocations?.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500">Target Locations</p>
                      <p className="mt-1">{campaign.targetLocations.join(', ')}</p>
                    </div>
                  )}
                  {campaign.applicationDeadline && (
                    <div>
                      <p className="text-sm text-gray-500">Deadline</p>
                      <p className="mt-1">{formatDate(campaign.applicationDeadline)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Brand Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={campaign.brand?.user?.avatarUrl} />
                      <AvatarFallback>
                        {campaign.brand?.companyName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{campaign.brand?.companyName}</p>
                      <p className="text-sm text-gray-500">{campaign.brand?.industry}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          {applications.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No applications received yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {applications.map((application: any) => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={application.influencer?.user?.avatarUrl} />
                          <AvatarFallback>
                            {application.influencer?.displayName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{application.influencer?.displayName}</h4>
                            <Badge className={getStatusColor(application.status)}>
                              {getStatusLabel(application.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {application.influencer?.niche?.join(', ')} · 
                            {application.influencer?.platforms?.join(', ')}
                          </p>
                          <p className="mt-3 text-gray-700">{application.pitch}</p>
                          {application.proposedRate && (
                            <p className="text-sm text-purple-600 mt-2">
                              Rate: {formatCurrency(application.proposedRate)}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            Submitted {formatRelativeTime(application.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      {application.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(application.id)}
                            disabled={updateStatus.isPending}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAccept(application.id)}
                            disabled={updateStatus.isPending}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                        </div>
                      )}
                      
                      {application.status === 'ACCEPTED' && (
                        <Link href={`/dashboard/collaborations/${application.id}`}>
                          <Button size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Start Collaboration
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="deliverables" className="mt-6">
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500">No deliverables yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Deliverables will appear here once submitted by the influencer
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
