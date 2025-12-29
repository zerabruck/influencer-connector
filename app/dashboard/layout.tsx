"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed h-screen bg-white border-r border-gray-200 z-50
        w-64 transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 lg:p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2" onClick={closeSidebar}>
            <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600" />
            <span className="text-lg lg:text-xl font-bold text-gray-900">InfluencerConnect</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={closeSidebar}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="mt-4 lg:mt-6 px-3 lg:px-4">
          <NavLink href="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Overview" onClick={closeSidebar} />
          
          {/* Brand-specific navigation */}
          {isBrand && (
            <>
              <NavLink href="/dashboard/campaigns" icon={<Megaphone className="w-5 h-5" />} label="My Campaigns" onClick={closeSidebar} />
              <NavLink href="/dashboard/discover" icon={<Search className="w-5 h-5" />} label="Find Influencers" onClick={closeSidebar} />
              <NavLink href="/dashboard/applications" icon={<FileText className="w-5 h-5" />} label="Applications" onClick={closeSidebar} />
            </>
          )}
          
          {/* Influencer-specific navigation */}
          {isInfluencer && (
            <>
              <NavLink href="/dashboard/discover" icon={<Search className="w-5 h-5" />} label="Find Campaigns" onClick={closeSidebar} />
              <NavLink href="/dashboard/applications" icon={<FileText className="w-5 h-5" />} label="My Applications" onClick={closeSidebar} />
            </>
          )}
          
          {/* Shared navigation */}
          <NavLink href="/dashboard/collaborations" icon={<Users className="w-5 h-5" />} label="Collaborations" onClick={closeSidebar} />
          <NavLink href="/dashboard/messages" icon={<MessageSquare className="w-5 h-5" />} label="Messages" onClick={closeSidebar} />
          <NavLink href="/dashboard/finance" icon={<CreditCard className="w-5 h-5" />} label="Financials" onClick={closeSidebar} />
          <NavLink href="/dashboard/settings" icon={<Settings className="w-5 h-5" />} label="Settings" onClick={closeSidebar} />
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-medium text-sm lg:text-base">
                  {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
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
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-3 lg:py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg lg:text-2xl font-bold text-gray-900">
                {isBrand ? "Brand Dashboard" : "Influencer Dashboard"}
              </h1>
              <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">
                Welcome back, {user?.firstName || "User"}!
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({ 
  href, 
  icon, 
  label,
  onClick
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link 
      href={href}
      onClick={onClick}
      className="flex items-center space-x-3 px-3 lg:px-4 py-2.5 lg:py-3 text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors mb-1"
    >
      {icon}
      <span className="text-sm lg:text-base">{label}</span>
    </Link>
  );
}
