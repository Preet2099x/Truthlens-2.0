import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Play, 
  Trophy, 
  Star, 
  CheckCircle, 
  Lock,
  Target,
  Users,
  Award,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  progress: number;
  locked: boolean;
  badge?: string;
  topics: string[];
}

export const EducationModules = () => {
  const { toast } = useToast();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const modules: Module[] = [
    {
      id: 'basics',
      title: 'Misinformation Basics',
      description: 'Learn fundamental concepts of misinformation, how it spreads, and why it matters.',
      difficulty: 'Beginner',
      duration: '15 min',
      progress: 100,
      locked: false,
      badge: 'Truth Seeker',
      topics: ['What is misinformation?', 'Types of false information', 'Impact on society']
    },
    {
      id: 'detection',
      title: 'Detection Techniques',
      description: 'Master the art of spotting misinformation using proven verification methods.',
      difficulty: 'Intermediate',
      duration: '25 min',
      progress: 65,
      locked: false,
      badge: 'Fact Detective',
      topics: ['Source verification', 'Cross-referencing', 'Red flag indicators']
    },
    {
      id: 'deepfakes',
      title: 'Deepfakes & AI Content',
      description: 'Understand AI-generated content and learn to identify sophisticated fakes.',
      difficulty: 'Advanced',
      duration: '30 min',
      progress: 20,
      locked: false,
      topics: ['AI content detection', 'Visual inconsistencies', 'Audio analysis']
    },
    {
      id: 'social-media',
      title: 'Social Media Literacy',
      description: 'Navigate social platforms safely and identify manipulative content strategies.',
      difficulty: 'Intermediate',
      duration: '20 min',
      progress: 0,
      locked: true,
      topics: ['Echo chambers', 'Algorithmic bias', 'Bot detection']
    }
  ];

  const handleModuleClick = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (module?.locked) {
      toast({
        title: "Module Locked",
        description: "Complete previous modules to unlock this content.",
        variant: "default",
      });
      return;
    }

    toast({
      title: "Feature Coming Soon",
      description: "Interactive learning modules require Supabase integration for progress tracking.",
      variant: "default",
    });
    setSelectedModule(moduleId);
  };

  const handleQuizStart = () => {
    toast({
      title: "Quiz Feature",
      description: "Gamified quizzes require backend integration for scoring and achievements.",
      variant: "default",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-verified text-verified-foreground';
      case 'Intermediate':
        return 'bg-suspicious text-suspicious-foreground';
      case 'Advanced':
        return 'bg-unverified text-unverified-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <section id="learn" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              Learn & Grow
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Build your media literacy skills through interactive modules, 
            gamified quizzes, and hands-on practice exercises.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="text-center hover-lift">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-6 h-6 text-primary-foreground" />
              </div>
              <p className="text-2xl font-bold">2</p>
              <p className="text-sm text-muted-foreground">Badges Earned</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover-lift">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-6 h-6 text-secondary-foreground" />
              </div>
              <p className="text-2xl font-bold">85%</p>
              <p className="text-sm text-muted-foreground">Accuracy Rate</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover-lift">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <p className="text-2xl font-bold">1,247</p>
              <p className="text-sm text-muted-foreground">Points Earned</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover-lift">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-secondary-foreground" />
              </div>
              <p className="text-2xl font-bold">#42</p>
              <p className="text-sm text-muted-foreground">Leaderboard</p>
            </CardContent>
          </Card>
        </div>

        {/* Learning Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {modules.map((module) => (
            <Card 
              key={module.id} 
              className={`hover-lift cursor-pointer transition-all duration-300 ${
                module.locked ? 'opacity-60' : 'hover:shadow-medium'
              } ${selectedModule === module.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => handleModuleClick(module.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center space-x-2 mb-2">
                      {module.locked ? (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      ) : module.progress === 100 ? (
                        <CheckCircle className="w-5 h-5 text-verified" />
                      ) : (
                        <BookOpen className="w-5 h-5" />
                      )}
                      <span className={module.locked ? 'text-muted-foreground' : ''}>
                        {module.title}
                      </span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mb-3">
                      {module.description}
                    </p>
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge className={getDifficultyColor(module.difficulty)}>
                        {module.difficulty}
                      </Badge>
                      <Badge variant="outline">{module.duration}</Badge>
                      {module.badge && module.progress === 100 && (
                        <Badge variant="default" className="bg-accent-green text-white">
                          <Award className="w-3 h-3 mr-1" />
                          {module.badge}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {!module.locked && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="progress-animate" />
                  </div>
                )}
              </CardHeader>

              <CardContent>
                {/* Topics Preview */}
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium">Topics Covered:</p>
                  <div className="flex flex-wrap gap-1">
                    {module.topics.map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full" 
                  variant={module.locked ? "outline" : "default"}
                  disabled={module.locked}
                >
                  {module.locked ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Locked
                    </>
                  ) : module.progress === 0 ? (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Module
                    </>
                  ) : module.progress === 100 ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Review
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Continue
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Quiz Section */}
        <Card className="text-center hover-lift bg-gradient-lens">
          <CardContent className="py-12">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Test Your Skills</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Take our daily quiz to test your misinformation detection skills 
              and compete with other users on the global leaderboard.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:bg-primary-hover"
              onClick={handleQuizStart}
            >
              <Trophy className="w-5 h-5 mr-2" />
              Start Daily Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};