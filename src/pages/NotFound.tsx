import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="text-7xl mb-6">🕉</div>
        <h1 className="text-4xl font-bold font-tamil text-foreground mb-2">
          பக்கம் கிடைக்கவில்லை
        </h1>
        <p className="text-xl text-muted-foreground mb-2">404 — Page not found</p>
        <p className="text-muted-foreground font-tamil mb-8">
          நீங்கள் தேடும் பக்கம் இல்லை அல்லது நகர்த்தப்பட்டது.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-tamil hover:opacity-90 transition"
        >
          முகப்புக்கு திரும்பு
        </Link>
      </main>
      <Footer />
    </div>
  );
}
