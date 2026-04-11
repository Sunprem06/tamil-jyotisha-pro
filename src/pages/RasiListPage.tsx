import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { rasiData } from "@/data/rasiData";

export default function RasiListPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <h1 className="text-3xl font-bold font-display mb-8 text-center">
            <span className="text-gradient-sacred font-tamil">12 ராசிபலன்</span>
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {rasiData.map(rasi => (
              <Link key={rasi.id} to={`/rasi/${rasi.id}`} className="group">
                <div className="rasi-card text-center group-hover:border-primary/30">
                  <div className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${rasi.color} text-3xl shadow-sacred transition-transform group-hover:scale-110`}>
                    <span className="text-primary-foreground">{rasi.symbol}</span>
                  </div>
                  <h3 className="font-bold font-tamil">{rasi.tamilName}</h3>
                  <p className="text-xs text-muted-foreground">{rasi.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{rasi.dates}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
