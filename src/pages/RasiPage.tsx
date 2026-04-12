import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { rasiData } from "@/data/rasiData";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BackButton } from "@/components/BackButton";

export default function RasiPage() {
  const { rasiId } = useParams();
  const rasi = rasiData.find(r => r.id === rasiId);

  if (!rasi) return <div className="min-h-screen flex items-center justify-center font-tamil">ராசி கிடைக்கவில்லை</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-3xl">
          <BackButton />
          <Link to="/rasi"><Button variant="ghost" size="sm" className="mb-4 gap-1"><ArrowLeft className="h-4 w-4" /> <span className="font-tamil">அனைத்து ராசிகள்</span></Button></Link>
          <div className="rasi-card text-center mb-8">
            <div className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${rasi.color} text-5xl shadow-glow`}>
              <span className="text-primary-foreground">{rasi.symbol}</span>
            </div>
            <h1 className="text-3xl font-bold font-tamil mb-1">{rasi.tamilName}</h1>
            <p className="text-lg text-muted-foreground">{rasi.name}</p>
            <div className="flex justify-center gap-4 mt-4 text-sm">
              <span className="bg-muted px-3 py-1 rounded-full font-tamil">{rasi.element}</span>
              <span className="bg-muted px-3 py-1 rounded-full">Ruling: {rasi.ruling}</span>
              <span className="bg-muted px-3 py-1 rounded-full">{rasi.dates}</span>
            </div>
          </div>
          <div className="rasi-card">
            <h2 className="text-xl font-bold font-tamil mb-3">இன்றைய பலன்</h2>
            <p className="font-tamil leading-relaxed">இன்று {rasi.tamilName} ராசிக்காரர்களுக்கு நல்ல நாள். தொழிலில் முன்னேற்றம் காணலாம். குடும்பத்தில் மகிழ்ச்சி நிலவும். பொருளாதார நிலை சீராகும். ஆரோக்கியத்தில் கவனம் தேவை.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
