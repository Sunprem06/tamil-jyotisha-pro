import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Lock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "பிழை", description: "கடவுச்சொற்கள் பொருந்தவில்லை", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "பிழை", description: "கடவுச்சொல் குறைந்தது 6 எழுத்துக்கள் இருக்க வேண்டும்", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      toast({ title: "வெற்றி!", description: "கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது" });
      setTimeout(() => navigate("/"), 2000);
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
                <Lock className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold font-tamil text-gradient-sacred">புதிய கடவுச்சொல்</h1>
              <p className="text-muted-foreground text-sm mt-1">Reset Password</p>
            </div>

            {success ? (
              <div className="text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <p className="font-tamil text-muted-foreground">
                  கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது. முகப்புக்கு திருப்பி விடப்படுகிறது...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="font-tamil">புதிய கடவுச்சொல் (New Password)</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <div>
                  <Label className="font-tamil">கடவுச்சொல் உறுதிப்படுத்தல் (Confirm Password)</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <Button variant="sacred" className="w-full font-tamil" disabled={loading}>
                  {loading ? "காத்திருக்கவும்..." : "கடவுச்சொல் மாற்று"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
