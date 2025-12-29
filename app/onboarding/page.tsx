'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, User, Building2, ArrowRight, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCreateBrandProfile, useUpdateInfluencerProfile } from '@/lib/queries';
import { toast } from '@/hooks/use-toast';

const roleSchema = z.object({
  role: z.enum(['BRAND', 'INFLUENCER']),
});

const brandProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  description: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
});

const influencerProfileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  niche: z.array(z.string()).min(1, 'Please select at least one niche'),
  platforms: z.array(z.string()).min(1, 'Please select at least one platform'),
  followersCount: z.number().optional(),
  location: z.string().optional(),
  languages: z.array(z.string()).optional(),
});

type RoleFormData = z.infer<typeof roleSchema>;
type BrandFormData = z.infer<typeof brandProfileSchema>;
type InfluencerFormData = z.infer<typeof influencerProfileSchema>;

const niches = [
  'Beauty', 'Skincare', 'Fashion', 'OOTD', 'Food', 'Travel', 'Fitness', 'Tech',
  'Gaming', 'Parenting', 'Home', 'Digital', 'Cars', 'Pets', 'Music', 'Photography'
];

const platforms = [
  { value: 'instagram', label: 'Instagram', icon: '📸' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵' },
  { value: 'youtube', label: 'YouTube', icon: '📺' },
  { value: 'pinterest', label: 'Pinterest', icon: '�' },
  { value: 'snapchat', label: 'Snapchat', icon: '👻' },
  { value: 'twitch', label: 'Twitch', icon: '🎮' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  
  const createBrandProfile = useCreateBrandProfile();
  const updateInfluencerProfile = useUpdateInfluencerProfile();

  const roleForm = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: { role: undefined },
  });

  const brandForm = useForm<BrandFormData>({
    resolver: zodResolver(brandProfileSchema),
    defaultValues: {
      companyName: user?.firstName ? `${user.firstName}'s Company` : '',
      website: '',
      description: '',
      industry: '',
      location: '',
    },
  });

  const influencerForm = useForm<InfluencerFormData>({
    resolver: zodResolver(influencerProfileSchema),
    defaultValues: {
      displayName: user?.firstName ? `${user.firstName}'s Creative Space` : '',
      bio: '',
      niche: [],
      platforms: [],
      followersCount: 0,
      location: '',
      languages: ['English'],
    },
  });

  const handleRoleSubmit = (data: RoleFormData) => {
    setStep(2);
  };

  const handleBrandSubmit = async (data: BrandFormData) => {
    try {
      await createBrandProfile.mutateAsync({
        ...data,
        website: data.website || undefined,
      });
      toast({ title: 'Setup Complete', description: 'Welcome to InfluencerConnect!' });
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create profile, please try again',
        variant: 'destructive',
      });
    }
  };

  const handleInfluencerSubmit = async (data: InfluencerFormData) => {
    try {
      await updateInfluencerProfile.mutateAsync(data);
      toast({ title: 'Setup Complete', description: 'Welcome to InfluencerConnect!' });
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create profile, please try again',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-8 sm:mb-12">
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          <span className="text-lg sm:text-xl font-bold text-gray-900">InfluencerConnect</span>
        </div>

        {/* Progress */}
        <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-medium text-sm sm:text-base ${
                  step >= s ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 sm:w-20 h-1 mx-1 sm:mx-2 ${step > s ? 'bg-purple-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-500">
            <span>Select Role</span>
            <span>Profile Details</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center pb-4 sm:pb-6">
              <CardTitle className="text-xl sm:text-2xl">Welcome to InfluencerConnect!</CardTitle>
              <CardDescription className="text-sm">Please select your role to customize your experience</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={roleForm.handleSubmit(handleRoleSubmit)}>
                <RadioGroup
                  value={roleForm.watch('role')}
                  onValueChange={(value) => roleForm.setValue('role', value as 'BRAND' | 'INFLUENCER')}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6"
                >
                  <label className="cursor-pointer">
                    <input type="radio" value="BRAND" className="sr-only" />
                    <Card className={`p-4 sm:p-6 transition-all hover:shadow-md ${
                      roleForm.watch('role') === 'BRAND' ? 'ring-2 ring-purple-600 bg-purple-50' : ''
                    }`}>
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                          <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Brand</h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Looking for influencers to promote products and build brand image
                        </p>
                      </div>
                    </Card>
                  </label>

                  <label className="cursor-pointer">
                    <input type="radio" value="INFLUENCER" className="sr-only" />
                    <Card className={`p-4 sm:p-6 transition-all hover:shadow-md ${
                      roleForm.watch('role') === 'INFLUENCER' ? 'ring-2 ring-purple-600 bg-purple-50' : ''
                    }`}>
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                          <User className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Influencer</h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Discover business opportunities and monetize content
                        </p>
                      </div>
                    </Card>
                  </label>
                </RadioGroup>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!roleForm.watch('role')}
                >
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Brand Profile */}
        {step === 2 && roleForm.watch('role') === 'BRAND' && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Complete Brand Info</CardTitle>
              <CardDescription>Let influencers know more about your brand</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={brandForm.handleSubmit(handleBrandSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company/Brand Name *</Label>
                  <Input
                    id="companyName"
                    {...brandForm.register('companyName')}
                    placeholder="Enter company or brand name"
                  />
                  {brandForm.formState.errors.companyName && (
                    <p className="text-sm text-red-500">{brandForm.formState.errors.companyName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    {...brandForm.register('website')}
                    placeholder="https://www.example.com"
                  />
                  {brandForm.formState.errors.website && (
                    <p className="text-sm text-red-500">{brandForm.formState.errors.website.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    {...brandForm.register('industry')}
                    placeholder="e.g. Beauty, Tech, Fashion"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...brandForm.register('location')}
                    placeholder="e.g. New York, Los Angeles"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Brand Description</Label>
                  <Textarea
                    id="description"
                    {...brandForm.register('description')}
                    placeholder="Introduce your brand philosophy and business scope..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={createBrandProfile.isPending}>
                    {createBrandProfile.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Complete Setup'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Influencer Profile */}
        {step === 2 && roleForm.watch('role') === 'INFLUENCER' && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Complete Influencer Profile</CardTitle>
              <CardDescription>Help brands discover you</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={influencerForm.handleSubmit(handleInfluencerSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name *</Label>
                  <Input
                    id="displayName"
                    {...influencerForm.register('displayName')}
                    placeholder="Your stage name or brand name"
                  />
                  {influencerForm.formState.errors.displayName && (
                    <p className="text-sm text-red-500">{influencerForm.formState.errors.displayName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    {...influencerForm.register('bio')}
                    placeholder="Introduce your content style and direction..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Niches *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {niches.map((niche) => (
                      <button
                        key={niche}
                        type="button"
                        onClick={() => {
                          const current = influencerForm.watch('niche');
                          if (current.includes(niche)) {
                            influencerForm.setValue('niche', current.filter((n) => n !== niche));
                          } else {
                            influencerForm.setValue('niche', [...current, niche]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          influencerForm.watch('niche').includes(niche)
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {niche}
                      </button>
                    ))}
                  </div>
                  {influencerForm.formState.errors.niche && (
                    <p className="text-sm text-red-500">{influencerForm.formState.errors.niche.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Active Platforms *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mt-2">
                    {platforms.map((platform) => (
                      <button
                        key={platform.value}
                        type="button"
                        onClick={() => {
                          const current = influencerForm.watch('platforms');
                          if (current.includes(platform.value)) {
                            influencerForm.setValue('platforms', current.filter((p) => p !== platform.value));
                          } else {
                            influencerForm.setValue('platforms', [...current, platform.value]);
                          }
                        }}
                        className={`p-2 sm:p-3 rounded-lg border text-left transition-colors ${
                          influencerForm.watch('platforms').includes(platform.value)
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-base sm:text-lg mr-1 sm:mr-2">{platform.icon}</span>
                        <span className="text-xs sm:text-sm">{platform.label}</span>
                      </button>
                    ))}
                  </div>
                  {influencerForm.formState.errors.platforms && (
                    <p className="text-sm text-red-500">{influencerForm.formState.errors.platforms.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...influencerForm.register('location')}
                    placeholder="e.g. New York, Chicago"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="followersCount">Followers Count</Label>
                  <Input
                    id="followersCount"
                    type="number"
                    {...influencerForm.register('followersCount', { valueAsNumber: true })}
                    placeholder="Total followers"
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={updateInfluencerProfile.isPending}>
                    {updateInfluencerProfile.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Complete Setup'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
