import { Navigation } from "@/components/Navigation";
import { NewsSection } from "@/components/NewsSection";
import { Footer } from "@/components/Footer";

export const News = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
};