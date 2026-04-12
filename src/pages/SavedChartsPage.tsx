import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { FileText, Trash2, Eye } from "lucide-react";
import { BackButton } from "@/components/BackButton";

interface SavedChart {
  id: string;
  name: string | null;
  chart_type: string;
  chart_data: any;
  created_at: string;
}

export default function SavedChartsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [charts, setCharts] = useState<SavedChart[]>([]);

  useEffect(() => {
    if (user) loadCharts();
  }, [user]);

  const loadCharts = async () => {
    const { data } = await supabase
      .from("birth_charts")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setCharts(data);
  };

  const deleteChart = async (id: string) => {
    await supabase.from("birth_charts").delete().eq("id", id);
    loadCharts();
    toast({ title: "நீக்கப்பட்டது" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <BackButton />
          <h1 className="text-3xl font-bold font-tamil text-gradient-sacred mb-8 text-center">
            சேமிக்கப்பட்ட ஜாதகங்கள்
          </h1>

          {charts.length === 0 ? (
            <div className="rasi-card text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-tamil text-muted-foreground">சேமிக்கப்பட்ட ஜாதகங்கள் இல்லை</p>
              <Link to="/birth-chart">
                <Button variant="sacred" className="mt-4 font-tamil">புதிய ஜாதகம் உருவாக்கு</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {charts.map((chart) => (
                <div key={chart.id} className="rasi-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold font-tamil">{chart.name || "பெயரிடப்படாத ஜாதகம்"}</h3>
                      <p className="text-xs text-muted-foreground capitalize">{chart.chart_type}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(chart.created_at).toLocaleDateString("ta-IN")}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => deleteChart(chart.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
