import { Link } from "react-router-dom";
import { rasiData } from "@/data/rasiData";

export function RasiGrid() {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            <span className="text-gradient-sacred font-tamil">12 ராசிகள்</span>
          </h2>
          <p className="text-muted-foreground font-tamil">உங்கள் ராசியைத் தேர்ந்தெடுத்து பலன் அறியுங்கள்</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {rasiData.map((rasi, index) => (
            <Link
              key={rasi.id}
              to={`/rasi/${rasi.id}`}
              className="group animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="rasi-card text-center group-hover:border-primary/30">
                <div className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${rasi.color} text-3xl shadow-sacred transition-transform group-hover:scale-110`}>
                  <span className="text-primary-foreground">{rasi.symbol}</span>
                </div>
                <h3 className="font-bold font-tamil text-sm">{rasi.tamilName}</h3>
                <p className="text-xs text-muted-foreground">{rasi.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
