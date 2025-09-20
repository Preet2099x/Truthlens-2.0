import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  TrendingUp, 
  Trophy, 
  Target, 
  Calendar,
  BarChart3,
  Users,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Star,
  Award,
  Activity,
  Clock,
  Flag
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const userStats = {
    verificationsToday: 23,
    accuracyRate: 92,
    totalPoints: 15420,
    leaderboardRank: 127,
    badgesEarned: 8,
    streakDays: 12
  };

  const recentActivity = [
    {
      id: 1,
      type: 'verification',
      content: 'Verified climate change article',
      status: 'verified',
      timestamp: '2 hours ago',
      points: 50
    },
    {
      id: 2,
      type: 'report',
      content: 'Reported misleading social media post',
      status: 'investigating',
      timestamp: '4 hours ago',
      points: 25
    },
    {
      id: 3,
      type: 'quiz',
      content: 'Completed "Deepfake Detection" quiz',
      status: 'completed',
      timestamp: '6 hours ago',
      points: 100
    }
  ];

  const achievements = [
    { name: 'Truth Seeker', description: 'Verified 100 articles', earned: true },
    { name: 'Fact Detective', description: 'Achieved 90% accuracy rate', earned: true },
    { name: 'Community Helper', description: 'Helped 50 users', earned: false },
    { name: 'Streak Master', description: '30-day verification streak', earned: false }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-verified" />;
      case 'investigating':
        return <AlertTriangle className="w-4 h-4 text-suspicious" />;
      case 'completed':
        return <Trophy className="w-4 h-4 text-accent-green" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back, {user?.user_metadata?.first_name || 'Truth Seeker'}!
                </h1>
                <p className="text-muted-foreground mt-1">
                  Keep up the great work fighting misinformation
                </p>
              </div>
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl">
                  {user?.user_metadata?.first_name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card className="hover-lift">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{userStats.verificationsToday}</p>
                    <p className="text-xs text-muted-foreground">Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-verified" />
                  <div>
                    <p className="text-2xl font-bold">{userStats.accuracyRate}%</p>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-accent-green" />
                  <div>
                    <p className="text-2xl font-bold">{userStats.totalPoints.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Points</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-secondary" />
                  <div>
                    <p className="text-2xl font-bold">#{userStats.leaderboardRank}</p>
                    <p className="text-xs text-muted-foreground">Rank</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-accent-orange" />
                  <div>
                    <p className="text-2xl font-bold">{userStats.badgesEarned}</p>
                    <p className="text-xs text-muted-foreground">Badges</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-accent-warning" />
                  <div>
                    <p className="text-2xl font-bold">{userStats.streakDays}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card className="hover-lift">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="w-5 h-5" />
                      <span>Quick Actions</span>
                    </CardTitle>
                    <CardDescription>
                      Jump right into verifying content and earning points
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-gradient-primary hover:bg-primary-hover">
                      <Search className="w-4 h-4 mr-2" />
                      Verify New Content
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Flag className="w-4 h-4 mr-2" />
                      Report Misinformation
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Trophy className="w-4 h-4 mr-2" />
                      Take Daily Quiz
                    </Button>
                  </CardContent>
                </Card>

                {/* Progress Tracking */}
                <Card className="hover-lift">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5" />
                      <span>Progress Tracking</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Daily Goal</span>
                        <span>{userStats.verificationsToday}/30</span>
                      </div>
                      <Progress value={(userStats.verificationsToday / 30) * 100} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Weekly Streak</span>
                        <span>{userStats.streakDays}/7 days</span>
                      </div>
                      <Progress value={(userStats.streakDays / 7) * 100} className="bg-accent-green/20" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Next Badge Progress</span>
                        <span>180/200 verifications</span>
                      </div>
                      <Progress value={90} className="bg-accent-orange/20" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription>
                    Your latest contributions to fighting misinformation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(activity.status)}
                        <div>
                          <p className="font-medium text-sm">{activity.content}</p>
                          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">+{activity.points} pts</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Achievements</span>
                  </CardTitle>
                  <CardDescription>
                    Track your progress and earn badges for your contributions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          achievement.earned 
                            ? 'border-accent-green bg-accent-green/5 hover:bg-accent-green/10' 
                            : 'border-dashed border-muted-foreground/30 hover:border-muted-foreground/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            achievement.earned ? 'bg-accent-green' : 'bg-muted'
                          }`}>
                            {achievement.earned ? (
                              <Star className="w-5 h-5 text-white fill-current" />
                            ) : (
                              <Star className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{achievement.name}</p>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover-lift">
                  <CardHeader>
                    <CardTitle>Verification Accuracy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-verified mb-2">{userStats.accuracyRate}%</div>
                      <p className="text-muted-foreground">Average accuracy this month</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover-lift">
                  <CardHeader>
                    <CardTitle>Community Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Content Verified</span>
                        <span className="font-bold">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reports Submitted</span>
                        <span className="font-bold">89</span>
                      </div>
                      <div className="flex justify-between">
                        <span>People Helped</span>
                        <span className="font-bold">3,456</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};