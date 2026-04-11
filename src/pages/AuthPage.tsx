import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LogIn, UserPlus, Mail, Lock, User, Chrome } from "lucide-react";
import { lovable } from "@/integrations/lovable";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        toast({ title: "வரவேற்கிறோம்!", description: "வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்" });
        navigate("/");
      } else {
        await signUp(email, password, displayName);
        toast({ title: "கணக்கு உருவாக்கப்பட்டது!", description: "உங்கள் மின்னஞ்சலை சரிபார்க்கவும்" });
      }
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
                <span className="text-primary-foreground text-2xl">ௐ</span>
              </div>
              <h1 className="text-2xl font-bold font-tamil text-gradient-sacred">
                {isLogin ? "உள்நுழைக" : "பதிவு செய்க"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {isLogin ? "Sign In" : "Sign Up"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label className="font-tamil">பெயர் (Name)</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      placeholder="உங்கள் பெயர்"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                </div>
              )}
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
              <div>
                <Label className="font-tamil">கடவுச்சொல் (Password)</Label>
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

              <Button variant="sacred" className="w-full font-tamil" disabled={loading}>
                {loading ? "காத்திருக்கவும்..." : isLogin ? (
                  <><LogIn className="h-4 w-4 mr-2" /> உள்நுழைக</>
                ) : (
                  <><UserPlus className="h-4 w-4 mr-2" /> பதிவு செய்க</>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">அல்லது (or)</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full font-tamil"
              onClick={async () => {
                setLoading(true);
                try {
                  const result = await lovable.auth.signInWithOAuth("google");
                  if (result?.error) {
                    toast({ title: "பிழை", description: String(result.error), variant: "destructive" });
                  }
                } catch (error: any) {
                  toast({ title: "பிழை", description: error.message, variant: "destructive" });
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              <Chrome className="h-4 w-4 mr-2" />
              Google மூலம் உள்நுழைக
            </Button>

            <div className="mt-6 text-center space-y-2">
              {isLogin && (
                <Link to="/forgot-password" className="block text-sm text-muted-foreground hover:text-primary hover:underline font-tamil">
                  கடவுச்சொல் மறந்துவிட்டதா? (Forgot Password?)
                </Link>
              )}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline font-tamil"
              >
                {isLogin ? "கணக்கு இல்லையா? பதிவு செய்க" : "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
