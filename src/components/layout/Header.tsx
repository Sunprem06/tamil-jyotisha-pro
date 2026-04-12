import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LogOut, User, Shield, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { href: "/", label: "முகப்பு", labelEn: "Home" },
  { href: "/dashboard", label: "கோவில்", labelEn: "Temples" },
  { href: "/rasi", label: "ராசிபலன்", labelEn: "Horoscope" },
  { href: "/birth-chart", label: "ஜாதகம்", labelEn: "Birth Chart" },
  { href: "/panchangam", label: "பஞ்சாங்கம்", labelEn: "Panchangam" },
  { href: "/porutham", label: "பொருத்தம்", labelEn: "Matching" },
  { href: "/dasha", label: "தசா", labelEn: "Dasha" },
  { href: "/dosha", label: "தோஷம்", labelEn: "Dosha" },
  { href: "/transit", label: "கோசாரம்", labelEn: "Transit" },
  { href: "/remedies", label: "பரிகாரம்", labelEn: "Remedies" },
  { href: "/matrimony/search", label: "திருமணம்", labelEn: "Matrimony" },
  { href: "/deity-search", label: "தேடல்", labelEn: "Search" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.from("user_roles").select("role").eq("user_id", user.id).then(({ data }) => {
      const adminRoles = ["super_admin", "admin", "moderator", "support_agent", "analyst"];
      setIsAdmin(data?.some(r => adminRoles.includes(r.role)) ?? false);
    });
  }, [user]);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-gradient-sacred flex items-center justify-center shadow-sacred">
            <span className="text-primary-foreground text-lg">ௐ</span>
          </div>
          <div>
            <h1 className="text-lg font-bold font-tamil text-gradient-sacred leading-tight">தமிழ் ஜோதிடம்</h1>
            <p className="text-xs text-muted-foreground">Tamil Jothidam</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-3 py-2 rounded-lg text-sm font-tamil transition-colors ${
                location.pathname === link.href
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="font-tamil">
                  <User className="h-4 w-4 mr-1" /> சுயவிவரம்
                </Button>
              </Link>
              <Link to="/saved-charts">
                <Button variant="ghost" size="sm" className="font-tamil">ஜாதகங்கள்</Button>
              </Link>
              <Link to="/passport">
                <Button variant="ghost" size="sm" className="font-tamil">📖 யாத்திரை</Button>
              </Link>
              <Link to="/messages">
                <Button variant="ghost" size="sm">
                  <MessageSquare className="h-4 w-4 mr-1" /> செய்திகள்
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm">
                    <Shield className="h-4 w-4 mr-1" /> Admin
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="sacred" size="sm" className="font-tamil">
                <LogIn className="h-4 w-4 mr-1" /> உள்நுழைக
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-tamil transition-colors ${
                  location.pathname === link.href
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label} <span className="text-xs text-muted-foreground ml-1">({link.labelEn})</span>
              </Link>
            ))}
            <div className="flex gap-2 mt-2 px-4">
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" size="sm" className="font-tamil">சுயவிவரம்</Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => { signOut(); setIsOpen(false); }}>
                    <LogOut className="h-4 w-4 mr-1" /> வெளியேறு
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="sacred" size="sm" className="font-tamil">
                    <LogIn className="h-4 w-4 mr-1" /> உள்நுழைக
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
