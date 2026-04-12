import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackButton } from "@/components/BackButton";

export default function MuhurthamPage() {
  const auspiciousDates = [
    { date: "2026-05-03", tamil: "மே 3", event: "திருமணம்" },
    { date: "2026-05-10", tamil: "மே 10", event: "கிரகப்பிரவேசம்" },
    { date: "2026-05-17", tamil: "மே 17", event: "திருமணம்" },
    { date: "2026-05-24", tamil: "மே 24", event: "வாகன பூஜை" },
    { date: "2026-06-07", tamil: "ஜூன் 7", event: "திருமணம்" },
    { date: "2026-06-14", tamil: "ஜூன் 14", event: "கிரகப்பிரவேசம்" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-3xl">
          <BackButton />
          <h1 className="text-3xl font-bold font-display mb-2 text-center">
            <span className="text-gradient-sacred font-tamil">சுப முகூர்த்தம்</span>
          </h1>
          <p className="text-center text-muted-foreground font-tamil mb-8">Auspicious Dates</p>
          <div className="space-y-3">
            {auspiciousDates.map(d => (
              <div key={d.date} className="rasi-card flex items-center justify-between">
                <div>
                  <p className="font-bold font-tamil">{d.tamil}</p>
                  <p className="text-sm text-muted-foreground">{d.date}</p>
                </div>
                <span className="bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-sm font-tamil">{d.event}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
