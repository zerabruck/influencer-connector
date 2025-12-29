'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  FileText,
  Upload,
  MessageSquare,
  DollarSign,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useCollaborations, useMyCollaborations, useCollaborationStats, useSubmitDeliverables, useApproveCollaboration, useRejectCollaboration } from '@/lib/queries';
import { formatCurrency, formatDate, formatRelativeTime, getStatusColor, getStatusLabel, getInitials } from '@/lib/helpers';
import { toast } from '@/hooks/use-toast';

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'ACTIVE', label: 'In Progress' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'APPROVED', label: 'Completed' },
];

export default function CollaborationsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedCollab, setSelectedCollab] = useState<any>(null);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [contentLinks, setContentLinks] = useState('');

  const { data: collaborationsData, isLoading } = useMyCollaborations();
  const { data: stats } = useCollaborationStats();

  const submitDeliverables = useSubmitDeliverables();
  const approveCollaboration = useApproveCollaboration();
  const rejectCollaboration = useRejectCollaboration();

  const collaborations = collaborationsData || [];

  const handleSubmit = async () => {
    if (!selectedCollab) return;
    try {
      await submitDeliverables.mutateAsync({
        id: selectedCollab.id,
        data: { contentLinks },
      });
      toast({ title: 'Success', description: 'Deliverables submitted' });
      setSubmitDialogOpen(false);
      setContentLinks('');
    } catch (error) {
      toast({ title: 'Error', description: 'Submission failed', variant: 'destructive' });
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveCollaboration.mutateAsync({ id });
      toast({ title: 'Success', description: 'Approved successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Operation failed', variant: 'destructive' });
    }
  };

  const handleReject = async (id: string) => {
    const feedback = prompt('Please enter rejection reason:');
    if (feedback === null) return;
    try {
      await rejectCollaboration.mutateAsync({ id, feedback });
      toast({ title: 'Success', description: 'Rejection feedback sent' });
    } catch (error) {
      toast({ title: 'Error', description: 'Operation failed', variant: 'destructive' });
    }
  };

  const filterCollaborations = (collabs: any[]) => {
    return collabs.filter((collab: any) => {
      const matchesSearch = collab.campaign?.title?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === 'all' || collab.status === status;
      return matchesSearch && matchesStatus;
    });
  };

  const filteredCollab = filterCollaborations(collaborations);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Collaborations</h1>
        <p className="text-gray-500 mt-1 text-sm lg:text-base">Manage your collaborations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="text-xl sm:text-2xl font-bold">{(stats as any)?.totalCollaborations || 0}</div>
            <p className="text-xs sm:text-sm text-gray-500">Total Collaborations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{(stats as any)?.activeCollaborations || 0}</div>
            <p className="text-xs sm:text-sm text-gray-500">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{(stats as any)?.pendingApplications || 0}</div>
            <p className="text-xs sm:text-sm text-gray-500">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{(stats as any)?.completedCollaborations || 0}</div>
            <p className="text-xs sm:text-sm text-gray-500">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search collaborations..."
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

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : filteredCollab.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No collaborations found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCollab.map((collab: any) => (
            <CollaborationCard
              key={collab.id}
              collaboration={collab}
              onSubmit={() => {
                setSelectedCollab(collab);
                setSubmitDialogOpen(true);
              }}
              onApprove={() => handleApprove(collab.id)}
              onReject={() => handleReject(collab.id)}
              isSubmitting={submitDeliverables.isPending}
              isApproving={approveCollaboration.isPending}
              isRejecting={rejectCollaboration.isPending}
            />
          ))}
        </div>
      )}

      {/* Submit Dialog */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Deliverables</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Campaign Title</p>
              <p className="font-medium">{selectedCollab?.campaign?.title}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content Link *</label>
              <Textarea
                placeholder="Enter link to published content..."
                value={contentLinks}
                onChange={(e) => setContentLinks(e.target.value)}
                rows={4}
              />
              <p className="text-sm text-gray-500">
                Please provide the link to your published content for brand review
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!contentLinks.trim() || submitDeliverables.isPending}
            >
              {submitDeliverables.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Submit'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CollaborationCard({ 
  collaboration,
  onSubmit,
  onApprove,
  onReject,
  isSubmitting,
  isApproving,
  isRejecting
}: { 
  collaboration: any;
  onSubmit: () => void;
  onApprove: () => void;
  onReject: () => void;
  isSubmitting: boolean;
  isApproving: boolean;
  isRejecting: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
            <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
              <AvatarFallback className="text-xs sm:text-sm">
                {getInitials(collaboration.campaign?.title)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Link href={`/dashboard/campaigns/${collaboration.campaign?.id}`}>
                  <h4 className="font-semibold text-gray-900 hover:text-purple-600 text-sm sm:text-base truncate">
                    {collaboration.campaign?.title}
                  </h4>
                </Link>
                <Badge className={getStatusColor(collaboration.status)}>
                  {getStatusLabel(collaboration.status)}
                </Badge>
              </div>
              
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Amount: {formatCurrency(collaboration.agreedRate)}
              </p>

              {collaboration.feedback && (
                <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-yellow-800">
                    <span className="font-medium">Feedback: </span>
                    {collaboration.feedback}
                  </p>
                </div>
              )}

              <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <span>Created at {formatRelativeTime(collaboration.createdAt)}</span>
                {collaboration.submittedAt && (
                  <span>Submitted at {formatRelativeTime(collaboration.submittedAt)}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <Link href={`/dashboard/messages`}>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                Message
              </Button>
            </Link>

            {collaboration.status === 'ACTIVE' && (
              <Button size="sm" onClick={onSubmit} disabled={isSubmitting} className="text-xs sm:text-sm">
                <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                Submit
              </Button>
            )}

            {collaboration.status === 'SUBMITTED' && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onReject}
                  disabled={isRejecting}
                  className="text-xs sm:text-sm"
                >
                  Reject
                </Button>
                <Button size="sm" onClick={onApprove} disabled={isApproving} className="text-xs sm:text-sm">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                  Approve
                </Button>
              </>
            )}

            {collaboration.status === 'APPROVED' && (
              <Link href={`/dashboard/payments`}>
                <Button size="sm" className="text-xs sm:text-sm">
                  <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                  View Payment
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
