"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Users, 
  Shield, 
  TrendingUp,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-slate-900" />
            <span className="text-lg font-bold tracking-tight text-slate-900">InfluencerConnect</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="#features" className="text-slate-500 hover:text-slate-900 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-slate-500 hover:text-slate-900 transition-colors">
              Pricing
            </Link>
            <Link href="#about" className="text-slate-500 hover:text-slate-900 transition-colors">
              About
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <Link href="/dashboard">
                <Button variant="default" size="sm" className="h-9 rounded-md px-4">
                  Go to Console
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm" className="h-9 px-4">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="default" size="sm" className="h-9 rounded-md px-4 bg-slate-900 hover:bg-slate-800">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-900 text-xs font-semibold mb-6">
            v1.0.0 Now Available
          </div>
          <h1 className="text-6xl font-bold text-slate-900 mb-6 leading-[1.1]">
            Build better partnerships.<br />
            Scale your brand.
          </h1>
          <p className="text-lg text-slate-500 mb-10 max-w-2xl leading-relaxed">
            A utility-focused platform connecting premium brands with quality influencers. 
            Automated matching, secure escrow, and real-time performance tracking.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link href="/sign-up">
              <Button size="lg" className="rounded-md px-8 bg-slate-900 hover:bg-slate-800 text-white font-medium">
                Start Building <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="rounded-md px-8 border-slate-200 hover:bg-slate-50 font-medium">
                Documentation
              </Button>
            </Link>
          </div>

          <div className="mt-20 pt-10 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem label="Active Influencers" value="12,480" />
            <StatItem label="Campaigns Launched" value="5,230" />
            <StatItem label="Success Rate" value="98.2%" />
            <StatItem label="TVL" value="$42.5M" />
          </div>
        </div>
      </section>

      {/* Bento-style Features */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Engineered for growth</h2>
            <p className="text-slate-500">Everything you need to run high-performance influencer marketing campaigns at scale.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-8 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-5 h-5 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Automated Matchmaking</h3>
              <p className="text-slate-500 max-w-md">Our proprietary matching engine analyzes niche, engagement data, and historical performance to suggest the perfect partners for your campaign objectives.</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl p-8 hover:border-slate-300 transition-colors text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-5 h-5 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Stripe Escrow</h3>
              <p className="text-slate-500">Secure enterprise-grade payouts and fund protection.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-8 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-5 h-5 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Real-time Analytics</h3>
              <p className="text-slate-500">Track reach, conversions, and ROI through a unified data dashboard.</p>
            </div>

            <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-8 text-white">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mb-6">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Briefs</h3>
              <p className="text-slate-400 max-w-md">Generate professional campaign briefs and creative guidelines using our optimized LLM workflows, specifically trained for influencer marketing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Simple utility-based pricing</h2>
            <p className="text-slate-500">Start for free, scale as your partnership network grow.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PriceCard title="Starter" price="0" description="For emerging brands." features={["1 active campaign", "Basic matching", "Community support"]} />
            <PriceCard title="Pro" price="79" description="For professional teams." highlighted features={["Unlimited campaigns", "Advanced AI matching", "Priority Support", "Analytics API"]} />
            <PriceCard title="Enterprise" price="249" description="For large operations." features={["Custom SLA", "Whitelabeling", "Dedicated account manager", "Audit logs"]} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-slate-900" />
              <span className="font-bold tracking-tight text-slate-900">InfluencerConnect</span>
            </div>
            <div className="flex flex-wrap gap-8 text-sm text-slate-500">
              <Link href="#" className="hover:text-slate-900">Privacy</Link>
              <Link href="#" className="hover:text-slate-900">Terms</Link>
              <Link href="#" className="hover:text-slate-900">Support</Link>
              <Link href="#" className="hover:text-slate-900">GitHub</Link>
              <Link href="#" className="hover:text-slate-900">Twitter</Link>
            </div>
            <p className="text-sm text-slate-400">© 2025 InfluencerConnect. Built by Google DeepMind.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function PriceCard({ title, price, description, features, highlighted = false }: any) {
  return (
    <div className={`p-8 rounded-xl border flex flex-col ${highlighted ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200' : 'border-slate-200 bg-white'}`}>
      <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-70">{title}</h3>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-4xl font-bold">${price}</span>
        <span className="text-sm opacity-60">/mo</span>
      </div>
      <p className="text-sm mb-8 opacity-70">{description}</p>
      
      <div className="space-y-4 mb-8 flex-1">
        {features.map((f: string) => (
          <div key={f} className="flex items-center text-sm">
            <CheckCircle className={`w-4 h-4 mr-3 ${highlighted ? 'text-emerald-400' : 'text-slate-900'}`} />
            <span className="opacity-90">{f}</span>
          </div>
        ))}
      </div>

      <Link href="/sign-up">
        <Button className={`w-full rounded-md font-medium ${highlighted ? 'bg-white text-slate-900 hover:bg-slate-50' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
          Get Started
        </Button>
      </Link>
    </div>
  );
}
