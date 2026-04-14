import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LogOut, User, Shield, MessageSquare, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const TEMPLE_CATEGORIES = [
  { href: "/dashboard", label: "🛕 கோவில் முகப்பு", labelEn: "Temple Dashboard" },
  { href: "/deity/Vinayagar", label: "🐘 விநாயகர்", labelEn: "Vinayagar" },
  { href: "/deity/Shiva", label: "🕉 சிவன்", labelEn: "Shiva" },
  { href: "/deity/Parvathi", label: "🔱 பார்வதி / அம்மன்", labelEn: "Parvathi / Amman" },
  { href: "/deity/Vishnu", label: "🔵 விஷ்ணு / பெருமாள்", labelEn: "Vishnu" },
  { href: "/deity/Lakshmi", label: "🪷 மகாலட்சுமி", labelEn: "Mahalakshmi" },
  { href: "/deity/Murugan", label: "🦚 முருகன்", labelEn: "Murugan" },
  { href: "/deity/Saraswathi", label: "📚 சரஸ்வதி", labelEn: "Saraswathi" },
  { href: "/deity/Ayyanar", label: "🐴 அய்யனார் / ஐயப்பன்", labelEn: "Ayyanar" },
  { href: "/nayanmars", label: "🙏 63 நாயன்மார்கள்", labelEn: "63 Nayanmars" },
  { href: "/alwars", label: "🪷 12 ஆழ்வார்கள்", labelEn: "12 Alwars" },
  { href: "/temple-map", label: "🗺️ வரைபடம்", labelEn: "Temple Map" },
  { href: "/deity-search", label: "🔍 அனைத்தும் தேடு", labelEn: "Search All" },
];

const JATHAGAM_ITEMS = [
  { href: "/birth-chart", label: "📜 ஜாதகம்", labelEn: "Birth Chart" },
  { href: "/porutham", label: "💑 பொருத்தம்", labelEn: "Matching" },
  { href: "/dasha", label: "⏳ தசா", labelEn: "Dasha" },
  { href: "/dosha", label: "⚠️ தோஷம்", labelEn: "Dosha" },
  { href: "/transit", label: "🪐 கோசாரம்", labelEn: "Transit" },
  { href: "/remedies", label: "🙏 பரிகாரம்", labelEn: "Remedies" },
];

