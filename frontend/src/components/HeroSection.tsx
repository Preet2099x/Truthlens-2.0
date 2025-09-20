import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Globe } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const HeroSection = () => {
  const handleGetStarted = () => {
    const verifySection = document.getElementById('verify');
    verifySection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-lens"></div>
      
      {/* Hero Image */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={heroImage} 
          alt="Truthlens AI Detection Technology" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              See Through
            </span>
            <br />
            <span className="text-foreground">Misinformation</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Empower yourself with AI-powered detection, real-time verification, 
            and educational tools to navigate today's complex information landscape.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:bg-primary-hover text-lg px-8 py-4 h-auto hover-lift glow-pulse"
              onClick={handleGetStarted}
            >
              Start Detecting
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-4 h-auto border-primary/20 hover:bg-primary/5 hover-lift"
              onClick={() => document.getElementById('learn')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-card/50 backdrop-blur-sm hover-lift">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Real-Time Analysis</h3>
              <p className="text-muted-foreground text-center">
                Instant AI-powered verification of text, images, and audio content
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-card/50 backdrop-blur-sm hover-lift">
              <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Explainable Results</h3>
              <p className="text-muted-foreground text-center">
                Understand exactly why content is flagged with detailed explanations
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-card/50 backdrop-blur-sm hover-lift">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Global Community</h3>
              <p className="text-muted-foreground text-center">
                Join millions working together to build a more informed world
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};