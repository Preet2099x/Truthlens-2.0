import { Navigation } from "@/components/Navigation";
import { MisinformationChecker } from "@/components/MisinformationChecker";
import { Footer } from "@/components/Footer";

export const Verify = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <MisinformationChecker />
      </main>
      <Footer />
    </div>
  );
};