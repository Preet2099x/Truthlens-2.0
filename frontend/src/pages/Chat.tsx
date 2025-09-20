import { Navigation } from "@/components/Navigation";
import { VoiceChatbot } from "@/components/VoiceChatbot";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

export const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-16 text-center">
            <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-8" />
            <h1 className="text-3xl font-bold mb-4">AI Voice Chat</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Sign in to start chatting with our AI assistant using voice or text. 
              Get personalized fact-checking and educational content.
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-primary hover:bg-primary-hover"
            >
              Sign In to Chat
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <VoiceChatbot />
      </main>
      <Footer />
    </div>
  );
};