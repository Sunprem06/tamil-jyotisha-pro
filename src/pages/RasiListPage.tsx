import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link, useSearchParams } from "react-router-dom";
import { isPredictionType, PredictionType, rasiData } from "@/data/rasiData";
import { BackButton } from "@/components/BackButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const typeLabels: Record<PredictionType, string> = {
  daily: "இன்றைய",
  weekly: "இந்த வார",
  monthly: "இந்த மாத",
  yearly: "இந்த வருட",
};

export default function RasiListPage() {
  const [searchParams] = useSearchParams();
  const urlType = searchParams.get("type");
  const activeType: PredictionType = isPredictionType(urlType) ? urlType : "daily";
  const todayStr = new Date().toISOString().split("T")[0];

  const { data: latestDate } = useQuery({
    queryKey: ["rasi-list-date", activeType, todayStr],
    queryFn: async () => {
      if (activeType === "daily") {
        const { data, error } = await supabase
          .from("daily_rasi_palan")
          .select("palan_date")
          .eq("palan_date", todayStr)
          .maybeSingle();

        if (error) throw error;
        return data?.palan_date ?? todayStr;
      }

      const { data, error } = await supabase
        .from("rasi_predictions")
        .select("generated_date")
        .eq("prediction_type", activeType)
        .eq("is_active", true)
        .order("generated_date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data?.generated_date ?? null;
    },
  });

  const liveDateLabel = latestDate
    ? `${typeLabels[activeType]} பலன் • ${new Date(latestDate).toLocaleDateString("ta-IN")}`
    : `${typeLabels[activeType]} பலன்`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <BackButton />
          <h1 className="text-3xl font-bold font-display mb-8 text-center">
            <span className="text-gradient-sacred font-tamil">12 ராசிபலன்</span>
            <span className="block text-sm font-tamil text-muted-foreground mt-2">{liveDateLabel}</span>
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {rasiData.map(rasi => (
              <Link key={rasi.id} to={`/rasi/${rasi.id}?type=${activeType}`} className="group">
                <div className="rasi-card text-center group-hover:border-primary/30">
                  <div className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${rasi.color} text-3xl shadow-sacred transition-transform group-hover:scale-110`}>
                    <span className="text-primary-foreground">{rasi.symbol}</span>
                  </div>
                  <h3 className="font-bold font-tamil">{rasi.tamilName}</h3>
                  <p className="text-xs text-muted-foreground">{rasi.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 font-tamil">{liveDateLabel}</p>
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
