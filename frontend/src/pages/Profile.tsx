import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  Globe, 
  Camera,
  Save,
  Settings,
  Award,
  BarChart3
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    email: user?.email || '',
    bio: 'Passionate about fighting misinformation and promoting media literacy.',
    location: 'Global',
    expertise: ['Fact-checking', 'Media Analysis', 'Source Verification']
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    communityUpdates: true
  });

  const handleSaveProfile = () => {
    // In a real app, this would make an API call to update the profile
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Sign Out Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    }
  };

  const userStats = {
    totalVerifications: 1247,
    accuracyRate: 92,
    pointsEarned: 15420,
    rank: 127,
    badgesEarned: 8,
    joinedDate: 'January 2024'
  };

  const badges = [
    { name: 'Truth Seeker', description: 'Verified 100+ articles', color: 'bg-verified' },
    { name: 'Fact Detective', description: '90%+ accuracy rate', color: 'bg-accent-green' },
    { name: 'Community Helper', description: 'Helped 50+ users', color: 'bg-secondary' },
    { name: 'Streak Master', description: '10-day streak', color: 'bg-accent-orange' },
    { name: 'Early Adopter', description: 'Joined in beta', color: 'bg-accent-warning' },
    { name: 'Data Analyst', description: 'Analyzed 500+ sources', color: 'bg-primary' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                    {profileData.firstName[0]}{profileData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full p-2"
                >
                  <Camera className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <p className="text-muted-foreground mt-1">{profileData.bio}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Globe className="w-3 h-3" />
                    <span>{profileData.location}</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <BarChart3 className="w-3 h-3" />
                    <span>Rank #{userStats.rank}</span>
                  </Badge>
                </div>
              </div>

              <Button 
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
              >
                <Settings className="w-4 h-4 mr-2" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center hover-lift">
              <CardContent className="pt-4">
                <p className="text-2xl font-bold">{userStats.totalVerifications}</p>
                <p className="text-sm text-muted-foreground">Verifications</p>
              </CardContent>
            </Card>
            <Card className="text-center hover-lift">
              <CardContent className="pt-4">
                <p className="text-2xl font-bold">{userStats.accuracyRate}%</p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </CardContent>
            </Card>
            <Card className="text-center hover-lift">
              <CardContent className="pt-4">
                <p className="text-2xl font-bold">{userStats.pointsEarned.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Points</p>
              </CardContent>
            </Card>
            <Card className="text-center hover-lift">
              <CardContent className="pt-4">
                <p className="text-2xl font-bold">{userStats.badgesEarned}</p>
                <p className="text-sm text-muted-foreground">Badges</p>
              </CardContent>
            </Card>
          </div>

          {/* Profile Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and profile information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled={true}
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed from here. Contact support if needed.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  {isEditing && (
                    <Button onClick={handleSaveProfile} className="w-full bg-gradient-primary hover:bg-primary-hover">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="badges" className="space-y-6">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Achievements & Badges</span>
                  </CardTitle>
                  <CardDescription>
                    Your earned badges and achievements on Truthlens
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {badges.map((badge, index) => (
                      <div key={index} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full ${badge.color} flex items-center justify-center`}>
                            <Award className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{badge.name}</p>
                            <p className="text-sm text-muted-foreground">{badge.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                  <CardDescription>
                    Manage how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch 
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                    </div>
                    <Switch 
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushNotifications: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Weekly Digest</p>
                      <p className="text-sm text-muted-foreground">Weekly summary of your activity</p>
                    </div>
                    <Switch 
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyDigest: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Community Updates</p>
                      <p className="text-sm text-muted-foreground">Updates from the Truthlens community</p>
                    </div>
                    <Switch 
                      checked={notifications.communityUpdates}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, communityUpdates: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Security Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Manage your account security and privacy settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Enable Two-Factor Authentication
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Download My Data
                  </Button>
                  
                  <div className="pt-4 border-t">
                    <Button 
                      variant="destructive" 
                      onClick={handleSignOut}
                      className="w-full"
                    >
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};