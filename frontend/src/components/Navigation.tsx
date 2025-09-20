import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Shield, BookOpen, Users, Menu, X, User, LogOut, MessageCircle, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Sign Out Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate('/');
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    }
  };

  const navItems = [
    { name: "Verify", icon: Search, href: "/verify" },
    { name: "Learn", icon: BookOpen, href: "/learn" },
    { name: "News", icon: Shield, href: "/news" },
    { name: "Chat", icon: MessageCircle, href: "/chat" },
    { name: "Community", icon: Users, href: "/community" },
    { name: "About", icon: Shield, href: "/about" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <Search className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Truthlens
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 transition-colors duration-200 ${
                  location.pathname === item.href 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
            
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                  >
                    Dashboard
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                            {user.user_metadata?.first_name?.[0] || user.email?.[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/auth')}
                  >
                    Sign In
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-gradient-primary hover:bg-primary-hover"
                    onClick={() => navigate('/auth')}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-200 ${
                    location.pathname === item.href 
                      ? 'text-primary bg-muted' 
                      : 'text-muted-foreground hover:text-primary hover:bg-muted'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="flex flex-col space-y-2 px-3 pt-2">
                {user ? (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
                      className="justify-start"
                    >
                      Dashboard
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => { navigate('/profile'); setIsOpen(false); }}
                      className="justify-start"
                    >
                      Profile
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleSignOut}
                      className="justify-start"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => { navigate('/auth'); setIsOpen(false); }}
                      className="justify-start"
                    >
                      Sign In
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-gradient-primary hover:bg-primary-hover justify-start"
                      onClick={() => { navigate('/auth'); setIsOpen(false); }}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};