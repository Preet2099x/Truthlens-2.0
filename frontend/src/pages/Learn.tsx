import { Navigation } from "@/components/Navigation";
import { EducationModules } from "@/components/EducationModules";
import { Footer } from "@/components/Footer";

export const Learn = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <EducationModules />
      </main>
      <Footer />
    </div>
  );
};