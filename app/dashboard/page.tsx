import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Megaphone, 
  Users, 
  DollarSign, 
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // Mock Data
  const stats = {
    campaigns: { total: 5, active: 2, completed: 3 },
    applications: { total: 12, pending: 3, accepted: 5 },
    collaborations: { total: 8, active: 2, completed: 6 },
    earnings: { total: 45000, thisMonth: 8500 },
  };

  const recentActivities = [
    { type: 'campaign', title: 'New Beauty Product Promo', status: 'In Progress', time: '2 hours ago' },
    { type: 'application', title: 'Applied for "Tech Review"', status: 'Pending', time: '5 hours ago' },
    { type: 'collaboration', title: 'Completed "Brand Collab"', status: 'Delivered', time: '1 day ago' },
    { type: 'message', title: 'New message from brand', status: 'Unread', time: '2 days ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Campaigns" 
          total={stats.campaigns.total}
          active={stats.campaigns.active}
          icon={<Megaphone className="w-6 h-6 text-purple-600" />}
          href="/dashboard/campaigns"
        />
        <StatCard 
          title="Applications" 
          total={stats.applications.total}
          pending={stats.applications.pending}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          href="/dashboard/applications"
        />
        <StatCard 
          title="Collaborations" 
          total={stats.collaborations.total}
          active={stats.collaborations.active}
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          href="/dashboard/collaborations"
        />
        <StatCard 
          title="Earnings" 
          total={stats.earnings.total}
          thisMonth={stats.earnings.thisMonth}
          icon={<DollarSign className="w-6 h-6 text-yellow-600" />}
          href="/dashboard/payments"
          isCurrency
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center space-x-3">
                    <ActivityIcon type={activity.type} />
                    <div>
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    activity.status === 'In Progress' || activity.status === 'Pending' 
                      ? 'bg-yellow-100 text-yellow-700'
                      : activity.status === 'Delivered'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <QuickAction 
                href="/dashboard/campaigns/create"
                title="Create Campaign"
                description="Post new requirements"
                icon={<Megaphone className="w-5 h-5" />}
              />
              <QuickAction 
                href="/dashboard/discover"
                title="Discover Influencers"
                description="Find quality partners"
                icon={<Users className="w-5 h-5" />}
              />
              <QuickAction 
                href="/dashboard/applications"
                title="Manage Applications"
                description="View and process applications"
                icon={<CheckCircle className="w-5 h-5" />}
              />
              <QuickAction 
                href="/dashboard/messages"
                title="View Messages"
                description="Check communications"
                icon={<Clock className="w-5 h-5" />}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Content */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Campaigns</CardTitle>
          <CardDescription>Latest opportunities for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { title: 'Looking for beauty influencers', budget: '$2,000-5,000', platform: 'Instagram', tags: ['Beauty', 'Skincare'] },
              { title: 'Tech Review Collab', budget: '$1,500-3,000', platform: 'YouTube', tags: ['Tech', 'Review'] },
              { title: 'Fashion OOTD Collab', budget: '$3,000-8,000', platform: 'TikTok', tags: ['Fashion', 'OOTD'] },
            ].map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                <div>
                  <h4 className="font-medium text-gray-900">{campaign.title}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span>{campaign.budget}</span>
                    <span>{campaign.platform}</span>
                    <div className="flex space-x-1">
                      {campaign.tags.map((tag, i) => (
                        <span key={i} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                  <Link href={`/dashboard/campaigns/${index + 1}`}>
                  <Button variant="outline" size="sm">
                    View Details <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          <Link href="/dashboard/discover">
            <Button variant="ghost" className="w-full mt-4">
              View More Campaigns <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ 
  title, 
  total, 
  active, 
  pending,
  thisMonth,
  icon, 
  href,
  isCurrency = false
}: { 
  title: string;
  total: number;
  active?: number;
  pending?: number;
  thisMonth?: number;
  icon: React.ReactNode;
  href: string;
  isCurrency?: boolean;
}) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {isCurrency ? `$${total.toLocaleString()}` : total}
              </p>
              <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                {active !== undefined && (
                  <span className="text-green-600">{active} In Progress</span>
                )}
                {pending !== undefined && (
                  <span className="text-yellow-600">{pending} Pending</span>
                )}
                {thisMonth !== undefined && (
                  <span>This Month {isCurrency ? `$${thisMonth.toLocaleString()}` : thisMonth}</span>
                )}
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ActivityIcon({ type }: { type: string }) {
  const icons = {
    campaign: <Megaphone className="w-5 h-5 text-purple-600" />,
    application: <Users className="w-5 h-5 text-blue-600" />,
    collaboration: <CheckCircle className="w-5 h-5 text-green-600" />,
    message: <Clock className="w-5 h-5 text-yellow-600" />,
  };
  return (
    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
      {icons[type as keyof typeof icons] || icons.campaign}
    </div>
  );
}

function QuickAction({ 
  href, 
  title, 
  description, 
  icon 
}: { 
  href: string; 
  title: string; 
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <div className="p-4 border rounded-lg hover:bg-gray-50 transition cursor-pointer text-center">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
          {icon}
        </div>
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </Link>
  );
}
