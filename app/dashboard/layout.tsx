"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  MessageSquare,
  CreditCard,
  Settings,
  Bell,
  Sparkles,
  LogOut,
  FileText,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const isBrand = user?.role === "BRAND";
  const isInfluencer = user?.role === "INFLUENCER";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">InfluencerConnect</span>
          </Link>
        </div>

        <nav className="mt-6 px-4">
          <NavLink href="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Overview" />
          
          {/* Brand-specific navigation */}
          {isBrand && (
            <>
              <NavLink href="/dashboard/campaigns" icon={<Megaphone className="w-5 h-5" />} label="My Campaigns" />
              <NavLink href="/dashboard/discover" icon={<Search className="w-5 h-5" />} label="Find Influencers" />
              <NavLink href="/dashboard/applications" icon={<FileText className="w-5 h-5" />} label="Applications" />
            </>
          )}
          
          {/* Influencer-specific navigation */}
          {isInfluencer && (
            <>
              <NavLink href="/dashboard/discover" icon={<Search className="w-5 h-5" />} label="Find Campaigns" />
              <NavLink href="/dashboard/applications" icon={<FileText className="w-5 h-5" />} label="My Applications" />
            </>
          )}
          
          {/* Shared navigation */}
          <NavLink href="/dashboard/collaborations" icon={<Users className="w-5 h-5" />} label="Collaborations" />
          <NavLink href="/dashboard/messages" icon={<MessageSquare className="w-5 h-5" />} label="Messages" />
          <NavLink href="/dashboard/finance" icon={<CreditCard className="w-5 h-5" />} label="Financials" />
          <NavLink href="/dashboard/settings" icon={<Settings className="w-5 h-5" />} label="Settings" />
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-medium">
                  {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {isBrand ? "Brand" : isInfluencer ? "Influencer" : "User"}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isBrand ? "Brand Dashboard" : "Influencer Dashboard"}
            </h1>
            <p className="text-sm text-gray-500">
              Welcome back, {user?.firstName || "User"}!
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({ 
  href, 
  icon, 
  label 
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string;
}) {
  return (
    <Link 
      href={href}
      className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors mb-1"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
