import { Navigation } from "@/components/Navigation";
import { CommunitySection } from "@/components/CommunitySection";
import { Footer } from "@/components/Footer";

export const Community = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <CommunitySection />
      </main>
      <Footer />
    </div>
  );
};