import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  ArrowRight,
  Loader2,
  Shield,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { authAPI } from "@/lib/api";

export const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignIn = async () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });
      
      // Store the token in localStorage
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in to Truthlens.",
      });
      navigate('/dashboard');
      
    } catch (error) {
      toast({
        title: "Sign In Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!formData.email || !formData.password || !formData.firstName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please check and try again.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const response = await authAPI.signup({
        name: fullName,
        email: formData.email,
        password: formData.password
      });
      
      // Store the token in localStorage if provided
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      toast({
        title: "Account Created!",
        description: "Your account has been created successfully. Welcome to Truthlens!",
      });
      
      // Redirect to dashboard or login page
      navigate('/dashboard');
      
    } catch (error) {
      toast({
        title: "Sign Up Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-lens flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <Search className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Welcome to Truthlens
          </h1>
          <p className="text-muted-foreground mt-2">
            Join the fight against misinformation
          </p>
        </div>

        <Card className="hover-lift animate-scale-in">
          <CardHeader className="space-y-1">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4 mt-4">
                <CardTitle>Sign in to your account</CardTitle>
                <CardDescription>
                  Enter your credentials to access your Truthlens dashboard
                </CardDescription>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleSignIn}
                    disabled={isLoading}
                    className="w-full bg-gradient-primary hover:bg-primary-hover"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-4">
                <CardTitle>Create your account</CardTitle>
                <CardDescription>
                  Join millions fighting misinformation worldwide
                </CardDescription>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          placeholder="First name"
                          className="pl-10"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-10 pr-10"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleSignUp}
                    disabled={isLoading}
                    className="w-full bg-gradient-primary hover:bg-primary-hover"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 animate-fade-in">
          <div className="text-center p-4 rounded-lg bg-card/50 backdrop-blur-sm">
            <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">AI Detection</p>
            <p className="text-xs text-muted-foreground">Advanced verification</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-card/50 backdrop-blur-sm">
            <Globe className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Global Community</p>
            <p className="text-xs text-muted-foreground">Millions of users</p>
          </div>
        </div>
      </div>
    </div>
  );
};