import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Flag, 
  MessageSquare, 
  ThumbsUp, 
  TrendingUp,
  Shield,
  Globe,
  Heart,
  Star,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  type: 'report' | 'verification' | 'discussion';
  status: 'verified' | 'investigating' | 'debunked';
  votes: number;
  comments: number;
  timeAgo: string;
  tags: string[];
}

export const CommunitySection = () => {
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState<'all' | 'reports' | 'verified' | 'trending'>('all');

  const communityPosts: CommunityPost[] = [
    {
      id: '1',
      author: 'Sarah Chen',
      avatar: 'SC',
      content: 'Suspicious video circulating about climate data - multiple inconsistencies in the charts shown.',
      type: 'report',
      status: 'investigating',
      votes: 23,
      comments: 8,
      timeAgo: '2 hours ago',
      tags: ['Climate', 'Data Manipulation', 'Video']
    },
    {
      id: '2',
      author: 'Alex Rodriguez',
      avatar: 'AR',
      content: 'VERIFIED: The viral image showing flooding was actually from 2019, not current events.',
      type: 'verification',
      status: 'verified',
      votes: 87,
      comments: 15,
      timeAgo: '4 hours ago',
      tags: ['Weather', 'Image Verification', 'Context']
    },
    {
      id: '3',
      author: 'Dr. Emily Watson',
      avatar: 'EW',
      content: 'Great discussion on identifying AI-generated medical content. Key signs to look for...',
      type: 'discussion',
      status: 'verified',
      votes: 45,
      comments: 22,
      timeAgo: '6 hours ago',
      tags: ['AI Detection', 'Medical', 'Education']
    }
  ];

  const handleReport = () => {
    toast({
      title: "Report Content",
      description: "Community reporting requires Supabase integration for data storage and moderation.",
      variant: "default",
    });
  };

  const handleJoinCommunity = () => {
    toast({
      title: "Join Community",
      description: "Community features require user authentication. Please connect Supabase first.",
      variant: "default",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-verified text-verified-foreground';
      case 'investigating':
        return 'bg-suspicious text-suspicious-foreground';
      case 'debunked':
        return 'bg-unverified text-unverified-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'report':
        return <Flag className="w-4 h-4" />;
      case 'verification':
        return <Shield className="w-4 h-4" />;
      case 'discussion':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <section id="community" className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Community Power
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join millions of fact-checkers, researchers, and concerned citizens 
            working together to combat misinformation and build a more informed world.
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="text-center hover-lift">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <p className="text-2xl font-bold">2.3M</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover-lift">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                <Flag className="w-6 h-6 text-secondary-foreground" />
              </div>
              <p className="text-2xl font-bold">15.7K</p>
              <p className="text-sm text-muted-foreground">Reports This Week</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover-lift">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <p className="text-2xl font-bold">98.3%</p>
              <p className="text-sm text-muted-foreground">Accuracy Rate</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover-lift">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                <Globe className="w-6 h-6 text-secondary-foreground" />
              </div>
              <p className="text-2xl font-bold">127</p>
              <p className="text-sm text-muted-foreground">Countries</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Community Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Community Feed</h3>
              
              {/* Filter Buttons */}
              <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'reports', label: 'Reports' },
                  { key: 'verified', label: 'Verified' },
                  { key: 'trending', label: 'Trending' }
                ].map(({ key, label }) => (
                  <Button
                    key={key}
                    variant={activeFilter === key ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveFilter(key as typeof activeFilter)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <Card key={post.id} className="hover-lift">
                  <CardContent className="pt-4">
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                          {post.avatar}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{post.author}</p>
                            <Badge className={getStatusColor(post.status)}>
                              {getTypeIcon(post.type)}
                              {post.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{post.timeAgo}</p>
                        </div>
                        
                        <p className="text-sm">{post.content}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{post.votes}</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.comments}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Report Content Card */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Flag className="w-5 h-5" />
                  <span>Report Misinformation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Found suspicious content? Help the community by reporting it for verification.
                </p>
                <Button 
                  className="w-full bg-gradient-primary hover:bg-primary-hover"
                  onClick={handleReport}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Submit Report
                </Button>
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Top Contributors</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Dr. Maria Santos', points: 15420, avatar: 'MS' },
                  { name: 'John Kim', points: 12890, avatar: 'JK' },
                  { name: 'Lisa Thompson', points: 11250, avatar: 'LT' }
                ].map((contributor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-secondary text-secondary-foreground text-xs">
                          {contributor.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{contributor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {contributor.points.toLocaleString()} points
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {index === 0 && <Star className="w-4 h-4 text-accent-orange fill-current" />}
                      {index === 1 && <Star className="w-4 h-4 text-muted-foreground fill-current" />}
                      {index === 2 && <Star className="w-4 h-4 text-accent-warning fill-current" />}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Join Community */}
            <Card className="hover-lift bg-gradient-lens">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Join the Movement</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Become part of the global effort to combat misinformation
                </p>
                <Button 
                  className="w-full bg-gradient-secondary hover:bg-secondary-hover"
                  onClick={handleJoinCommunity}
                >
                  Join Community
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};