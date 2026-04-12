import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { HoroscopeTypeSelector } from "@/components/home/HoroscopeTypeSelector";
import { RasiGrid } from "@/components/home/RasiGrid";
import { PanchangamWidget } from "@/components/home/PanchangamWidget";
import { SpiritualUpdatesWidget } from "@/components/home/SpiritualUpdatesWidget";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <HoroscopeTypeSelector />

        {/* Deity Search CTA */}
        <section className="py-8 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="container text-center">
            <h2 className="text-2xl font-bold font-tamil text-foreground mb-2">கோவில் & தேவதை தேடல்</h2>
            <p className="text-muted-foreground font-tamil mb-4">முருகன், விநாயகர், மாரியம்மன் உட்பட 24+ கோவில்கள் & ஸ்தல வரலாறுகள்</p>
            <Link to="/deity-search">
              <Button size="lg" className="font-tamil">
                <Search className="h-4 w-4 mr-2" /> கோவில்களை தேடுக
              </Button>
            </Link>
          </div>
        </section>

        <SpiritualUpdatesWidget />
        <RasiGrid />
        <PanchangamWidget />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