const navLinks = [
  { href: "/", label: "முகப்பு", labelEn: "Home" },
  { href: "/rasi", label: "ராசிபலன்", labelEn: "Horoscope" },
  { href: "/panchangam", label: "பஞ்சாங்கம்", labelEn: "Panchangam" },
  { href: "/calendar", label: "நாள்காட்டி", labelEn: "Calendar" },
  { href: "/matrimony/search", label: "திருமணம்", labelEn: "Matrimony" },
  { href: "/spiritual-updates", label: "ஆன்மீக அப்டேட்", labelEn: "Spiritual Updates" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [templeOpen, setTempleOpen] = useState(false);
  const [jathagamOpen, setJathagamOpen] = useState(false);
  const [mobileTempleOpen, setMobileTempleOpen] = useState(false);
  const [mobileJathagamOpen, setMobileJathagamOpen] = useState(false);
  const templeRef = useRef<HTMLDivElement>(null);
  const jathagamRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.from("user_roles").select("role").eq("user_id", user.id).then(({ data }) => {
      const adminRoles = ["super_admin", "admin", "moderator", "support_agent", "analyst"];
      setIsAdmin(data?.some(r => adminRoles.includes(r.role)) ?? false);
    });
  }, [user]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (templeRef.current && !templeRef.current.contains(e.target as Node)) setTempleOpen(false);
      if (jathagamRef.current && !jathagamRef.current.contains(e.target as Node)) setJathagamOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isTempleActive = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/deity") || location.pathname.startsWith("/temple");
  const isJathagamActive = ["/birth-chart", "/porutham", "/dasha", "/dosha", "/transit", "/remedies"].some(p => location.pathname.startsWith(p));

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-gradient-sacred flex items-center justify-center shadow-sacred">
            <span className="text-primary-foreground text-lg">ௐ</span>
          </div>
          <div>
            <h1 className="text-lg font-bold font-tamil text-gradient-sacred leading-tight">ஆன்மீகத் துணை</h1>
            <p className="text-xs text-muted-foreground">Anmeega Thunai</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.slice(0, 1).map((link) => (
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

          {/* Temple Dropdown */}
          <div ref={templeRef} className="relative">
            <button
              onClick={() => setTempleOpen(!templeOpen)}
              className={`px-3 py-2 rounded-lg text-sm font-tamil transition-colors flex items-center gap-1 ${
                isTempleActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              கோவில் <ChevronDown className={`h-3.5 w-3.5 transition-transform ${templeOpen ? "rotate-180" : ""}`} />
            </button>
            {templeOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-background border border-border rounded-lg shadow-lg z-50 py-1">
                {TEMPLE_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.href}
                    to={cat.href}
                    onClick={() => setTempleOpen(false)}
                    className={`block px-4 py-2.5 text-sm font-tamil transition-colors hover:bg-muted ${
                      location.pathname === cat.href ? "bg-primary/10 text-primary font-semibold" : "text-foreground"
                    }`}
                  >
                    {cat.label}
                    <span className="text-xs text-muted-foreground ml-2">({cat.labelEn})</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Jathagam Dropdown */}
          <div ref={jathagamRef} className="relative">
            <button
              onClick={() => setJathagamOpen(!jathagamOpen)}
              className={`px-3 py-2 rounded-lg text-sm font-tamil transition-colors flex items-center gap-1 ${
                isJathagamActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              ஜாதகம் <ChevronDown className={`h-3.5 w-3.5 transition-transform ${jathagamOpen ? "rotate-180" : ""}`} />
            </button>
            {jathagamOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-background border border-border rounded-lg shadow-lg z-50 py-1">
                {JATHAGAM_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setJathagamOpen(false)}
                    className={`block px-4 py-2.5 text-sm font-tamil transition-colors hover:bg-muted ${
                      location.pathname === item.href ? "bg-primary/10 text-primary font-semibold" : "text-foreground"
                    }`}
                  >
                    {item.label}
                    <span className="text-xs text-muted-foreground ml-2">({item.labelEn})</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navLinks.slice(1).map((link) => (
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
        <div className="lg:hidden border-t border-border bg-background max-h-[80vh] overflow-y-auto">
          <nav className="container py-4 flex flex-col gap-1">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-tamil transition-colors ${
                location.pathname === "/" ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              முகப்பு <span className="text-xs text-muted-foreground ml-1">(Home)</span>
            </Link>

            {/* Mobile Temple Accordion */}
            <button
              onClick={() => setMobileTempleOpen(!mobileTempleOpen)}
              className={`px-4 py-3 rounded-lg text-sm font-tamil transition-colors flex items-center justify-between ${
                isTempleActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <span>கோவில் <span className="text-xs text-muted-foreground ml-1">(Temples)</span></span>
              <ChevronDown className={`h-4 w-4 transition-transform ${mobileTempleOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileTempleOpen && (
              <div className="ml-4 flex flex-col gap-0.5 border-l-2 border-primary/20 pl-3">
                {TEMPLE_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.href}
                    to={cat.href}
                    onClick={() => { setIsOpen(false); setMobileTempleOpen(false); }}
                    className={`px-3 py-2 rounded-lg text-sm font-tamil transition-colors ${
                      location.pathname === cat.href ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Mobile Jathagam Accordion */}
            <button
              onClick={() => setMobileJathagamOpen(!mobileJathagamOpen)}
              className={`px-4 py-3 rounded-lg text-sm font-tamil transition-colors flex items-center justify-between ${
                isJathagamActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <span>ஜாதகம் <span className="text-xs text-muted-foreground ml-1">(Astrology)</span></span>
              <ChevronDown className={`h-4 w-4 transition-transform ${mobileJathagamOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileJathagamOpen && (
              <div className="ml-4 flex flex-col gap-0.5 border-l-2 border-primary/20 pl-3">
                {JATHAGAM_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => { setIsOpen(false); setMobileJathagamOpen(false); }}
                    className={`px-3 py-2 rounded-lg text-sm font-tamil transition-colors ${
                      location.pathname === item.href ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {navLinks.slice(1).map((link) => (
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
