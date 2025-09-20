import { Button } from "@/components/ui/button";
import { 
  Search, 
  BookOpen, 
  Users, 
  Shield, 
  Mail, 
  Twitter, 
  Github, 
  Globe,
  Heart
} from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <Search className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Truthlens
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Empowering everyone with AI-powered misinformation detection 
              and media literacy education for a more informed world.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="p-2">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Platform</h3>
            <div className="space-y-2">
              <a href="#verify" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Search className="w-4 h-4" />
                <span>Content Verification</span>
              </a>
              <a href="#learn" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <BookOpen className="w-4 h-4" />
                <span>Learning Modules</span>
              </a>
              <a href="#community" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Users className="w-4 h-4" />
                <span>Community</span>
              </a>
              <a href="#" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Shield className="w-4 h-4" />
                <span>API Access</span>
              </a>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold">Resources</h3>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Documentation
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Research Papers
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Media Literacy Guide
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Fact-Checking Tools
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Blog & Updates
              </a>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Help Center
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>© {currentYear} Truthlens.</span>
            <span>Built with</span>
            <Heart className="w-4 h-4 text-accent-danger fill-current" />
            <span>for a more truthful world.</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Globe className="w-4 h-4" />
              <span>Available in 12 languages</span>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <span>Status: All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};