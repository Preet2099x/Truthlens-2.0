import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Mic, Globe, Zap, Eye, Brain, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CredibilityDial from '@/components/CredibilityDial';
import heroImage from '@/assets/hero-illustration.png';

const features = [
  {
    icon: Brain,
    title: 'Multi-modal AI Analysis',
    description: 'Analyze text, images, voice, and video content with advanced AI models.',
  },
  {
    icon: Eye,
    title: 'Scam Similarity Detection',
    description: 'Compare against known scams and fraudulent patterns in real-time.',
  },
  {
    icon: Users,
    title: 'Explain Like I\'m 12',
    description: 'Get clear, simple explanations of why content might be misleading.',
  },
  {
    icon: Globe,
    title: 'Multilingual Voice Support',
    description: 'Voice analysis and explanations in multiple languages.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-surface-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Truthlens: <span className="text-truth">Spot Fake.</span>{' '}
                  <span className="text-safe">Stay Informed.</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  AI-powered misinformation detection across text, images, voice, and video. 
                  Verify content instantly and protect yourself from scams.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-truth hover:bg-truth/90">
                  <Link to="/analyze" className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Analyze Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg">
                  <Link to="/analyze?tab=voice" className="flex items-center">
                    <Mic className="mr-2 h-5 w-5" />
                    Try Voice Analysis
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-truth" />
                  <span>Instant Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-safe" />
                  <span>5+ Languages</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-unverified" />
                  <span>Privacy First</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src={heroImage}
                alt="Truthlens AI Analysis Illustration" 
                className="w-full max-w-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Advanced AI Protection
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive misinformation detection powered by cutting-edge artificial intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border border-border hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-truth" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Preview Widget Section */}
      <section className="py-20 bg-surface-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              See It In Action
            </h2>
            <p className="text-xl text-muted-foreground">
              Real-time credibility scoring with detailed explanations
            </p>
          </div>

          <Card className="border border-border p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">Sample Analysis</h3>
                  <p className="text-muted-foreground">
                    "Breaking: Scientists discover cure for all diseases using this one simple trick!"
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Source Verification</span>
                    <span className="text-sm text-scam">Low</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Content Analysis</span>
                    <span className="text-sm text-unverified">Suspicious</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Language Patterns</span>
                    <span className="text-sm text-scam">Clickbait</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong>Explain Like I'm 12:</strong> This headline uses words like "simple trick" 
                    and makes impossible claims. Real scientific breakthroughs are shared through 
                    proper medical journals, not clickbait articles.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <CredibilityDial score={15} size="lg" animated />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Start Protecting Yourself Today
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who trust Truthlens to keep them informed and protected from misinformation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-truth hover:bg-truth/90">
              <Link to="/analyze" className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link to="/integrations">
                View Integrations
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}