import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Shield, 
  Target, 
  Users, 
  Globe, 
  Brain, 
  Eye, 
  Zap,
  Heart,
  Award,
  CheckCircle,
  TrendingUp,
  BookOpen
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export const About = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Detection",
      description: "Advanced machine learning algorithms analyze content for authenticity and credibility.",
      color: "bg-gradient-primary"
    },
    {
      icon: Eye,
      title: "Explainable Results",
      description: "Transparent explanations show exactly why content is flagged or verified.",
      color: "bg-gradient-secondary"
    },
    {
      icon: Zap,
      title: "Real-Time Analysis",
      description: "Instant verification of text, images, and audio content as you browse.",
      color: "bg-gradient-primary"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Crowdsourced verification with millions of fact-checkers worldwide.",
      color: "bg-gradient-secondary"
    }
  ];

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "AI Research Director",
      avatar: "SC",
      expertise: "Machine Learning, Natural Language Processing"
    },
    {
      name: "Alex Rodriguez",
      role: "Product Lead",
      avatar: "AR",
      expertise: "User Experience, Product Strategy"
    },
    {
      name: "Dr. Emily Watson",
      role: "Media Literacy Expert",
      avatar: "EW",
      expertise: "Education, Journalism, Fact-Checking"
    },
    {
      name: "Marcus Kim",
      role: "Technology Director",
      avatar: "MK",
      expertise: "Infrastructure, Security, Scalability"
    }
  ];

  const stats = [
    { label: "Content Verified", value: "50M+", icon: CheckCircle },
    { label: "Active Users", value: "2.3M", icon: Users },
    { label: "Accuracy Rate", value: "98.3%", icon: Target },
    { label: "Countries", value: "127", icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-lens">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Fighting Misinformation
                </span>
                <br />
                <span className="text-foreground">Through Technology</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Truthlens combines cutting-edge AI, community intelligence, and educational tools 
                to create a more informed and truthful digital world.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Our Mission
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Empowering everyone with the tools and knowledge to identify, understand, 
                and combat misinformation in our digital age.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Protect Democracy</h3>
                    <p className="text-muted-foreground">
                      Safeguard democratic processes by ensuring citizens have access to accurate, 
                      verified information for informed decision-making.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Educate & Empower</h3>
                    <p className="text-muted-foreground">
                      Build media literacy skills through interactive learning modules, 
                      helping users become skilled fact-checkers themselves.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Build Community</h3>
                    <p className="text-muted-foreground">
                      Foster a global community of truth-seekers working together to create 
                      a more trustworthy information ecosystem.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-lens rounded-2xl"></div>
                <Card className="relative border-0 shadow-xl hover-lift">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Global Impact</h3>
                      <p className="text-muted-foreground">
                        Join millions of users worldwide in the fight against misinformation
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-secondary bg-clip-text text-transparent">
                  How It Works
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Advanced technology meets human intelligence to deliver accurate, 
                explainable content verification.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="hover-lift">
                  <CardHeader>
                    <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Our Impact
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                See how we're making a difference in the fight against misinformation
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center hover-lift">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <p className="text-3xl font-bold mb-2">{stat.value}</p>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-secondary bg-clip-text text-transparent">
                  Meet Our Team
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Experts in AI, journalism, education, and technology working to combat misinformation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center hover-lift">
                  <CardContent className="pt-6">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.expertise}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-lens">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Join the Fight
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Be part of the solution. Help us build a more truthful digital world 
                where accurate information prevails.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:bg-primary-hover text-lg px-8 py-4 h-auto hover-lift"
                >
                  Get Started Today
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-4 h-auto border-primary/20 hover:bg-primary/5 hover-lift"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};