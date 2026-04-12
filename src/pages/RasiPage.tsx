import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { rasiData } from "@/data/rasiData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Heart, Briefcase, Activity, Wallet, RefreshCw } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TamilLoader } from "@/components/TamilLoader";
import { useState } from "react";
import { toast } from "sonner";

function PredictionCard({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) {
  return (
    <div className="rasi-card flex items-start gap-3">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <p className="text-sm font-bold font-tamil text-muted-foreground">{label}</p>
        <p className="font-tamil leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

export default function RasiPage() {
  const { rasiId } = useParams();
  const rasi = rasiData.find(r => r.id === rasiId);
  const [activeType, setActiveType] = useState("daily");
  const [generating, setGenerating] = useState(false);

  const { data: prediction, isLoading, refetch } = useQuery({
    queryKey: ["rasi-prediction", rasiId, activeType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rasi_predictions")
        .select("*")
        .eq("rasi_id", rasiId!)
        .eq("prediction_type", activeType)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!rasiId,
  });

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-rasi-predictions", {
        body: { prediction_type: activeType },
      });
      if (error) throw error;
      toast.success(`${data.generated} ராசிகளுக்கு புதிய பலன் உருவாக்கப்பட்டது!`);
      refetch();
    } catch (e: any) {
      toast.error("பலன் உருவாக்க முடியவில்லை: " + e.message);
    } finally {
      setGenerating(false);
    }
  };

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
            <div className="flex justify-center gap-4 mt-4 text-sm flex-wrap">
              <span className="bg-muted px-3 py-1 rounded-full font-tamil">{rasi.element}</span>
              <span className="bg-muted px-3 py-1 rounded-full">Ruling: {rasi.ruling}</span>
              <span className="bg-muted px-3 py-1 rounded-full">{rasi.dates}</span>
            </div>
          </div>

          <Tabs value={activeType} onValueChange={setActiveType} className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="daily" className="font-tamil text-xs">தினசரி</TabsTrigger>
              <TabsTrigger value="weekly" className="font-tamil text-xs">வாராந்திர</TabsTrigger>
              <TabsTrigger value="monthly" className="font-tamil text-xs">மாதாந்திர</TabsTrigger>
              <TabsTrigger value="yearly" className="font-tamil text-xs">வருடாந்திர</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <TamilLoader />
          ) : prediction ? (
            <div className="space-y-4">
              <div className="rasi-card">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold font-tamil flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    {activeType === "daily" ? "இன்றைய" : activeType === "weekly" ? "இந்த வார" : activeType === "monthly" ? "இந்த மாத" : "இந்த வருட"} பலன்
                  </h2>
                  <span className="text-xs text-muted-foreground">{new Date(prediction.generated_date).toLocaleDateString('ta-IN')}</span>
                </div>
                <p className="font-tamil leading-relaxed text-lg">{prediction.prediction}</p>
                {prediction.lucky_number && (
                  <div className="flex gap-4 mt-4 text-sm flex-wrap">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-tamil">அதிர்ஷ்ட எண்: {prediction.lucky_number}</span>
                    {prediction.lucky_color && <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-tamil">அதிர்ஷ்ட நிறம்: {prediction.lucky_color}</span>}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prediction.career && <PredictionCard icon={<Briefcase className="h-5 w-5 text-blue-500" />} label="தொழில்" text={prediction.career} />}
                {prediction.finance && <PredictionCard icon={<Wallet className="h-5 w-5 text-green-500" />} label="நிதி" text={prediction.finance} />}
                {prediction.love && <PredictionCard icon={<Heart className="h-5 w-5 text-pink-500" />} label="காதல் / குடும்பம்" text={prediction.love} />}
                {prediction.health && <PredictionCard icon={<Activity className="h-5 w-5 text-red-500" />} label="ஆரோக்கியம்" text={prediction.health} />}
              </div>
            </div>
          ) : (
            <div className="rasi-card text-center py-12 space-y-4">
              <Sparkles className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="font-tamil text-muted-foreground">இன்னும் பலன் உருவாக்கப்படவில்லை</p>
              <Button onClick={handleGenerate} disabled={generating} className="gap-2">
                <RefreshCw className={`h-4 w-4 ${generating ? 'animate-spin' : ''}`} />
                <span className="font-tamil">AI பலன் உருவாக்கு</span>
              </Button>
            </div>
          )}

          {prediction && (
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={handleGenerate} disabled={generating} size="sm" className="gap-2">
                <RefreshCw className={`h-4 w-4 ${generating ? 'animate-spin' : ''}`} />
                <span className="font-tamil">புதிய பலன் உருவாக்கு</span>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
