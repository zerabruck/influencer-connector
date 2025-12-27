'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Moon, 
  Sun,
  Camera,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Link2,
  CameraOff,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { useUser, useUpdateUser, useUserDevices } from '@/lib/queries';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const profileSchema = z.object({
  firstName: z.string().min(1, 'Enter first name'),
  lastName: z.string().min(1, 'Enter last name'),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  location: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  campaignUpdates: z.boolean(),
  collaborationRequests: z.boolean(),
  paymentAlerts: z.boolean(),
  marketingEmails: z.boolean(),
  weeklyDigest: z.boolean(),
});

type NotificationSettings = z.infer<typeof notificationSettingsSchema>;

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Enter current password'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain uppercase, lowercase letters and numbers'
  ),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type PasswordForm = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const { data: user, isLoading: userLoading } = useUser();
  const { data: devices } = useUserDevices();
  const updateUser = useUpdateUser();

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.socialLinks?.website || '',
      twitter: user?.socialLinks?.twitter || '',
      instagram: user?.socialLinks?.instagram || '',
      tiktok: user?.socialLinks?.tiktok || '',
    },
  });

  const notificationForm = useForm<NotificationSettings>({
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      campaignUpdates: true,
      collaborationRequests: true,
      paymentAlerts: true,
      marketingEmails: false,
      weeklyDigest: true,
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Update form default values when user data is loaded
  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.socialLinks?.website || '',
        twitter: user.socialLinks?.twitter || '',
        instagram: user.socialLinks?.instagram || '',
        tiktok: user.socialLinks?.tiktok || '',
      });
    }
  }, [user]);

  const handleSaveProfile = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      await updateUser.mutateAsync({
        ...data,
        socialLinks: {
          website: data.website,
          twitter: data.twitter,
          instagram: data.instagram,
          tiktok: data.tiktok,
        },
      });
      toast.success('Profile updated');
    } catch (error) {
      toast.error('Update failed, please try again later');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (data: PasswordForm) => {
    setIsLoading(true);
    try {
      // Call change password API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password successfully changed');
      setIsPasswordDialogOpen(false);
      passwordForm.reset();
    } catch (error) {
      toast.error('Password change failed, check current password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async (data: NotificationSettings) => {
    try {
      // Call save notification settings API
      toast.success('Notification settings updated');
    } catch (error) {
      toast.error('Save failed, please try again later');
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile, notification preferences, and account security</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
              {/* Avatar Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Avatar</CardTitle>
                  <CardDescription>Update your profile picture</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={user?.avatarUrl} alt={user?.firstName} />
                      <AvatarFallback className="text-2xl">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button size="icon" className="absolute bottom-0 right-0 rounded-full">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <CameraOff className="h-4 w-4 mr-2" />
                    Remove Avatar
                  </Button>
                </CardContent>
              </Card>

              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Info</CardTitle>
                  <CardDescription>Update your profile information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={profileForm.handleSubmit(handleSaveProfile)} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="Enter first name"
                          {...profileForm.register('firstName')}
                        />
                        {profileForm.formState.errors.firstName && (
                          <p className="text-sm text-red-500">{profileForm.formState.errors.firstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Enter last name"
                          {...profileForm.register('lastName')}
                        />
                        {profileForm.formState.errors.lastName && (
                          <p className="text-sm text-red-500">{profileForm.formState.errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px]"
                        {...profileForm.register('bio')}
                      />
                      <p className="text-xs text-muted-foreground">
                        {profileForm.watch('bio')?.length || 0}/500 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          placeholder="Enter your city"
                          className="pl-9"
                          {...profileForm.register('location')}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Social Links */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Social Links</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="website"
                              placeholder="https://example.com"
                              className="pl-9"
                              {...profileForm.register('website')}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twitter">Twitter / X</Label>
                          <div className="relative">
                            <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="twitter"
                              placeholder="@username"
                              className="pl-9"
                              {...profileForm.register('twitter')}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="instagram">Instagram</Label>
                          <div className="relative">
                            <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="instagram"
                              placeholder="@username"
                              className="pl-9"
                              {...profileForm.register('instagram')}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tiktok">TikTok</Label>
                          <div className="relative">
                            <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="tiktok"
                              placeholder="@username"
                              className="pl-9"
                              {...profileForm.register('tiktok')}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => profileForm.reset()}>
                        Reset
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notification Settings Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={notificationForm.handleSubmit(handleSaveNotifications)} className="space-y-6">
                  {/* Notification Channels */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Channels</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive important notifications via email</p>
                          </div>
                        </div>
                        <Controller
                          name="emailNotifications"
                          control={notificationForm.control}
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Push Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                          </div>
                        </div>
                        <Controller
                          name="pushNotifications"
                          control={notificationForm.control}
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Notification Types */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Types</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">Campaign Updates</p>
                          <p className="text-sm text-muted-foreground">Notifications about your campaign progress</p>
                        </div>
                        <Controller
                          name="campaignUpdates"
                          control={notificationForm.control}
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">Collaboration Requests</p>
                          <p className="text-sm text-muted-foreground">New collaboration requests and messages</p>
                        </div>
                        <Controller
                          name="collaborationRequests"
                          control={notificationForm.control}
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">Payment Alerts</p>
                          <p className="text-sm text-muted-foreground">Payment status and income notifications</p>
                        </div>
                        <Controller
                          name="paymentAlerts"
                          control={notificationForm.control}
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">Weekly Digest</p>
                          <p className="text-sm text-muted-foreground">Weekly activity summary and statistics</p>
                        </div>
                        <Controller
                          name="weeklyDigest"
                          control={notificationForm.control}
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">Marketing Emails</p>
                          <p className="text-sm text-muted-foreground">Product updates and promotional offers</p>
                        </div>
                        <Controller
                          name="marketingEmails"
                          control={notificationForm.control}
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit">
                      Save Settings
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Password Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Password Management</CardTitle>
                  <CardDescription>Regularly change your password to protect your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Shield className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                          Please fill in the following information to change your password
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            placeholder="Enter current password"
                            {...passwordForm.register('currentPassword')}
                          />
                          {passwordForm.formState.errors.currentPassword && (
                            <p className="text-sm text-red-500">{passwordForm.formState.errors.currentPassword.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="Enter new password"
                            {...passwordForm.register('newPassword')}
                          />
                          {passwordForm.formState.errors.newPassword && (
                            <p className="text-sm text-red-500">{passwordForm.formState.errors.newPassword.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Enter new password again"
                            {...passwordForm.register('confirmPassword')}
                          />
                          {passwordForm.formState.errors.confirmPassword && (
                            <p className="text-sm text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p>
                          )}
                        </div>
                        <div className="rounded-lg bg-muted p-3 text-sm">
                          <p className="font-medium mb-2">Password Requirements:</p>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>At least 8 characters</li>
                            <li>Contains uppercase and lowercase letters</li>
                            <li>Contains numbers</li>
                          </ul>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Confirm Change
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* 2FA */}
              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add extra security to your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-100 text-green-600">
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Enabled</p>
                        <p className="text-sm text-muted-foreground">Verify via SMS code</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Two-factor authentication provides extra security for your account. Even if your password is compromised, attackers cannot access your account.
                  </p>
                </CardContent>
              </Card>

              {/* Devices */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Device Management</CardTitle>
                  <CardDescription>View and manage your login devices</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {devices?.map((device: any) => (
                        <TableRow key={device.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Globe className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{device.browser} on {device.os}</p>
                                <p className="text-sm text-muted-foreground">{device.location}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{device.ip}</TableCell>
                          <TableCell className="text-muted-foreground">{device.lastActive}</TableCell>
                          <TableCell>
                            {device.isCurrent ? (
                              <Badge>Current Device</Badge>
                            ) : (
                              <Badge variant="secondary">Logged In</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {!device.isCurrent && (
                              <Button variant="ghost" size="sm" className="text-red-500">
                                Log Out
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Security Recommendations */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Security Recommendations</CardTitle>
                  <CardDescription>Recommendations to improve account security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800">Password Strength Good</p>
                        <p className="text-sm text-green-700">Your password meets security requirements</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800">2FA Enabled</p>
                        <p className="text-sm text-green-700">Your account is extra protected</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800">Bind Phone Number Recommended</p>
                        <p className="text-sm text-yellow-700">Binding a phone number improves security and helps with password recovery</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize your interface appearance and experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium">Theme</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div 
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        theme === 'light' ? 'border-primary bg-primary/5' : 'border-muted'
                      }`}
                      onClick={() => setTheme('light')}
                    >
                      <div className="flex items-center gap-3">
                        <Sun className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Light Mode</p>
                          <p className="text-sm text-muted-foreground">Use light theme</p>
                        </div>
                      </div>
                    </div>
                    <div 
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        theme === 'dark' ? 'border-primary bg-primary/5' : 'border-muted'
                      }`}
                      onClick={() => setTheme('dark')}
                    >
                      <div className="flex items-center gap-3">
                        <Moon className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Dark Mode</p>
                          <p className="text-sm text-muted-foreground">Use dark theme</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Language Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium">Language and Region</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Interface Language</Label>
                      <Select defaultValue="zh-CN">
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zh-CN">Chinese (Simplified)</SelectItem>
                          <SelectItem value="en-US">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Time Zone</Label>
                      <Select defaultValue="America/New_York">
                        <SelectTrigger>
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">America/New York (UTC-5)</SelectItem>
                          <SelectItem value="America/Los_Angeles">America/Los Angeles (UTC-8)</SelectItem>
                          <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date Format</Label>
                      <Select defaultValue="YYYY-MM-DD">
                        <SelectTrigger>
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="YYYY-MM-DD">2025-12-24</SelectItem>
                          <SelectItem value="MM/DD/YYYY">12/24/2025</SelectItem>
                          <SelectItem value="DD/MM/YYYY">24/12/2025</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select defaultValue="CNY">
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CNY">Chinese Yuan (CNY)</SelectItem>
                          <SelectItem value="USD">US Dollar (USD)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
}
