import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { MisinformationChecker } from "@/components/MisinformationChecker";
import { EducationModules } from "@/components/EducationModules";
import { CommunitySection } from "@/components/CommunitySection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <MisinformationChecker />
        <EducationModules />
        <CommunitySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
