import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast({ title: "மின்னஞ்சல் அனுப்பப்பட்டது", description: "கடவுச்சொல் மீட்டமைப்பு இணைப்பை சரிபார்க்கவும்" });
    } catch (error: any) {
      toast({ title: "பிழை", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="rasi-card">
            <div className="text-center mb-8">
              <div className="h-16 w-16 rounded-full bg-gradient-sacred flex items-center justify-center shadow-sacred mx-auto mb-4">
                <Mail className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold font-tamil text-gradient-sacred">கடவுச்சொல் மீட்டமைப்பு</h1>
              <p className="text-muted-foreground text-sm mt-1">Forgot Password</p>
            </div>

            {sent ? (
              <div className="text-center space-y-4">
                <p className="font-tamil text-muted-foreground">
                  கடவுச்சொல் மீட்டமைப்பு இணைப்பு உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டது. தயவுசெய்து உங்கள் இன்பாக்ஸை சரிபார்க்கவும்.
                </p>
                <Link to="/auth">
                  <Button variant="sacred" className="font-tamil">
                    <ArrowLeft className="h-4 w-4 mr-2" /> உள்நுழைவு பக்கத்திற்கு செல்க
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="font-tamil">மின்னஞ்சல் (Email)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button variant="sacred" className="w-full font-tamil" disabled={loading}>
                  {loading ? "காத்திருக்கவும்..." : "மீட்டமைப்பு இணைப்பை அனுப்பு"}
                </Button>
                <div className="text-center">
                  <Link to="/auth" className="text-sm text-primary hover:underline font-tamil">
                    <ArrowLeft className="h-3 w-3 inline mr-1" /> உள்நுழைவு பக்கத்திற்கு திரும்பு
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
